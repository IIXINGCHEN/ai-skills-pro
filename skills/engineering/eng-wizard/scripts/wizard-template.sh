#!/usr/bin/env bash
# wizard-template.sh - 交互式向导模板
#
# 用法:
#   1. 复制本文件到目标路径, 例如: cp wizard-template.sh scripts/setup-stripe.sh
#   2. 在下方 "STAGES 区" 按依赖顺序写 stage_xxx 函数, 只做一件事
#   3. 把 TOTAL_STAGES 改成你写的 stage 数量
#   4. 在 main 里按顺序调用它们
#   5. chmod +x 后交给人运行
#
# 约定: "库函数区"(本注释块以下、STAGES 标记以上)不要改, 保持所有向导行为一致。
# 密钥铁律: 密钥只用 ask_secret 读(不回显)、只走 stdin 传给外部命令、
#           只写进预定的目的地(.env 或 CI secret), 总结时只列名不打印值, 最后 unset。
set -euo pipefail

# ==================== 库函数区(勿动) ====================

_CURRENT=0
TOTAL_STAGES=2  # 改成实际 stage 数

# 分节标题 / 缩进步骤 / 警告(走 stderr)
say()  { printf '\n== %s ==\n' "$*"; }
step() { printf '  - %s\n' "$*"; }
warn() { printf '  ! %s\n' "$*" >&2; }

# 每个 stage 的入口: 清屏, 显示 "步骤 x/y: 标题"
stage() {  # $1 = 标题
  _CURRENT=$((_CURRENT + 1))
  clear
  printf '步骤 %s/%s: %s\n\n' "$_CURRENT" "$TOTAL_STAGES" "$1"
}

# 跨平台打开 URL, 含 WSL; 打不开就提示手动打开, 不报错退出
open_url() {  # $1 = url
  local url="$1"
  echo "正在打开: $url"
  if grep -qi microsoft /proc/version 2>/dev/null; then
    powershell.exe -NoProfile start "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  else
    echo "请手动在浏览器打开: $url"
  fi
}

# 公开值输入, 支持默认值
ask() {  # $1=变量名 $2=提示语 $3=默认值(可选)
  local var="$1" prompt="$2" default="${3:-}" val
  if [ -n "$default" ]; then
    printf '%s [%s]: ' "$prompt" "$default"
  else
    printf '%s: ' "$prompt"
  fi
  IFS= read -r val || true
  [ -z "$val" ] && val="$default"
  printf -v "$var" '%s' "$val"
}

# 密钥输入: 不回显, 为空直接退出
ask_secret() {  # $1=变量名 $2=提示语
  local var="$1" prompt="$2" val
  printf '%s (输入不回显): ' "$prompt"
  IFS= read -rs val || true
  echo
  if [ -z "$val" ]; then
    warn "值不能为空, 已退出"
    exit 1
  fi
  printf -v "$var" '%s' "$val"
  unset val
}

# 幂等写入 .env: 同名 KEY 先删旧行再追加, 不产生重复
write_env() {  # $1=文件 $2=KEY $3=值
  local file="$1" key="$2" value="$3"
  [ -f "$file" ] || touch "$file"
  grep -v "^${key}=" "$file" > "$file.tmp" || true
  printf '%s=%s\n' "$key" "$value" >> "$file.tmp"
  mv "$file.tmp" "$file"
  step "已写入 $file: $key"
}

# 写 GitHub Actions secret: 值走 stdin, 不进进程参数
set_secret() {  # $1=secret名 $2=值
  printf '%s' "$2" | gh secret set "$1" --body -
  step "已设置 CI secret: $1"
}

# 写 GitHub Actions variable(公开值用这个)
set_var() {  # $1=名 $2=值
  gh variable set "$1" --body "$2"
  step "已设置 CI variable: $1"
}

# 等人看完按回车 / 不可逆操作前二次确认, 选否则退出
pause() { read -rp "按回车继续…" _; }
confirm() {  # $1=提示语
  local ans
  read -rp "$1 [y/N]: " ans
  case "$ans" in
    [yY]) ;;
    *) echo "已取消"; exit 1 ;;
  esac
}

# ==================== STAGES 区(从这里开始写) ====================
# 示例 stage, 正式编写时删掉换成真实的。每写完一个记得同步 TOTAL_STAGES。

stage_api_key() {
  stage "获取 API Key 并写入 .env"
  open_url "https://example.com/dashboard/api-keys"
  step "在页面点击 Reveal, 复制 key"
  pause
  ask_secret "API_KEY" "粘贴 API Key"
  write_env ".env" "API_KEY" "$API_KEY"
}

stage_ci_secret() {
  stage "把 API Key 同步为 CI secret"
  confirm "确认写入 GitHub Actions secret? 写入后可在仓库 Settings 里删除"
  set_secret "API_KEY" "$API_KEY"
  unset API_KEY
}

# ==================== 入口 ====================

main() {
  say "向导开始, 共 $TOTAL_STAGES 步"
  stage_api_key
  stage_ci_secret
  say "全部完成"
  step "已写入: .env 中的 API_KEY, CI secret API_KEY"
  step "密钥值未出现在任何输出中"
}

main "$@"
