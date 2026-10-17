---
title: From Deterministic Component to Agentic System
description: A promotion guide for engineers shipping CLIs, APIs, and libraries
date: 2026-10-17
draft: false
tags:
  - Multi Agent
  - Agentic Systems
  - AI Engineering
---
# 

---

## Why this guide exists

There's a question that never gets asked in agent retrospectives: ***why does this feel harder than it should?***

You're a senior engineer. You've shipped systems that handled real load, debugged race conditions at 3am, designed APIs other teams built on for years. And now you're staring at fifty lines of glue — a component you wrote yourself, moved behind an agent — and you can't tell if it works.

Not "can't prove it works." Can't *tell*. You run it three times, get three different behaviors, and none of them are obviously wrong. The tests pass. The demo worked. And you have no idea what will happen on Tuesday when someone uses it in a way you didn't anticipate.

You assume you're doing it wrong. The frameworks are new, the patterns aren't settled, maybe you need to read more. So you read more. You tune prompts. You add guardrails. You restructure the graph. The feeling doesn't go away.

I want to offer a different diagnosis:

**The feeling isn't a skills gap. It's a mindset gap.**

The mindset that built your component — deterministic, procedural, provable — is not the mindset that runs it once an LLM is in the loop. You didn't become a worse engineer. You walked into a different kind of system wearing the mental model of the old one.

The code is short. The shift underneath it is enormous. And almost nobody tells you it's coming.

This guide is the map I wish someone had handed me before I climbed. It walks the promotion path from deterministic component to agentic system — one rung at a time, with the moment of realization at each rung, and the gate that tells you whether to climb at all.

It isn't a tutorial. It's a guide to **what it takes** — in mindset, not in code — to move from one era of building software to the next.

---

## The mental model you didn't know you had

Every component you've ever shipped has the same shape:

```
input (typed) ──▶ [ your code ] ──▶ output (typed)   + typed errors
```

You've drawn this diagram a thousand times — in design docs, in onboarding decks, on a whiteboard at 11pm. It isn't just how your code works. It's how you *think* software works.

From that shape flows a set of assumptions so deep in your bones you've never had to articulate them:

- I write the procedure. The steps, the order, the branches — they're mine.
- Inputs are typed. Outputs are typed. Failures are exceptions.
- The same input produces the same output. If it doesn't, that's a bug — and I can reproduce it.
- When something goes wrong, the stack trace tells me where.
- When I ship, I know what I shipped.

You don't experience this as a model. You experience it as *what software is*. It's the water you swim in. It's why code review works, why CI works, why your on-call rotation works.

Every rung of the promotion path asks you to give up one of these assumptions. Not all at once — one at a time, quietly, through steps that look like packaging. That's why the climb is disorienting. You're not learning a new tool. You're unlearning the water, one property at a time, without anyone telling you which property is going.

This guide names the properties, rung by rung.

---

## What actually changed

Here's what your component becomes at each step of the promotion (the `[mcp]` label stands for the tool-surface rung — MCP or any tool-callable API):

```
core   : X → Y                      ← deterministic, you own flow
  ──[mcp]──▶   tool  : ToolCall → Result
  ──[agent]──▶ agent : Goal → Trajectory
  ──[a2a]──▶   peer  : Task → AsyncHandle
```

The thing on the right of each arrow **is not the thing on the left.** `core` is not a `tool`. A `tool` is not an `agent`. An `agent` is not a `peer`.

Each hop is an **adapter** — it translates your component from one contract to a different one. And translation between contracts is lossy by construction, because the target contract can't express everything the source contract promised.

| Adapter | Translation | **What it quietly drops** |
|---|---|---|
| `──[mcp]──▶` | `X → Y` ⟶ `ToolCall → Result` | Your docs, call order, typed exceptions, caller judgment, the stack trace |
| `──[agent]──▶` | Tool calls ⟶ `Goal → Trajectory` | Determinism, termination guarantee, *your* control flow, reproducibility |
| `──[a2a]──▶` | Trajectory ⟶ `Task → AsyncHandle` | Synchrony, locality, trust, a single owner of state, cheap debugging |

Those aren't "features you get less of." They're **things you had, and now don't.**

And the part that bites: **each row introduces a new class of failure you now own.**

| Rung | Contract | Who owns flow | Determinism | Failure unit |
|---|---|---|---|---|
| 0 · Core | `X → Y` | Your code | Deterministic | Exception |
| 1 · Tool | `ToolCall → Result` | The model picks *which* | Selection is not | Error the model may ignore |
| 2 · Agent | `Goal → Trajectory` | The agent loop | No | Loop, wrong action, premature stop |
| 3 · Peer | `Task → AsyncHandle` | Distributed peers | No, *and* distributed | Timeout, partial result, peer gone |

A function throws. A tool returns an error the model may ignore. An agent loops, or confidently does the wrong thing, or stops early. A peer times out, or partially completes, or disappears. You cannot `try/catch` your way from the bottom of that table back to the top.

---

## The real shift

One sentence carries the whole guide:

> **Deterministic software is: you write the procedure. Agentic systems are: something else writes the procedure, and you describe the goal and bound the outcome.**

When you write the procedure, you own correctness. When something else writes it, you own **bounds**: how many steps, how much cost, what it may do without asking, what evidence it must produce. You shift from being the author to being the **constraint**.

What it takes isn't a framework. It's a different relationship with your own code — and with your own role in the system. You stop being the person who wrote the answer and become the person who defined what a good answer looks like, what it's not allowed to do, and how you'll know when it did it.

---

## How far to promote — the tree

The most useful question isn't "how do I build an agent?" It's "**how far up do I actually need to promote?**"

*(L0–L3 in the tree below map to Rungs 0–3 in the prose.)*

```
Do you have a component that does X → Y?
│
├─ Can a competent machine call it correctly, first try, without your docs?
│     NO ──▶ L0: Harden the interface. Stop.
│
├─ Does anyone need to choose WHICH tool, or WHEN, in natural language?
│     NO ──▶ It's a CLI/API. Ship it. Stop.
│     YES ─▶ L1:  core ─[mcp]▶ tool        (schema + description)
│
├─ Are the tool calls a FIXED sequence every time?
│     YES ─▶ Write a deterministic workflow. Stop.   ← most common right answer
│
├─ Is judgment genuinely required mid-task (ambiguity, exploration, recovery)?
│     NO ──▶ Workflow. Stop.
│     YES ─▶ L2:  … ─[agent]▶ agent        (budgets + trajectory evals)
│
├─ Does at least one of these apply?
│     · context overload   — toolset/history exceeds one agent
│     · trust isolation    — capabilities need distinct principals
│     · real parallelism   — independent exploration or throughput
│     · specialization     — subtasks need materially different instructions
│     NO ──▶ Single agent. Stop.            ← most common right answer
│     YES ─▶ L3:  … ─[a2a]▶ peer            (accept the distributed-systems tax)
```

The tree isn't a rulebook. It's a set of provocations. Each `Stop` is a question: *have you actually observed the failure this rung would fix, or are you assuming it?* Most of the time, you're assuming it — and the lowest rung that solves the problem is lower than you thought.

Every rung costs you a guarantee you had and a practice you have to rebuild. That's fine — if the rung earns it. Keep the lower-rung deployment live and routable; a promotion you can't reverse is a promotion you didn't gate. The disorientation comes from climbing without knowing you're paying, and without noticing when you could have gotten off.

The rest of this guide is the *why* behind the tree: what each rung actually asks of you, where the climb gets hard, and what the evidence for a climb looks like in production.

---

## The promotion path

### Rung 0 — The last time you were sure

**Intent:** *Prepare for a reader who will never talk to you.*

The component works. Two years in production. Tests, stack trace, a shape your teammates understand. You are the entire author — procedure, branches, error cases — and when a bug appears, you know exactly where to look.

The only question at this rung is whether the interface is honest. Not to a human who'll email you — to a machine that has never read your docs, will call once, and must recover from its own mistakes.

That sounds trivial. It almost never is. Most components fail it, and the fix is always the same: schema, actionable errors, bounded output, idempotency.

This is the last rung where "fix the interface" is the right answer to almost any problem. Enjoy it.

**Gate:** *can a competent machine call this correctly, first try, without your docs?* If no, stop. You won't get this question answered again.

---

### Rung 1 — The first time you weren't the only reader

**Intent:** *Write for a caller who will act on your words.*

You put the component on the tool surface. Thirty lines. You think: *same thing, now reachable from an LLM. What could change?*

Everything.

You no longer decide who calls, or in what order. The caller is a model with no memory, no context, and total confidence. It will pass you a plausible-but-wrong ID, a malformed date, a currency you don't support — and it will do so sure of itself.

The first time you see a production trace where the model called the wrong tool because your description was vague, it clicks: **your description is the prompt.** Field names, enums, examples — these aren't serialization detail. They're interface copy, and interface copy is now your correctness boundary.

You also discover errors are read. `400 Bad Request` produces a retry loop. `"retry with format=iso8601"` produces a correct call. Whether the model recovers depends on whether you wrote the error for a reader who will use it.

You haven't lost your code. You've lost the assumption that the caller shares your context.

**Gate:** *do the traces show a fixed sequence every time?* If yes, you have a workflow — encode it as a DAG and stop. Most teams who think they need an agent will discover, here, that they don't.

---

### Rung 2 — The handoff you can't take back

**Intent:** *Stop writing the procedure. Start writing the fence.*

You build the agent. Not because you're sure, but because the caller keeps writing if/else trees to choose a tool, and inputs are genuinely underspecified, and one step sometimes fails and needs a different path. There's real judgment. You hand it over.

This is where the promotion stops being incremental.

Until now you were still authoring the procedure. At this rung, a loop decides which tool, in what order, and **when to stop**. And it might not stop. It might stop early. It might confidently do the wrong thing five times and declare success.

The first time you watch a run burn 400 steps to produce something you could have hardcoded in ten, you feel it. **"Right answer, wrong procedure"** becomes a failure mode you have to mean.

So the work changes shape. You don't write the loop. You write the **fence**: max steps, budgets in code not in prompt, human authorization before anything irreversible, checkpointing, trajectory evals. The artifact you ship isn't the procedure anymore — it's the boundary around a procedure someone else wrote.

The code looks like the code you used to write. The debugging doesn't.

**Gate:** *does one of these apply — context overload, trust isolation, real parallelism, genuine specialization?* If none, one agent is your answer. Most teams are here. Most teams *should be* here.

---

### Rung 3 — The day you became a distributed systems engineer

**Intent:** *Admit you are now building a network with principals.*

You add a second agent. Then a third. Now you're building a network of peers — each with its own principal, tools, and failure modes. Briefly, it feels like arrival.

Then a peer times out. Did it do the work and lose the response, or not start? You retry. Now it's done twice. You add idempotency keys. A peer returns a partial result that looks complete. You add result schemas. Two peers disagree. You add identity, authorization, shared audit trail. Suddenly you're reading consensus papers.

**You're not building an agentic system. You're building a distributed system with principals — and the principals happen to be LLMs.**

This rung doesn't add capability. It adds **isolation** and **scale**. If you don't need those, it's a distributed-systems tax paid on a single-machine problem. If you do, it's the only way — and you accept the cost knowingly: partial failure, eventual consistency, cross-boundary debugging, emergent behavior nobody designed.

The mistake here doesn't look like a bug. It looks like *architecture*. It's the hardest place to walk back from.

**Gate:** *is one of the four reasons demonstrably true, and are you willing to pay the tax?* "I wanted to see what it would look like" is not a reason. "Context overload is measured and one agent can't hold the tools" is.

---

## What the evidence looks like

Three patterns we've seen repeatedly across agent deployments. Names and numbers are illustrative — drawn from composites of real traces, not a sampled study. None required a study to spot. They required a trace viewer and a team willing to look at the rung they were actually on.

**Fixed sequence, agent price.** A team moved `parse → validate → enrich → store` behind an agent because "the model might need to handle variants." The trace showed the same four tools in the same order on nearly every run. The rare exceptions were malformed inputs the agent retried. Cost per task was an order of magnitude above the workflow version; p95 latency similar. The fix was a workflow with one agent call at the "which variant?" decision point. Nothing was lost. "Might need to handle variants" was an assumption, not an observation.

**A rung-1 defect that looked like a rung-2 bug.** An agent looped for eleven steps trying to reconcile invoices. The trace showed the tool returning `400 Bad Request` on step two, the model retrying with the same arguments, trying a different tool, then coming back. The root cause was an error message that told the model nothing about how to recover. One string change — `"retry with format=iso8601"` — dropped the run from eleven steps to three. The team had spent four days tuning the agent prompt.

**A rung-3 failure invisible at rung-2.** Two peers, one for FX conversion, one for ledger lookup. The FX peer returned a partial result after a timeout — "converted 3 of 5 line items." The ledger peer consumed it as complete. The agent above both confidently produced a reconciliation that looked right on the summary line and was wrong on two. At rung 2 this was impossible: there was no partial result to consume. The failure wasn't a bug in either peer. It was a contract the peer design never expressed.

These aren't anecdotes about model quality. They're anecdotes about **contracts**. Each one would have been caught by the gate for the rung the team was actually on — if they'd asked the question at that rung.

---

## The shape of the climb

Each rung didn't just add capability. Each took something away and asked you to rebuild the practice that compensated for it.

| Rung | You gain | You must rebuild |
|---|---|---|
| 1 | Reachability from an LLM | Description-as-contract, error-as-instruction |
| 2 | Judgment for ambiguity | Bounds, trajectory evals, human gates |
| 3 | Isolation and scale | Distributed failure semantics, authz, audit |

None of these inherit from the rung below. All of them are your work again at every level. That's why the climb feels like re-learning your discipline three times in a year. **It is.**

---

## The promotion path, in one concrete case

`reconcile_invoices(bank_stmt, ledger) → Diff[]`. Deterministic CLI, well-typed, two years old.

**Rung 0.** JSON schema, actionable errors (`MISMATCHED_CURRENCY: convert or filter`), pagination, idempotency key. Gate passed. Chain unchanged.

**Rung 1.** `──[mcp]──▶`. One tool, not five. Description states when *not* to use it. Traces show `fetch_stmt → reconcile → fetch_ledger` in fixed order, with a human choosing the ledger.

**Rung 2.** Keep the three steps as a workflow. Add `──[agent]──▶` *only* around "which ledger applies?" — five-step budget, human authorization above $10k.

**Rung 3.** No gate applies. A peer hop would add network failure modes to a solved problem.

```
core ─[mcp]▶ tool ─[agent]▶ agent                  ← ship this
core ─[mcp]▶ tool ─[agent]▶ agent ─[a2a]▶ peer     ← don't
```

---

## The thinking shift

If you take the promotion seriously, five things start to change.

**From correctness to adequacy.** You can't prove a rung-2 system correct. You can only measure it. Confidence comes from evaluation suites, not from reasoning about code.

**From debugging to reconstruction.** No stack trace exists for "the agent chose the wrong tool." There are only trajectories. If you can't reconstruct the run, you can't operate the system.

**From interface design to description design.** Your schema, descriptions, and examples are the only thing the model will read. You're writing for a reader who is confidently wrong and will act on ambiguity.

**From control to constraint.** You stop asking "does it do what I want?" and start asking "what is it not allowed to do?"

**From building to evaluating.** The primary thing you ship isn't the agent. It's the eval harness that tells you whether the agent still works after the next model upgrade.

These aren't framework skills. They're a different relationship with your code — and with your role in shaping it. You're not learning a tool. You're becoming a different kind of engineer.

---

## The promotion checklist

Print this. Tick it per rung.

**Before L0 → L1** (`──[mcp]──▶`)
- [ ] Machine-readable schema; actionable errors; idempotency; bounded output
- [ ] Tool descriptions written as prompts; coarse, task-shaped tools
- [ ] Dry-run defaults for destructive operations
- [ ] Tool-selection eval set

**Before L1 → L2** (`──[agent]──▶`)
- [ ] Evidence of fixed sequences / if-else callers / genuine ambiguity
- [ ] Budgets and termination conditions enforced in code
- [ ] Checkpointing and replay
- [ ] Trajectory evals + full traces
- [ ] Human authorization gates on irreversible actions
- [ ] Prompt and model versioning

**Before L2 → L3** (`──[a2a]──▶`)
- [ ] A named gate from "How far to promote" applies and is recorded
- [ ] Peer identity and authorization
- [ ] Async task lifecycle + task-level idempotency
- [ ] Failure isolation and degradation plan
- [ ] Cross-peer audit trail and cost attribution
- [ ] Rollback to single-agent path proven

---

## Honest caveats

- **This is structural argument, not a controlled study.** The type changes are definitional. The production patterns above are illustrative, not sampled. The claim that "most wins are rung-2 + workflows" is practitioner observation and the weakest claim here.
- **It's calibrated to current model reliability.** Better long-horizon tool use weakens the conservatism.
- **The protocols are young.** Some rung-1 and rung-3 obligations will get absorbed into protocol defaults. When that happens, strike them — don't keep them as duplication.

---

## The north star

> **Promote one rung at a time, only with evidence, and stop at the lowest rung that solves the problem.**

Each step will always make the promotion look like one move. The point of everything above is that it isn't — it's a sequence of mindset shifts, each with a felt disorientation and a real cost. The work of engineering, in this new landscape, is knowing which rung you're on, why you promoted to it, and how to walk back down if it turns out you didn't need to.

---

## Related reading

- Anthropic, *"Building Effective Agents"* — the workflow-vs-agent distinction this guide extends into a promotion path.
- Deutsch, *"The Fallacies of Distributed Computing"* — the failure semantics of Rung 3, written before LLMs existed.
- Model Context Protocol and Agent2Agent specifications — the concrete forms of the `──[mcp]──▶` and `──[a2a]──▶` adapters today.

---
