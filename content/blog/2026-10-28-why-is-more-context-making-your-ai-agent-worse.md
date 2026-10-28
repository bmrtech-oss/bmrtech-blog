---
title: Why Is More Context Making Your AI Agent Worse?
description: You gave it the whole codebase, a million-token window, and a
  retrieval pipeline. The output got worse. That's not a bug in your setup —
  it's a bug in the premise.
date: 2026-10-28
draft: false
tags:
  - AI Agents
  - Logical Thinking
  - AI Coding
---
---

"Lost in the Middle" was published in 2023 and should have ended the context-window arms race. It didn't.

I have watched three teams since then build bigger windows anyway. The first built a retrieval pipeline that pulled the twenty most relevant files for every task. The second fed an entire service into a million-token window. The third wrote a "codebase summary" generator that regenerated a compressed map of the repo every morning.

All three worked, in the narrow sense that the agent could see more. All three failed, in the sense that the quality of the output did not improve. In one case it got measurably worse, because the agent could now see everything and still didn't know what mattered.

They had solved storage. They hadn't solved judgment.

---

## The Five Ways Context Hurts

Before we get to the alternative, the title deserves a direct answer. More context is not neutral. It is actively corrosive, in five specific ways.

**Dilution.** Attention is a finite resource spread across everything in the window. As the window fills, the signal-to-noise ratio drops. The one paragraph that mattered is now one paragraph among four hundred, and it competes for the same attention budget as the four hundred that didn't.

**Contradiction.** Stale documentation, old code, current code, and a Slack thread from 2022 all sit in the same window with no ranking. The model has no reliable way to know which version is authoritative. So it averages them, or picks the one that appears most often. Either way you get a synthesis of three different systems.

**Staleness.** The retrieved context is a snapshot. By the time it is assembled, the branch has moved, the schema has changed, and the file the agent is confidently editing is a version that no longer exists. This is retrieval's quiet failure mode: the context is *relevant* and *wrong*.

**Retrieval error.** The right file wasn't in the top twenty. This is the failure everyone knows about, and it's the least interesting of the five — because at least it's visible. The agent either notices it's missing something or it guesses, and guessing in a large context looks identical to knowing.

**Attention decay.** This is the one Liu et al. measured, and the finding is blunt: the window has a shape, and the middle of it is dark. Information placed there is measurably less likely to be used than the same information at the beginning or the end. A bigger window does not flatten the curve. It lengthens the dark part.

Here is the shape they measured, with your invariants sitting where they usually end up:

```text
THE SHAPE OF A LONG CONTEXT WINDOW

  ┌──────────────┬─────────────────────────────────┬──────────────┐
  │  BEGINNING   │             MIDDLE              │     END      │
  │              │                                 │              │
  │ ████████████ │  ███    ██    █    ██    ███    │ ████████████ │
  │  high use    │      attention decays here      │  high use    │
  └──────────────┴─────────────────────────────────┴──────────────┘
        ↑                        ↑                        ↑
   the task spec         the contract you wrote      the latest
   the invariants        last quarter                error message
   the non-goals                                     the stack trace

  A bigger window does not flatten this curve.
  It lengthens the dark part.
```

Read those five again and notice what they have in common. None of them are fixed by adding more context. Four of them are *caused* by adding more context. The fifth — retrieval error — gets worse, because a larger corpus has more ways to miss.

Context is a pile of facts the agent must reason over. That's work. What an agent actually needs is a constraint it must satisfy. That's a fence.

---

## The Paper That Should Have Ended This Debate

The research is worth knowing by name: **"Lost in the Middle: How Language Models Use Long Contexts," Liu et al., 2023.**

The paper's own summary is unambiguous: performance significantly degrades when models must access relevant information in the middle of long contexts. The effect shows up across settings, and it is largest in multi-document question answering — the setting that looks most like the way we hand agents a pile of files and hope. The specific degradation curves are in the paper's results section, and they are worth reading directly rather than trusting a summary of a summary.

The point is not about attention mechanics. It's about what context is *for*.

Context tries to **store** the whole system. An invariant set tries to **replace the need to store it**. One scales with compute. The other scales with rigor. The context arms race optimises the thing that was never the bottleneck.

---

## What an Axiom Actually Is

In 1909, in a small book called *Logical Thinking*, W. Atkinson wrote a sentence that describes exactly what an agent needs:

> *"In necessary truth we have axioms, or self-evident truths, and the truths derived from them by reasoning, called theorems."*

An axiom is a proposition from which consequences can be derived and checked. That's the whole job. It is not a description of the system — it is a **law the system must obey**, from which particular facts follow.

This is the compression that makes a bounded reasoner useful. You cannot hand an agent 500,000 lines and ask it to understand. You can hand it twelve properties that must never be false, and ask it to prove they hold. Here's what that substitution looks like:

```text
                  WHAT AN INVARIANT SET REPLACES

  ┌───────────────────┐        ┌──────────────┐        ┌───────────────┐
  │   THE CODEBASE    │ ─────► │  INVARIANTS  │ ─────► │    CHECKS     │
  │                   │ choose │              │ derive │               │
  │  500,000 lines    │  the   │  12 laws     │  the   │  property     │
  │  40 services      │  laws  │  that must   │ conse- │  contract     │
  │  unknowable by    │        │  never be    │ quences│  schema       │
  │  any one agent    │        │  false       │        │  replay       │
  └───────────────────┘        └──────────────┘        └───────────────┘
      unbounded                 compressible            checkable
      object                    to a page               by machine
```

The first is an unbounded object. The second is a bounded task.

Five things have to be true of a good axiom set:


| Property | Meaning | What breaks if violated |
| ---------------- | ----------------------------------- | --------------------------------- |
| **Soundness** | Satisfying them guarantees the goal | Ships defects with confidence |
| **Independence** | None derivable from the rest | Redundancy, false confidence |
| **Checkability** | Mechanically verifiable | It's a wish, not an axiom |
| **Sufficiency** | They *permit* the goal state | Safe but useless |
| **Stability** | Still true as the world moves | Drift: axioms fine, world changed |


Soundness first, sufficiency second. A sound-but-incomplete system is safe and occasionally refuses valid work. An unsound system is confident and ships bugs. Never trade soundness for coverage.

And then the failure mode nobody names: **axioms that aren't axioms.**

"The code should be clean." "The system should be fast." "Tests should pass." These *feel* like invariants. They aren't, because they cannot be checked, which means they cannot be enforced, which means they enforce nothing — while creating the false comfort of having "specified" something.

An uncheckable axiom is worse than no axiom, because it buys the feeling of rigor without the substance. And it's the thing most teams write when they think they're writing a spec.

*List the invariants of your current system. Not the features. The properties that must never be false. If you can't list five in five minutes, your agent has nothing to satisfy — and it's inventing its own laws instead.*

---

## The Loop Nobody Runs

Atkinson's framework has two halves, and most teams only run one.

The **order of discovery** is inductive: you observe particular failures, and you generalise to a law. The bug happens, you ask why, you write the invariant that would have prevented it. This is how you learn what law you were missing.

The **order of justification** is deductive: you have the law, and you derive checkable consequences. The agent satisfies the invariant locally, the test proves it, the composition holds. This is how you know the work is correct without holding the whole system in your head.

Quality lives in keeping the two in a loop. Discovery without justification is a pile of anecdotes. Justification without discovery is a law book that has stopped describing the world.

Here is the one refinement Atkinson needs for engineering. He calls axioms **self-evident**. In software they are not. They are chosen, and they can be wrong. The deadlock nobody specified, the contract nobody wrote down, the drift nobody anticipated — those are cases where the axiom set was unsound, and no amount of correct deduction saved the system. Which is exactly why the inductive half is not optional. It is how you find out which law you forgot.

An agent is a deduction engine. It is very good at deriving consequences from premises. It cannot choose its own premises, and it cannot notice when they've stopped being true. That is the human's job, and it is not a small one.

---

## The Settlement Export, Six Years Later

Here's what this looks like in practice.

A settlement export row was a tuple. It had been a tuple since 2019. A downstream reconciliation service parsed it by position. That was never documented, because it never needed to be — nobody had ever changed the row shape.

An agent was asked to add a field. It did. It also changed the row from a tuple to a dictionary, because dictionaries are more legible. A defensible local improvement. Made in the same tone as choosing a variable name.

Here's the change, side by side:

```text
BEFORE  (2019 – 2025)                   AFTER  (agent, Tuesday)

row = ("M-4471",                        row = {
         "2025-06-03",                        "merchant":     "M-4471",
        18432,                               "date":         "2025-06-03",
        "EUR")                               "amount_cents": 18432,
                                             "currency":     "EUR"
reconciliation-service:                  }
parses by POSITION                       reconciliation-service:
  row[2] → 18432  ✓                      parses by POSITION
                                           row[2] → "2025-06-03"  ✗

  Locally correct.  More legible.  Nothing in the task
  mentioned the consumer.  The contract was never written.
```

Three days later, European merchants started showing mismatched totals.

What would more context have done here? The reconciliation service was two repos away. Nothing in the agent's task, its files, or its tickets referenced the positional contract. You could have fed the agent the entire settlement codebase and it still would have made that change — because the law it broke didn't live in the code it could see. This is the dilution-and-retrieval problem in its purest form: the contract existed, and no retrieval pipeline would have ranked it, because nothing in the task looked like it needed it.

Now write four invariants instead:

```
- The settlement export row is a positional tuple consumed by
  reconciliation-service. Shape changes require a versioned contract
  and a consumer release, in that order.
- Every export batch is idempotent on (merchant_id, settlement_date).
- Export totals must reconcile to the ledger to the cent, every batch.
- Every field in the row has a declared consumer.
```

Four lines. Checkable — the first by a schema test, the second by a replay test, the third by a reconciliation assertion, the fourth by a schema-versus-consumer-registry check. And none of them require the agent to see anything beyond the module it's editing.

That's the difference the title is asking about. Context is a pile of facts the agent must reason over. An invariant is a constraint the agent must satisfy.

---

## Why This Is Harder Than It Sounds

I want to be honest about the cost, because "write invariants" sounds like a bumper sticker and isn't.

**Choosing the axioms is the irreducible human act.** You cannot derive the axiom set from the goal mechanically. That *is* the design. No formal system decides its own axioms.

**Missing axioms are discovered through failure.** The deadlock nobody specified, the interaction nobody modelled. This is why the production-to-invariant loop isn't optional — failure is how you learn what law you forgot.

**Some goals resist axiomatization.** "Drivable." "Useful." "Trustworthy." You can approximate them forever and never fully formalise them. Judgment sits at that boundary permanently.

**Axioms age.** The spam classifier's invariants were sound — the world moved. Invariant sets need versioning and revalidation, exactly like signed thresholds. A law that was true in 2019 may be the bug in 2026.

None of this argues for more context. All of it argues for fewer, better laws, maintained deliberately.

---

## What This Means for Your Agent

Do not give the agent more context. Give it fewer, truer laws.

This sounds like a downgrade until you see what it does to the problem. "Understand this 500,000-line system" is not a task a bounded reasoner can complete. "Make these twelve properties hold, and prove it with tests" is a task it can complete, repeatedly, verifiably, at scale.

The move is the same one good engineers have always made: replace a hard global problem with a set of local problems whose composition is guaranteed by construction. Contracts over imperative code. Property tests over example tests. Invariants over documentation.

Context is what you reach for when you don't have invariants. Invariants are what you reach for when you understand the problem.

---

## The Law You Forgot

Every system has one — the property that was true, that nobody wrote down, that got broken.

For the settlement export, it was *"the row is a tuple, and downstream parses by position."* True for six years. Never documented, because it never needed to be. Broken in an afternoon by an agent making a reasonable improvement.

That is the axiom you were missing. And the uncomfortable thing about axioms you were missing is that you usually find out from production.

So write it down. Then notice the next problem, which is harder: an invariant on a wiki page is a wish. It only becomes a fence when the agent can find it and the pipeline can check it. Where it lives, what it constrains, and how it's verified — that's the spec, and that's the next post.

---

