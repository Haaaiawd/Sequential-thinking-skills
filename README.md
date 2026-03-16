<h1 align="center">sequential-thinking</h1>

<p align="center">
  Let AI keep advancing through complex problems, revise when needed, and converge to a conclusion.<br>
  A reusable skill for controlled multi-step reasoning, revision, comparison, and convergence.
</p>

<p align="center">
  <a href="README.zh-CN.md">中文文档</a>
</p>

---

## One Skill, One Runtime

| Component | What It Does | When to Use |
|-----------|--------------|-------------|
| **sequential-thinking** | Defines when to enter sequential reasoning, how to advance, when to revise, and how to converge | When a problem requires multi-step analysis, planning, decomposition, or comparison between candidate paths |
| **sequential-thinking-cli** | Provides the `start / step / replay` execution contract, automatic persistence, replay generation, and export | When you want sequential-thinking to run as an executable, reviewable, replayable runtime process |

This repository is primarily about the **skill itself**. The CLI is not the main artifact; it is the execution layer that makes the skill operational.

---

## sequential-thinking

`sequential-thinking` is not a trick for writing more thoughts. It is a controlled reasoning pattern for complex work: **advance continuously, revise when needed, preserve boundaries, and converge to a conclusion**.

It does not solve “the model cannot think.” It solves these more common failures:

- reasoning that drifts
- conclusions reached too early
- no revision when new evidence appears
- uncontrolled comparison between too many paths
- no replayable reasoning trail at the end

The goal of this skill is to turn complex problem solving into a **bounded, revisable, reviewable reasoning process**, instead of letting the model pretend it already knows the answer from the start.

---

## Why This Is Not Just Another Prompt

- **It enforces progression**: you do not dump a full conclusion immediately; you move toward the core problem step by step
- **It allows revision**: if an earlier judgment was wrong, you explicitly correct it instead of carrying a broken premise forward
- **It supports branch comparison**: when multiple paths exist, compare first and converge later
- **It requires convergence**: “I could keep thinking” is not a valid default ending
- **It preserves a trail**: the reasoning process should be replayable, exportable, and reviewable

---

## When to Use It

- The problem needs multiple connected reasoning steps
- The scope or method is unclear and must be decomposed first
- A limited set of candidate paths must be compared instead of allowing open-ended divergence
- An earlier judgment must be reviewed for gaps, weak evidence, or hidden assumptions
- A replayable, exportable reasoning trail is required

**Not a good fit for:**

- simple factual lookups
- tasks that can be completed in a single step
- problems whose path is already obvious
- pure brainstorming sessions that do not need convergence yet

---

## How It Works

- **Find the real problem before chasing the answer**
- **Revise instead of defending a broken premise**
- **Reduce complexity before piling on solutions**
- **Advance one step at a time**
- **End with a conclusion**

Its core capabilities include:

- **Iterative progression**: break complex work into consecutive steps instead of forcing a full answer in one pass
- **Dynamic revision**: when new evidence appears, revisit and correct earlier judgment
- **Branch comparison**: compare alternatives before converging
- **Context retention**: preserve clear problem boundaries and goals across multiple steps
- **Conclusion discipline**: force a real judgment instead of endless divergence

---

## Install

```bash
npx skills add haaaiawd/sequential-thinking-skills
```

Works with AI clients that support the `SKILL.md` protocol.

---

## How To Use This Skill

Enter `sequential-thinking` when the problem has these traits:

- it needs multi-step advancement
- it may require correction in the middle
- it requires comparing candidate paths
- it must eventually converge to a conclusion

Recommended workflow:

```text
1. Decide whether the task truly needs sequential-thinking instead of defaulting to it.
2. If needed, enter the sequential-thinking skill.
3. Use start to define the problem boundary, goal, mode, and step count.
4. Use step to advance gradually, expressing only the current step’s reasoning.
5. When new evidence appears, revise instead of defending the old judgment.
6. At convergence time, produce the conclusion, risks, and next actions.
7. When finished, use replay when needed to generate and export a replay document.
```

---

## Examples

### Baseline Reasoning

```bash
sthink start --name "query-diagnosis" --goal "Identify the primary cause of query performance degradation" --mode explore --totalSteps 5
sthink step --sessionPath "<session-path>" --content "Do not jump straight to optimization tactics. First break the problem into layers: is it a single SQL regression, interface-level N+1 behavior, or amplification from a higher-level call pattern? If the root cause is not separated first, caching, indexing, and rewrites may all become patches instead of real fixes."
sthink step --sessionPath "<session-path>" --content "The query log shows that the user detail endpoint triggers many repeated reads in a single request, which is a clear N+1 signal. But that still is not enough to conclude the root cause, because repeated queries may only be the symptom. We still need to confirm whether the slowdown comes from too many queries or from one especially expensive query. That means the reasoning should stay open a little longer."
sthink step --sessionPath "<session-path>" --content "The conclusion can now converge: the primary issue is N+1 triggered during batch loading on the list page, and the secondary issue is missing indexes on related fields amplifying the cost of each query. The right optimization order is to eliminate the N+1 pattern first, then add indexes and validate tail latency. That sequence removes the main contradiction first and avoids introducing cache complexity too early."
```

### Revising an Earlier Premise

```bash
sthink step --sessionPath "<session-path>" --content "After reviewing the profiling results, the earlier judgment needs correction: the real bottleneck is not N+1 itself, but missing indexes on the join columns, which magnify the cost of every related query into repeated full scans. N+1 still exists, but it is no longer the primary bottleneck, so its priority should move down."
```

### Branch Comparison

```bash
sthink start --name "performance-tradeoff" --goal "Compare cache-first mitigation versus query optimization" --mode branch --totalSteps 5
sthink step --sessionPath "<session-path>" --content "Option A is to introduce caching first. Its advantage is fast relief with relatively low interface-layer intrusion, which is useful when the system needs immediate stabilization. Its downside is that the problem shifts from database slowness to cache consistency and invalidation strategy; if the true root cause is poor query design, this path can permanently preserve accidental complexity. Option B is to optimize indexes and rewrite queries directly. Its advantage is that it removes the bottleneck at the source and keeps the long-term structure cleaner. Its cost is slower execution and the need to validate write amplification, lock contention, and regression risk more carefully. If the business model is stable, this path is usually more aligned with the principle of choosing simplicity over convenience."
```

---

## sequential-thinking-cli

`sequential-thinking-cli` is the execution runtime for this skill. It is distributed through npm, and its command entrypoint is `sthink`.

It provides:

- controlled step progression
- runtime convergence signals
- automatic persistence of session state
- replay generation for completed sessions
- Markdown export

---

## CLI Prerequisites

| Requirement | Check |
|-------------|-------|
| Node.js 20+ | `node --version` |
| npm / pnpm | Used to install the CLI |

---

## Install the CLI

```bash
npm install -g sequential-thinking-cli

# or
pnpm add -g sequential-thinking-cli
```

After installation, use:

```bash
sthink
```

---

## CLI Contract

The runtime executes through three main actions:

- `start`
- `step`
- `replay`

### `start`

Accepts only four inputs:

- `name`
- `goal`
- `mode`
- `totalSteps`

Constraints:

- `mode` must be one of `explore`, `branch`, or `audit`
- `totalSteps` must be either `5` or `8`

### `step`

Accepts only:

- `content`

All other context should be restored and injected by the runtime.

### `replay`

Reads a completed session and generates a replay document. If needed, it can also export the result to the current directory.

---

## Runtime Model

The runtime exposes only the minimum necessary step-policy surface:

- `mode`
- `totalSteps`
- `shouldConverge`
- `mustConclude`

This keeps the protocol narrow while still providing enough structure for controlled convergence.

---

## Storage and Export Boundary

- the runtime automatically persists session state and step records
- completed sessions can generate replay documents
- `replay` can export to the current directory for review and reuse

---

## Repository Structure

```text
Sequential-thinking-skills/
├── README.md
├── README.zh-CN.md
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

## Development

```bash
pnpm install
pnpm verify
pnpm build
```

---

## License

MIT
