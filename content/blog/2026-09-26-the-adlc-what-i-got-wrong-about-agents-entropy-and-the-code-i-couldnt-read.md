---
title: "The ADLC: What I Got Wrong About Agents, Entropy, and the Code I
  Couldn't Read"
description: Six months after admitting better prompts weren't the problem, I
  discovered a deeper one. AI agents generate code faster than we can understand
  it. Here's the framework I use now.
date: 2026-09-26
draft: false
tags:
  - ai agentic development
  - ai engineering culture
  - adlc
---


---

Six months ago, I wrote a confession. I admitted that better prompts weren't the problem — that I was. I laid out three camps of AI users: those who dump everything on the model, those who try to fix everything manually, and those who trust the output without understanding it. I gave three rules: plan, don't pray; mind the 2-foot desk; handover, not hangover.

I believed I'd figured it out.

I hadn't.

Not because the rules were wrong. They were right. But they were written for a world where *I* was still the one writing the code. Where the AI was a tool I picked up and put down. Where the bottleneck was my own discipline.

Then I started running agents. Continuously. On my own codebase. And everything I thought I'd learned got tested against a reality I wasn't prepared for.

This is what I got wrong.

---

## A Question That Kept Me Up at Night

Why didn't evolution make plants that don't need sunlight?

Sit with that for a second. The Sun will die. In five billion years, it will swell into a red giant and sterilize this planet. Any species dependent on photosynthesis is cosmically doomed. So why didn't evolution prepare for that?

Because evolution is blind. It can't see five billion years ahead. It only selects for what works *now*, with the parts already available. Sunlight is the biggest, most stable free-energy source on Earth's surface. So life built itself around sunlight. Some plants did evolve to skip photosynthesis — dodder, Indian pipe, Rafflesia — but they're parasites. They still depend on sunlight indirectly, stealing carbon from plants that photosynthesize. There is no escape. Not from the gradient, not from the deadline.

We are exactly the same.

Every model we build on, every framework we adopt, every agent we run — they are sunlight. They work now. They are stable now. We build around them because they are the biggest, most convenient energy source available. And we don't design for their death. We design for this quarter's roadmap.

That's not a flaw. It's the only thing evolution can do.

But we are not plants. We can see the deadline. We can anticipate. We can choose. And that changes everything — or it should.

---

## What Changed Since the First Post

The first post was about *using* AI. This one is about *living with* it.

There's a difference. Using AI is a choice you make. Running agents is a system you build. Once the agents are running — writing tests, refactoring modules, reviewing PRs, generating docs — you're no longer in a tool relationship. You're in an ecosystem. And ecosystems have their own physics.

The physics I'm talking about is the same one I wrote about in my charter: dissipative structures. Whirlpools. Flames. Patterns that exist only while energy flows through them. Your codebase is one of these. It stays alive only while your team invests energy into it.

What I didn't fully appreciate six months ago is that agents are a new energy source — and every energy source produces waste.

---

## The Thing I Missed

In the first post, I said the problem was me. That was true. But it was incomplete.

The problem is also the gap between generation and comprehension.

When I write code, I understand it. Not perfectly, but enough. The act of typing creates a mental model. I know where things are. I know why they're there. I know what I was thinking when I wrote them.

When an agent writes code, that mental model doesn't exist. The agent doesn't have one. And I don't have one either — because I didn't write it. I only read it. Or worse, I only *skimmed* it.

I opened a file last Tuesday that I had never seen before. In a repository I own. With my name on every commit. Three agents had touched it. No human had read the whole thing.

That's not a discipline problem. That's a structural problem. And it gets worse the more agents you run.

---

## What the Data Says Now

The first post cited Stack Overflow, Bain, and a controlled study about AI productivity. That data was about *using* AI. The newer data is about *living with* it — and it's more uncomfortable.

**GitClear 2024** analyzed 211 million lines of code and found that AI-assisted codebases show higher duplication, lower refactoring, and shorter code lifespans. Code is being written and replaced faster than ever. Not because it's better. Because nobody understands it well enough to keep it.

**DORA 2024** found that AI adoption correlates with increased throughput but decreased delivery stability. Teams ship more. They also break more. The velocity is real. So is the fragility.

**Stack Overflow 2024** found that developers trust AI *less* for complex tasks than they did a year ago — even as they use it *more*. We're in a trust paradox. We know it's risky. We can't stop.

Read those together. We are generating code faster than we can understand it. We are shipping more than we can maintain. We are accelerating a process that was already unsustainable.

And the agents keep running.

---

## The ADLC

Everyone talks about the AI Development Lifecycle. Prompt, generate, test, ship. That's what the vendors sell you. That's what the demos show.

But I think that term is too broad. The AI Development Lifecycle is about building AI systems — data pipelines, model training, evaluation, deployment. MLOps. That's a different cycle. What I'm describing is something narrower and more immediate: the cycle of developing software *with* agents. Different cycle. Different physics.

I've started calling it the **Agentic Development Lifecycle** — ADLC. It looks like this:

```
ENERGY IN  →  AGENT  →  CODE  →  ENTROPY OUT
prompts       writes     commits   slop
tokens        rewrites   merges    drift
compute       deletes    pushes    debt
```

Most teams obsess over the first three stages. They optimize prompts. They tune models. They measure throughput. They celebrate velocity.

But the fourth stage is where the system dies. Not dramatically. Slowly. The code works, but nobody understands it. The tests pass, but they test the wrong things. The agent keeps generating, but the humans keep losing ground.

I know this because it happened to me. And I only noticed when I opened a file I couldn't explain.

---

## Three Rules — Revisited

In the first post, I gave three rules for using AI: plan, don't pray; mind the 2-foot desk; handover, not hangover.

Those rules still hold. But they were written for a single user with a single prompt. For the ADLC, they need to evolve.

Here's what I've replaced them with.

### Rule 1: Energy in, entropy out.

This is the direct descendant of "mind the 2-foot desk." But it's bigger than that.

Every agent run has a cost. Not just the tokens. The human attention required to verify, understand, and maintain what the agent produces. Before you run an agent, ask: *who is going to read this?*

If the answer is "nobody" or "we'll figure it out later," you're not generating code. You're generating debt.

Budget for the cleanup the same way you budget for the generation. If you spend two hours prompting, spend two hours reviewing. If you can't afford the second two hours, you can't afford the first.

### Rule 2: Agents garden. Humans architect.

This replaces "plan, don't pray." The principle is the same — think before you act — but the scale is different.

Agents are extraordinary at the middle of the work. Pruning dead code. Renaming variables. Adding tests. Fixing lint. Updating docs. Refactoring small functions. The tedious, mechanical, well-defined stuff.

Humans are still required at the edges. Architecture. Invariants. Boundaries. The decisions about *what the system should be*, not just *what the code should do*.

The mistake most teams make — the one I made — is letting agents touch the architecture. They don't understand it. They can't. They only see the prompt, not the system. Every time an agent "simplifies" an architectural boundary, it's probably removing something load-bearing that a human put there for a reason.

Let agents tend the garden. Don't let them redesign it.

### Rule 3: Tests are the contract.

This is the descendant of "handover, not hangover." But instead of handing over to a human, you're handing over to an agent — and the contract is the same. Clear expectations. Verifiable outcomes. No ambiguity.

An agent's output is only as good as the tests that verify it. Not the tests the agent wrote. The tests *you* wrote, before the agent ran.

This is the hardest rule. It requires you to think ahead. To define what "correct" means before you ask the agent to produce it. To treat tests as the interface between human intent and agent execution.

But it's also the most important. Without tests, the agent is guessing — and so are you. With tests, the agent has a target, and you have a safety net.

The agent doesn't need to understand your codebase. It needs to satisfy your tests. That's the contract.

---

## The Whirlpool, Again

A while back, my team wrote a charter. One page. Printed. On every desk. It frames software as a living system — a whirlpool that stays alive only while energy flows through it. It reminds us that maintenance is the work, not a distraction from it.

We wrote it before agents entered the picture. But it applies more now than ever. The agents didn't change the physics. They just turned up the volume.

There is no "done." A garden is never finished. The gardener's job is not to complete it — it's to tend it, season after season, while the light lasts.

You can generate more code than any team in history. That's real. That's incredible.

But you still have to understand it. You still have to maintain it. You still have to clean up after it.

The universe doesn't care how fast you wrote it. Entropy is patient.

---

## The Part Where I Ask You Something

Six months ago, I ended the first post with a question: *why did it take me so long to admit that I was the one who needed to change?*

I have an answer now. It took so long because I was thinking too small. I thought the problem was my prompts. Then I thought the problem was my discipline. Both were true. Neither was complete.

The real problem is the system. The ADLC. The cycle that generates code faster than we can understand it, and buries the cost in a place we don't look.

Meaning isn't found in permanence. It's made in the doing. A symphony ends in silence. That doesn't make the music meaningless. Your codebase will decay. That doesn't make the craft meaningless. It makes it urgent.

If you're running agents on your codebase — and if you're reading this, you probably are — I'd genuinely like to know:

- Do you read every line the agent writes?
- Do you know what your codebase looks like *right now*?
- Are you generating code faster than you can understand it?
- What are you pretending will be fine that won't be?

I don't know your answers. I'm still figuring out mine.

But here's what I've learned: the agents aren't the problem. The faster code generation isn't the problem. The problem is that we're running a new kind of lifecycle — the ADLC — without new rituals to match it.

And a whirlpool without a flow doesn't stay a whirlpool. It just becomes still water.

I don't want my codebase to become still water.

---

*If you've been here — or are here now — I'd love to hear from you. What's your ADLC? What rules are you using? What broke the loop for you? [Find me on X] or [send me an email].*

*If you want the charter that started this, it's here.*

---

# Engineering Team Charter

### *Living systems, lasting craft.*

---

```
ENERGY IN  →  CODEBASE  →  ENTROPY OUT
focus          living        debt
time           system        bugs
users                        drift
care
```

---

## We Believe

Software is a process, not a thing. It stays alive only while we invest energy — focus, time, users, care. Stop the flow, and it decays into legacy.

Entropy is real. Evolution is blind; architecture is foresight. Local time is real. Meaning is made through craft.

---

## We Practice

1. Maintain continuously — debt is managed, never eliminated
2. Design for change — loose coupling now = speed later
3. Build tight feedback loops — short loops = fast learning
4. Protect focus — clear goals, priorities, safety
5. Build resilience — cross-train, pair, rotate, document
6. Treat ops as engineering — runbooks, on-call, postmortems
7. Pass knowledge on — docs, reviews, mentorship, talks
8. Design for graceful sunset — deprecate, hand over, archive
9. Stay humble and grateful — no permanent wins; keep learning
10. Make meaning through craft — care for users, teammates, work

---

## The ADLC

When agents write code, a second cycle begins. We call it the Agentic Development Lifecycle.

```
ENERGY IN  →  AGENT  →  CODE  →  ENTROPY OUT
prompts       writes     commits   slop
tokens        rewrites   merges    drift
compute       deletes    pushes    debt
```

**Rule 1 — Energy in, entropy out.**
Every agent run costs human attention. Before you run an agent, ask: who is going to read this? If the answer is nobody, you're generating debt. Budget for the cleanup the same way you budget for the generation.

**Rule 2 — Agents garden. Humans architect.**
Let agents prune dead code, rename variables, add tests, fix lint, update docs. Never let them redesign boundaries. They only see the prompt, not the system.

**Rule 3 — Tests are the contract.**
An agent's output is only as good as the tests that verify it. Not the tests the agent wrote. The tests you wrote, before the agent ran. Define correct before you generate.

---

## Rituals


| Cadence | Ritual |
| ------------ | --------------------------------------------------- |
| Daily | Standup · small PRs merged · on-call handoff |
| Weekly | 2h maintenance hour · dependency check · demo |
| Biweekly | Retro · flaky test triage · doc sweep |
| Monthly | Architecture review · on-call load · debt review |
| Quarterly | Charter revisit · deep refactor · postmortem themes |
| Per incident | Blameless postmortem within 48h · actions tracked |


---

## We Measure

**Flow** — lead time · deploy frequency · cycle time · PR review time · WIP
**Quality** — change failure rate · MTTR · coverage · flaky % · dependency age
**Health** — on-call load · attrition · eNPS · bus factor · doc freshness

What we measure, we tend. What we tend, stays alive.

---

## We Aim To

- Leave the code better than we found it
- Learn from incidents, not blame
- Keep every system tested, documented, monitored, owned
- Treat docs and cross-training as normal work
- Include maintenance in every sprint
- Record context and trade-offs in decisions
- Say "not yet" when quality would suffer

---

## One Line

```
ENERGY IN  →  CODEBASE  →  ENTROPY OUT
```

**Keep the flow. Leave it better than you found it. Build meaning while the energy lasts.**

---

*Print · Keep visible · Revisit quarterly*