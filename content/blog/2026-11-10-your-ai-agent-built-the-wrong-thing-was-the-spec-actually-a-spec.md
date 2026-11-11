---
title: Your AI Agent Built the Wrong Thing. Was the Spec Actually a Spec?
description: A prompt is a request. A spec is a contract. The difference is
  whether it can be verified — and most "specs" can't be.
date: 2026-11-10
draft: true
tags:
  - AI Agents
  - Software Architecture
  - AI Engineering
---
I have read maybe thirty specifications written for agents in the last year. Almost none of them were specifications.

They were documents. Long, thoughtful, well-intentioned documents. Context sections, goals, user stories, a paragraph about edge cases, a definition of done that said something like *"the system should handle errors gracefully."*

That last one is the tell. It cannot be checked by a machine, which means it cannot be enforced, which means the agent resolved it by guessing — and the guess is in production right now, working in a way nobody specified and nobody reviewed.

Here is the uncomfortable part: **"handle errors gracefully" is not a requirement. It's a confession.** It's what you write when you don't know what the errors are, which ones matter, or what "gracefully" means for this system. The prose isn't hiding the gap from the agent. It's hiding it from you.

A prompt is a request. A spec is a contract. The difference is not length or formality. The difference is whether the constraints in it can be **verified** — by the agent, by the pipeline, by anyone.

---

## The Ego Cost of Prose

Most teams write specs to feel productive. Very few write them to be checkable.

Those are different activities, and the difference is the difference between thinking about the problem and performing thought about the problem. A prose spec lets you believe you knew what you wanted. A checkable spec forces you to find out.

Which is why teams write prose. It's not that checkable constraints are hard to write down. It's that writing them down requires you to discover, repeatedly, that you didn't know what you thought you knew. The error taxonomy you never defined. The idempotency key you never chose. The ordering guarantee you assumed. The consumer you never named.

Every one of those is a gap. Prose lets the gap survive to production, where it becomes the agent's problem — and then yours, three days later, in Europe.

I want to name the thing that keeps prose alive, because it isn't ignorance.

Writing prose about a system feels like thinking. You write a paragraph about error handling and you come away believing you've addressed it. The paragraph reads well. It sounds considered. It has the shape of rigor.

Writing a checkable constraint feels like accounting. You have to name the error codes. You have to decide what "duplicate" means. You have to pick an idempotency key and defend it. You have to admit, in writing, that you hadn't decided these things — that the agent has been deciding them for you.

That admission is the cost. It's why teams write "handle errors gracefully" instead of `409 DUPLICATE | EXCEEDS_ORIGINAL | INVALID_STATE`. The first protects the belief that you already knew. The second proves you didn't.

Here is the difference in eight lines:

```text
PROMPT                              SPEC
"add a refund endpoint"             invariants + interface + non-goals
                                    + executable acceptance + edge matrix

agent guesses                       agent satisfies, or fails loudly
fails silently, three days later    fails at the point of violation
protects what you believe           proves what you decided
```

The point of the right-hand column is not that it's more complete. It's that it makes the agent's failure **visible**. A guessed requirement fails silently. A violated invariant fails loudly, at the point of the violation, with a test attached.

---

## Why Specs Fail With Agents

Five structural reasons, and they compound.

**They describe intent, not behaviour.** "Make checkout faster" is a wish. "p95 checkout latency under 400ms at 500 rps, measured at the API boundary" is a contract.

**They omit non-goals.** An agent will build the feature *and* three adjacent ones it inferred, because inference is what it does. Non-goals are not politeness. They are scope fences.

**Acceptance criteria are prose.** Prose criteria get reinterpreted at generation time. Executable criteria cannot be.

**There are no context anchors.** The agent doesn't know your conventions, your existing modules, your error taxonomy. It invents them — consistently wrong.

**They are too long to attend to.** A 4,000-word spec doesn't fail because it's wrong. It fails because the critical constraint on page six is not reliably present at the moment of code generation. You've recreated lost-in-the-middle, but with your own documentation.

Brooks named the thing that fixes this, and the line is worth quoting in full: *"I will contend that conceptual integrity is the most important consideration in system design."*

With agents, conceptual integrity cannot stay in the architect's head. It has to be written down and made checkable, because the agent cannot hold the model and cannot be trusted to reconstruct it. That is the whole job of the spec — not documentation, but the externalised, verifiable form of the design.

And Atkinson's axioms from the last post need somewhere to live. The spec is where they live, and where the pipeline can check them. Without the spec, the axiom set is a document nobody reads. With it, the axioms become constraints.

*Take your last feature. Could a machine verify every constraint in its spec? If more than half the constraints are prose, you didn't write a spec. You wrote a wish.*

---

## The Seven Layers of an Agent-Ready Spec

Each layer answers a different question and is verified a different way. Skip a layer and the agent fills the gap by guessing.

```text
THE SEVEN LAYERS OF AN AGENT-READY SPEC

  0  INTENT          why does this exist?            human review
  1  INVARIANTS      what must always be true?       property tests
  2  INTERFACE       what are the exact shapes?      contract tests
  3  NON-GOALS       what must NOT be built?         diff review
  4  ACCEPTANCE      how do we know it's done?       automated checks
  5  ANCHORS         what patterns must be followed? pattern conformance
  6  EDGE MATRIX     what happens when it breaks?    negative tests

  Layer 0 is the compass. Layer 1 is the fence.
  Layers 2–6 make the fence checkable.
```

Seven layers sounds like a lot. It isn't. It's roughly what you'd write if you were handing this work to a senior contractor — except the contractor never asks a clarifying question, never tells you what it doesn't understand, and ships at 3 a.m. on a Tuesday.

Here is what all seven look like for one feature — refunds.

```
═══════════════════════════════════════════════════════════════════════
 LAYER 0 — INTENT
 Allow support agents to issue full refunds on settled transactions,
 so chargebacks can be resolved before they reach the processor.
═══════════════════════════════════════════════════════════════════════

 LAYER 1 — INVARIANTS
 - A refund can never exceed the original charge amount.
 - A refund is idempotent on (transaction_id, idempotency_key).
 - Once a refund reaches SETTLED, it cannot transition.
 - Every state transition emits exactly one ledger event.

 LAYER 2 — INTERFACE CONTRACT
 POST /refunds
 Request:  RefundRequest { transaction_id: UUID, amount_cents: int>0,
                           reason: enum, idempotency_key: string }
 200: RefundAccepted { refund_id: UUID, state: "PENDING" }
 409: RefundConflict { code: DUPLICATE | EXCEEDS_ORIGINAL | INVALID_STATE }
 422: ValidationError { field: string, rule: string }

 LAYER 3 — NON-GOALS
 OUT OF SCOPE: partial refunds, multi-currency, approval workflows,
               any change to the payments module, new tables outside
               the refunds schema.

 LAYER 4 — ACCEPTANCE CRITERIA (executable)
 AC-1: Valid request returns 200 and persists one row.     [integration]
 AC-2: Replayed idempotency_key returns original id.       [integration]
 AC-3: amount > charge returns 409 EXCEEDS_ORIGINAL.       [unit + int]
 AC-4: 10k random valid requests, sum(refunds) ≤ charge.   [property]
 AC-5: No transitions exist from SETTLED.                  [model check]

 LAYER 5 — CONTEXT ANCHORS
 - Error handling: src/common/errors.ts (Result type, no exceptions)
 - Persistence: src/payments/repository.ts (repository pattern)
 - Events: docs/adr/0012-event-envelope.md (fixed schema)
 - Naming: docs/glossary.md (use "refund", never "reversal")

 LAYER 6 — FAILURE & EDGE MATRIX
| Condition | Expected behaviour |
 |--------------------------------|---------------------------------|
| Duplicate idempotency key | Return original, 200 |
| Ledger timeout | Retry 3x + backoff, then FAILED |
| Partial write (row yes, event) | Outbox pattern, reconcile job |
| Concurrent refunds, same txn | Serialise, second gets 409 |
═══════════════════════════════════════════════════════════════════════
```

Seven layers. Every line machine-checkable except Layer 0, which is what makes the rest coherent. The whole thing fits on one page.

Now "done" is not an opinion. It's a green pipeline.

---

## The Grill Me Step

Even a strong spec has gaps. Before implementation, force the agent to interview you:

```
You are the spec author's adversary. Read the spec.
Ask up to 40 questions, one per ambiguity, ordered by blast radius.
Do not propose code. Do not propose design. Only questions.
Stop when you can restate the spec, the invariants, and the non-goals
in your own words with zero open questions.
```

Then have it restate. If the restatement differs from your intent, the *spec* is wrong. Fix the spec.

Here's the reframe that matters. We imagine the agent asks questions because the agent is confused. It doesn't. The agent asks questions because the spec revealed that *you* were confused, and covered it with prose. The forty questions are the list of things you never decided.

The agent is not the one being examined. You are.

This is Brooks' conceptual integrity made operational: one shared model, written down, before code exists. The agent is not being asked to be wise. It is being asked to prove it understood, and the proof is checkable.

---

## Spec Hygiene, or: How to Make Specs Survive the Attention Budget

The last post's problem doesn't go away because you wrote a good spec. It gets worse, because a good spec is longer.

Four rules:

**Layer the file.** A short `SPEC.md` containing intent, invariants, and non-goals — the one-page contract — linking to detail files for interface, edge cases, and patterns. The agent reads the contract first; detail is pulled on demand.

**Put constraints where they're needed.** Invariants next to the code they constrain. Module-level `INVARIANTS.md`, test-file headers. Proximity beats completeness.

**Version the spec.** Specs are artifacts with hashes. A spec change is a reviewable diff. Implementations are tied to spec versions.

**Lint the spec.** Non-goals present? Criteria executable? Interface types defined? Failure matrix non-empty? A spec linter is cheap and catches exactly the omissions that cause rework.

---

## The Concession

I want to be honest, so this doesn't overreach.

Some requirements genuinely resist formalisation. Regulatory language is ambiguous on purpose. Product judgment — *should this exist, is this the right feature* — cannot be reduced to invariants. Trust, taste, and strategic fit are not checkable.

And yes — invariants take longer to write than prose. That cost is real. You will spend an afternoon naming error codes that you used to wave at with a sentence. You will discover, on that afternoon, that nobody on the team agreed on what a duplicate actually is.

But that time is not overhead. It is the same time you would otherwise spend in production, at a worse moment, with a worse audience. The choice is not between cheap and expensive. It is between expensive-now and expensive-later-with-a-customer-watching.

The unformalizable requirements are not the reason the spec is prose. Almost no team is near that boundary. The things going unspecified in most codebases — contracts, idempotency, ownership, ordering, failure modes — are entirely specifiable. Those are not the hard cases. They are the ordinary cases that nobody wrote down.

---

## The Bottom Line

An uncheckable spec is a wish. A checkable one is a contract. The agent can only satisfy what it can verify.

Which means the work of writing a spec is not the work of describing what you want. It's the work of converting what you want into constraints a machine can check — and discovering, in the process, that half of what you wanted was never precise enough to build.

That discovery is the point. It's cheaper to make it on paper than in production.

So here is the test. **Hand your last spec to a colleague who wasn't in the room.** Ask them to write the tests it implies.

If they can, you have a spec.

If they can't — if they have to ask you what "gracefully" means, which errors count, what happens on a duplicate — then the agent couldn't have either. It filled the gap by guessing. The guess is in production. You just haven't found it yet.

Write it down. Then notice the next problem, which is harder: a spec constrains one unit of work. It does not constrain the system that unit lands in.

Guardrails do that. And without them, a perfect spec is still a Knight Capital deployment waiting for its eighth server.

That's the next post.

---

*Next: what stops your AI agent from breaking production — and why a good spec is not enough.*