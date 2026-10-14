# 审计检查命令

S6 用"快速扫描"节；S8 全量跑一遍。`<项目根>` 换成实际路径；一律排除 `node_modules/`、`.git/`。

## 缺陷分级（P0/P1/P2）

code-review skill 不定义分级，本流水线定义如下，S6/S8 的门禁以此为准：

- **P0（阻塞发布）**：安全问题（密钥泄漏、注入、越权、敏感信息落日志）；数据丢失 / 数据损坏风险；核心功能不可用；虚构代码 / 模拟代码 / 硬编码密钥与路径；fail-open（非法配置下降级裸奔）。
- **P1（严重，限期修复）**：核心功能有缺陷但可绕行；性能明显不达标；重要文档缺失或与实现不一致；跨平台问题（某平台不可用）。
- **P2（建议）**：命名、注释、代码风格、非关键的体验优化。不阻塞门禁，但应在发布前尽量清掉，记入复盘。

门禁只看 P0/P1：**零 P0/P1 才能出 S6/S8**。

## 真实性扫描

```bash
# TODO / FIXME / 占位实现：交付代码中一处都不许有
grep -rn --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' --include='*.ts' --include='*.tsx' \
  --include='*.js' --include='*.py' --include='*.sh' \
  -E 'TODO|FIXME|XXX|HACK|待实现|以后实现' <项目根>/

# 生产路径的 mock / 桩 / 演示数据（只查生产代码目录，不查测试目录）
grep -rni --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' --include='*.ts' --include='*.tsx' \
  -E 'mock|fake|stub|dummy|lorem' <项目根>/internal <项目根>/src 2>/dev/null
# 测试文件（*_test.go、*.test.ts、tests/、__tests__/）里的 mock 是允许的，不在此查
```

## 路径扫描

```bash
# 写死的绝对路径（家目录、/root、Windows 盘符）
grep -rn --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' --include='*.ts' --include='*.tsx' \
  --include='*.js' --include='*.py' --include='*.sh' \
  -E '/home/|/root/|[A-Za-z]:\\' <项目根>/

# 写死的 /tmp（应该走 os.MkdirTemp / os.TempDir）
grep -rn --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' --include='*.ts' --include='*.py' \
  -E '"/tmp|'"'"'/tmp' <项目根>/

# 字符串拼接路径分隔符（抽查；细查靠 code-review）
grep -rn --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' -E '\+ "/" \+|\+ "\\\\" \+' <项目根>/
```

## 安全扫描

```bash
# 疑似硬编码的密钥（API key / token / secret 赋值字面量）
grep -rni --exclude-dir=node_modules --exclude-dir=.git \
  --include='*.go' --include='*.ts' --include='*.tsx' \
  --include='*.js' --include='*.py' \
  -E '(api[_-]?key|secret|token|password)\s*[:=]\s*["'"'"'][^"'"'"']{8,}' <项目根>/

# 私钥 / 凭证文件不许进交付
find <项目根>/ -not -path '*/node_modules/*' -not -path '*/.git/*' \
  \( -name '*.pem' -o -name 'id_rsa*' -o -name '*.p12' -o -name 'credentials.json' \)

# 依赖漏洞扫描（对应 STATUS.md"安全"节的"依赖漏洞扫描"复选框）
npm audit --audit-level=high 2>/dev/null      # Node 项目：high 及以上才算 P1
go list -m all 2>/dev/null | grep -v '^$' >/dev/null && govulncheck ./...  # Go 项目
pip-audit 2>/dev/null                          # Python 项目（如无 pip-audit 则用 pip list --outdated 人工核对）
```

## 构建与测试

```bash
# Go
go build ./... && go vet ./... && go test ./...
# 前端
tsc --noEmit && npm run build && npm test
# e2e / 冒烟：跑项目自带的回归脚本（如 e2e/run-all.sh）
```

## 配置与文档一致性（人工核对）

- 本次变更涉及的每个可调项：是否进了配置文件 / 环境变量？非法值是否 fail-closed？
- 本次变更涉及的 API / 配置 / 行为：API.md、README、CHANGELOG 是否同步更新？
- 交付包内容：是否只含本项目文件？版本号各端是否一致？SHA-256 是否可验证？
