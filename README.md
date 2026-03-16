<h1 align="center">sequential-thinking</h1>

<p align="center">
  让 AI 在复杂问题里持续推进、允许修正，并最终收敛成结论。<br>
  A reusable skill for controlled multi-step reasoning, revision, comparison, and convergence.
</p>

---

## 一个 skill，一个运行时

| 组件 | 干什么 | 什么时候用 |
|------|--------|-----------|
| **sequential-thinking** | 定义什么时候该进入顺序思考、如何推进、何时修正、如何收敛 | 复杂问题需要多步分析、设计规划、问题分解、候选方案比较时 |
| **sequential-thinking-cli** | 提供 `start / step / replay` 执行协议、自动落盘、回放和导出能力 | 需要把 sequential-thinking 变成一个可执行、可复核、可导出的运行时过程时 |

这个仓库的重点是 **skill 本身**。CLI 不是主角，它只是让这个 skill 真正落地的执行层。

---

## sequential-thinking

`sequential-thinking` 不是“多写几段 thought”的技巧，而是一种面向复杂问题的受控推理方式：**持续推进、允许修正、保留边界，并最终收敛成结论**。

它解决的不是“不会想”，而是：

- 想得太散
- 过早下结论
- 中途出现新证据却不修正
- 候选路径很多但比较失控
- 最终没有留下可复核的推理轨迹

这个 skill 的目标，是把复杂问题处理成一个**有边界、可修正、可复核的推理过程**，而不是让模型一开始就假装自己已经知道答案。

---

## 为什么它不是普通提示词

- **它要求推进**：不是一次性输出整包结论，而是逐步逼近问题核心
- **它允许修正**：前面判断错了，可以明确回头修，不需要硬撑旧前提
- **它支持分支比较**：存在多个候选路径时，先比较再收敛
- **它要求收敛**：不能把“我还能继续想”当作默认出口
- **它保留轨迹**：推理过程应可回放、可导出、可复核

---

## 什么时候用

- 问题需要多个相互关联的推理步骤
- 初始范围或方法不明确，需要先拆问题、再形成方法
- 需要在有限候选方案之间做比较，而不是无限发散
- 需要回看已有判断、识别漏洞、证据不足与隐含假设
- 需要留下可回放、可导出的推理轨迹

**不适用场景：**

- 简单事实查询
- 单步即可完成的任务
- 路径已经非常明确、无需多步推演的问题
- 纯头脑风暴且暂时不要求收敛的场景

---

## 它如何工作

- **先找主问题，再找答案**
- **允许修正，而不是硬撑前提**
- **先消除复杂度，再堆解决方案**
- **每一步只推进一步**
- **最终必须落到结论**

它的核心能力包括：

- **迭代推进**：把复杂问题拆成连续步骤，而不是试图一口气得到完整答案
- **动态修正**：当新证据出现时，允许回看并修正前面的判断
- **分支比较**：当存在替代路径时，允许先比较再收敛
- **上下文保持**：在多步推理中维持清晰的问题边界与目标
- **结论收束**：最终必须形成判断，而不是无限发散

---

## 安装

```bash
npx skills add haaaiawd/sequential-thinking-skills
```

适配所有支持 `SKILL.md` 协议的 AI 客户端。

---

## 如何使用这个 skill

当问题符合以下特征时，让 AI 进入 `sequential-thinking`：

- 需要多步推进
- 需要中途修正
- 需要比较候选路径
- 需要最终收敛成结论

推荐工作流：

```text
1. 先判断问题是否真的需要 sequential-thinking，而不是默认套用。
2. 如需要，进入 sequential-thinking skill。
3. 用 start 定义问题边界、目标、模式和步数。
4. 用 step 逐步推进，每一步只表达当前推进内容。
5. 当出现新证据时，允许修正，而不是硬撑旧判断。
6. 到收敛阶段时，必须输出结论、风险与下一步建议。
7. 完成后按需使用 replay 生成与导出回放文档。
```

---

## 示例

### 基础推演

```bash
sthink start --name "query-diagnosis" --goal "定位查询性能下降的主因" --mode explore --totalSteps 5
sthink step --sessionPath "<session-path>" --content "先不要急着选优化手段。需要先把问题拆成几层：是单条 SQL 退化、接口级 N+1，还是更上层的调用放大。若根因没分清，后面的缓存、索引、重写都可能只是补丁。"
sthink step --sessionPath "<session-path>" --content "从查询日志看，用户详情接口在一次请求里触发了大量重复读取，已经出现明显的 N+1 信号。但还不能直接下结论，因为重复查询也可能只是症状；需要继续确认慢点究竟来自“查询次数过多”，还是“某条关键查询本身很慢”。因此总步数上调一档。"
sthink step --sessionPath "<session-path>" --content "结论可以收敛了：主因是列表页批量加载时触发的 N+1，次因是关联字段缺少索引放大了单次查询成本。优化顺序应该先消除 N+1，再补索引验证尾延迟；这样既先打掉主矛盾，也避免一上来引入缓存复杂度。"
```

### 修正前提

```bash
sthink step --sessionPath "<session-path>" --content "回看 profiling 结果后，前面的判断需要修正：真正拖垮接口的不是 N+1 本身，而是关联列缺少索引，导致每次关联查询都在放大全表扫描成本。也就是说，N+1 仍然存在，但它不是第一性瓶颈，优先级应该后移。"
```

### 分支比较

```bash
sthink start --name "performance-tradeoff" --goal "比较缓存止血与查询优化的优先级" --mode branch --totalSteps 5
sthink step --sessionPath "<session-path>" --content "方案 A：先引入缓存削峰。好处是见效快、对接口层侵入小，适合先止血；坏处是会把问题从“数据库慢”转成“缓存一致性与失效策略复杂”，如果根因其实是查询设计不合理，这条路容易把偶然复杂度永久留在系统里。与此同时，方案 B：直接做索引优化和查询重写。好处是从根上消除瓶颈，长期结构更干净；代价是需要更仔细验证写入放大、锁竞争和回归风险。这条路更慢，但如果业务模型稳定，通常比提前上缓存更符合简单优先的原则。"
```

---

## sequential-thinking-cli

`sequential-thinking-cli` 是这个 skill 的执行层运行时，通过 npm 分发，对外命令名为 `sthink`。

它提供：

- 受控的 step progression
- 基于 runtime 的收敛信号
- 自动落盘的 session state
- completed session 的 replay 生成
- Markdown 导出能力

---

## CLI 前提条件

| 要求 | 说明 |
|------|------|
| Node.js 20+ | `node --version` |
| npm / pnpm | 用于安装 CLI |

---

## 安装 CLI

```bash
npm install -g sequential-thinking-cli

# 或
pnpm add -g sequential-thinking-cli
```

安装后使用：

```bash
sthink
```

---

## CLI Contract

执行层通过三个主路径动作完成：

- `start`
- `step`
- `replay`

### `start`

只接受四个输入：

- `name`
- `goal`
- `mode`
- `totalSteps`

约束：

- `mode` 仅允许 `explore`、`branch`、`audit`
- `totalSteps` 仅允许 `5` 或 `8`

### `step`

只接受：

- `content`

其余上下文由 runtime 自动恢复并注入。

### `replay`

用于读取已完成会话并生成 replay 文档；如需要，可额外导出到当前目录。

---

## Runtime Model

runtime 提供最小必要的 step policy surface：

- `mode`
- `totalSteps`
- `shouldConverge`
- `mustConclude`

这保证了协议足够窄，同时仍然能为受控收敛提供结构支撑。

---

## Storage and Export Boundary

- runtime 会自动保存会话状态与步骤记录
- 完成态可生成 replay 文档
- `replay` 支持导出到当前目录，便于审阅与复用

---

## 仓库结构

```text
Sequential-thinking-skills/
├── README.md
├── LICENSE
├── package.json
├── cli/
├── src/
├── tests/
└── skills/
    └── sequential-thinking-skill/
        └── SKILL.md
```

---

## 开发

```bash
pnpm install
pnpm verify
pnpm build
```

---

## License

MIT
