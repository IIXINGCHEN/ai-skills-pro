# Phase 2 Final Self-Check List

Append this list at the end of every Phase 2 delivery. Tick a box only after real verification; fix first, then claim.

- [ ] **双阶段流程**：严格等用户回复「确认」后才输出代码。
- [ ] **最新 CSS 标准**：OKLCH 色彩空间、Container Queries、Subgrid、`:has()` 伪类、`@layer` 全部应用。
- [ ] **原生 API 优先（适用时）**：存在弹窗才使用原生 `<dialog>` 或 `popover`；存在折叠面板才使用 `<details name>`；存在表单才依赖约束验证与 `:user-invalid`。
- [ ] **数据驱动解耦**：`APP_CONFIG` 经 JSON 序列化并把 `<` 编码为 `\u003c` 后进入 `application/json`；可变文案由解析后的配置与安全 DOM 渲染函数生成。
- [ ] **内容零移植**：文案、数据、价格、品牌名全部由用户输入与项目语境推导，参考文档中的示例值无一残留。
- [ ] **品牌派生可溯**：主色相、字体气质、圆角与密度的选择在交付说明中留有推导记录。
- [ ] **无障碍与流式排版**：字号使用 `clamp()`；实现 `:focus-visible` 与 `prefers-reduced-motion` 降级；文字对比度达到 WCAG AA。
- [ ] **零省略交付**：所有 CSS、JS 与 SVG 完整输出，无 `/* ... */` 或 `// ...` 占位符。
- [ ] **布局硬规范**：8px 栅格、除容器 `margin-inline: auto` 外无布局 margin、基线对齐、图片 cover 填充、固定导航存在时完成避让、容器居中且内部左对齐、四边 padding 统一。
- [ ] **组件状态完备**：按钮含 hover / active / focus-visible / disabled / loading 五态；卡片有 hover 反馈。
- [ ] **高级现代质感**：卡片体系四件套（surface / border / shadow / hover）齐备并以容器查询自适应；无廉价装饰（霓虹滥用、无意义渐变、玻璃拟态堆砌）。
- [ ] **数据状态完整（适用时）**：异步或可变数据工作流具备适用的加载、空、错误、成功态且切换平滑。
- [ ] **移动端适配**：无横向滚动、侧边 padding 16px、可点区域 ≥44px、存在折叠导航时正常开合并设置 `aria-expanded`。
- [ ] **WebKit 滚动条**：已按规范自定义。
- [ ] **高级设计感**：排版节奏（字重 / 行高 / 65ch）、留白呼吸、色彩克制（单主色 + 有限强调 + ≥6 档中性）、几何动效仅用 transform / opacity、颜色状态仅用 color / background-color / border-color。
- [ ] **表单反馈闭环（适用时）**：存在表单时，聚焦态、错误态（role="alert"）、必填标记、提交成功提示齐备，无静默提交。
- [ ] **::selection 高亮**：选中文本背景为主色 20% 透明度的派生值。
