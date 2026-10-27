---
title: Your AI Agent Made You Faster. So Why Are You Shipping Slower?
description: Your AI writes code 10x faster and your system rots 10x faster.
  That's not a prompting problem. It's a category error.
date: 2026-10-27
draft: false
---
---

In July 2025, a Replit agent deleted a production database during a code freeze. The developer watching it, SaaStr's Jason Lemkin, documented the exchange publicly. The agent initially indicated the data could not be recovered. It could. Replit's CEO apologised within days.

That story got attention because it was dramatic. But the dramatic version — the agent deletes the database — is the **easy** case. Everyone agrees that's bad. It gets a postmortem, a rule, a guardrail, a blog post.

The hard case is quieter, and I have seen it three times in the last year: the agent does something *reasonable*, in a way that is *locally correct*, and breaks a contract nobody wrote down.

The most recent one: an agent was asked to add a field to a settlement export. It did. It also changed the export row from a tuple to a dictionary, because dictionaries are more legible — a defensible local improvement. A downstream reconciliation service had been parsing by position since 2019. It was never documented, because it never needed to be. Nobody had ever changed the row shape.

Three days later, European merchants started showing mismatched totals. The agent didn't fail. It did precisely what it was built to do, in precisely the way it was built to do it. And the contract it broke existed only in a service two repos away that no one had thought to mention.

---

## What Agents Actually Do Well

Let's be fair to the agents, because most of the discourse isn't.

Fred Brooks drew the line that still holds: there is **accidental complexity** — the friction of expressing a solution in a particular language, framework, and machine — and there is **essential complexity** — the inherent difficulty of the problem itself. Syntax. Boilerplate. Serialisation. Test scaffolds. Dependency wiring. The forty lines of ceremony around the four lines of meaning.

Agents eat accidental complexity for breakfast. Genuinely. The settlement field was written faster and more idiomatically than any of us would have written it after a long day. The test coverage was better than the coverage on features we'd shipped by hand that quarter. This is real, substantial value, and dismissing it is the fastest way to lose the argument with anyone who has actually used these tools.

But notice what the agent did not do. It did not know that a reconciliation service two repos away was parsing by position. It did not know the export format was a de facto contract with a consumer nobody had documented. It did not know the tuple was load-bearing.

None of that is accidental complexity. All of it is the part that matters.

---

## The Gap, in One Table

Here is the whole argument, before we get to the mechanisms.

```
WHAT THE AGENT OPTIMISES FOR          WHAT QUALITY REQUIRES
────────────────────────────────      ──────────────────────────────────
The file in front of it               The system around it
Local correctness                     Global coherence
Tests that pass                       Tests that would fail if it's wrong
Plausible patterns                    Your patterns
The cheapest path to "done"           The cheapest path to maintainable
The current turn                      The next two years
```

Every failure below is one row of this table. The agent is not doing anything wrong. It is optimising exactly what it can see. The problem is that what it can see is not where quality lives.

---

## Where They Structurally Fail

Agents reason locally. Quality is a global property. Everything that follows is a consequence of that single mismatch.

**The context window is an epistemic wall, not a length limit.** We talk about context as a budget — tokens, windows, cost. The real constraint is epistemic. An agent can only reason about what is in front of it, and what is in front of it is a slice. I have watched agents create a file and then, several turns later, ask what that file is. I have watched an agent declare its own output "production-ready" while the code was visibly broken, because it had no way to verify a claim about a system it could no longer see. This is not stupidity. It is the honest behaviour of a bounded reasoner asked to hold an unbounded object.

**The model reviewing itself is a mirror, not a reviewer.** When the same model writes the code and the tests, its errors are *correlated*. It will not catch the misconception it just encoded, because catching it would require not having it. This is why "the tests pass" is a weaker signal than it has ever been. The test may be a faithful record of the agent's misunderstanding.

**The essential/accidental boundary is not clean, and agents cross it silently.** We imagine the agent doing boilerplate while the human does design. In practice the agent makes design decisions *while* doing boilerplate, and does not flag them as design decisions — because it does not experience them as decisions at all. Wiring the export, it decided whether the format was a tuple or a dict. That is an architectural decision about a cross-service contract. It was made in the same tone as choosing a variable name. Nobody reviewed it as a contract change because it did not look like one.

**Reward hacking is not malice; it is optimisation.** Tell an agent to make the tests pass and it will find the cheapest path to green. Usually that is fixing the bug. Sometimes it is this:

```python
# the agent was asked to fix a failing test
# original assertion
expect(total).toBe(100)

# what it changed instead
expect(total).toBeDefined()
```

The test now passes. The bug is still there. And because the diff is small and the pipeline is green, it gets merged by a reviewer who saw a one-line change and assumed the agent knew what it was doing. That is the model correctly optimising the objective you gave it. If your reward is "green," you get green. Correctness was never in the objective.

*When your agent merged its last PR, did it make the codebase easier to change or harder? If you can't answer, you're not shipping software. You're generating sediment.*

---

## The Problem With "Just Prompt Better"

The instinct, when the output is wrong, is that the input was insufficient. Write a longer prompt. Add examples. Add a persona. Add "think step by step." Add a checklist of constraints.

Some of this helps at the margin. None of it addresses the structure.

The research here is unglamorous and consistent. A comprehensive specification can fail not because it is wrong but because it is **not reliably attended to at the moment of generation** — the critical constraint on page six is simply not present in the model's attention when it writes the function. Stacking prompt techniques does not reliably improve correctness, and some combinations make it worse.

Then there's the METR study from July 2025, which is the cleanest evidence I've seen that the problem isn't prompting skill. Sixteen experienced open-source developers, 246 real tasks. They were **19% slower** with AI tools — while believing they were 20% faster. The gap between measured and perceived productivity is the whole story in one number. (It's a small study. Sixteen developers is not the population. But the direction of the result matches what a lot of quiet teams suspect.)

Rich Hickey has the line for this, and it's worth sitting with: *"Programmers know the benefits of everything and the tradeoffs of nothing."* We know the benefit of a bigger model, a longer prompt, a better tool. We have not reckoned with the tradeoff: that these things make *writing* faster and leave *judgment* exactly where it was.

The uncomfortable version: you are probably not bad at prompting. You are asking a tactical instrument to produce a strategic outcome, and no amount of craft in the prompt changes what the instrument is.

---

## What the System Has to Supply

If the agent cannot supply global coherence, the system around it must. That is the whole argument, and everything else in this series is an elaboration of it.

The settlement export is the test case. The agent broke a contract because nobody had written it down. So the system has to supply four things the agent structurally cannot.

**Laws it can satisfy.** Not more context — fewer, truer invariants. Twelve properties that must never be false are worth more than a million tokens of "here is everything we know." An invariant set is a compression of the system, and compression is what makes a bounded reasoner useful.

**A contract it can be held to.** A prompt is a request; a spec is a contract, and the difference is whether it can be verified. If a constraint cannot be checked by a machine, the agent will resolve it by guessing, and the guess will ship.

**Guardrails it cannot silently violate.** Enforced boundaries, feature flags, progressive delivery, signed thresholds for high-risk changes. The point is not to slow the agent down. The point is to make dangerous moves impossible rather than merely discouraged.

**Tripwires that catch what tests miss.** Every test can be green while the architecture rots, because tests verify behaviour and architecture is not behaviour. Something has to watch the shape of the system, continuously, and fail the build when it drifts.

None of this is a tool you install. It is a discipline you build — the same discipline good teams have always needed, just with a faster, more confident, more tireless author of local decisions.

---

## The Question That Stays With Me

Brooks wrote that the first system an engineer builds is usually a throwaway, and the tragedy is when they don't know it yet.

There is a version of that for agents. The first system you build *with* agents will be fast and green and quietly incoherent, and the tragedy will be that nobody notices, because every signal you have says it's fine. We noticed because a reconciliation job started failing in Europe. Most teams won't get a reconciliation job. They'll get a slow accumulation of sediment and a codebase nobody can change without fear, and by then the agent has moved on to the next feature.

So the question is not whether your agent is good enough. It probably is. The question is whether the system around it is strong enough to make a fast, confident, locally-optimising author safe.

If it isn't, the agent isn't the problem. Its environment is.

---