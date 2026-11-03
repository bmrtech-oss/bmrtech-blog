---
title: "Did You Solve Your Problem, or Someone Else's? "
description: What feels like thinking is usually pattern-matching. You only find
  out when the thing breaks. The problem you solved probably wasn't yours.
date: 2026-11-03
draft: false
tags:
  - Principled Thinking
  - Systems Design
  - AI Engineering
---
When you "decide" to use microservices, you are not deciding. You are recognizing a pattern you have seen before and applying it to a situation that superficially resembles the one where you first saw it.

When you say "the tests pass, so ship it," you are not evaluating. You are pattern-matching against a workflow that has worked before, in situations that may or may not resemble this one.

This is not an insult. This is how expertise works. You build a library of patterns. The library gets large. The application gets fast. The speed feels like thinking, because from the inside, thinking and pattern-matching feel identical.

They are not identical.

```
   now
   ───

   ┌──────────┐  ┌──────────┐
   │ I have   │  │ I have   │
   │ thought  │  │ thought  │
   │ about it │  │ about it │
   └────┬─────┘  └────┬─────┘
        │             │
        │             │

   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

        │             │
        ▼             ▼
   ┌──────────┐  ┌──────────┐
   │   held   │  │  broke   │
   └────┬─────┘  └────┬─────┘
        │             │
        ▼             ▼
    thinking      pattern-
                  matching

   you can only tell
   them apart
   in hindsight

   you are not
   in hindsight
```

They produce the same output most of the time. The difference only shows up at the edges — when the pattern doesn't quite fit, when the context has shifted by one constraint, when the thing you are copying from worked for reasons that don't apply to you.

And here is the part that should make you uncomfortable: **you will not notice.** Pattern-matching feels like understanding. The gap between "this worked last time" and "this is correct" is invisible from the inside. You find out you were pattern-matching instead of thinking when the thing breaks, and not before.

Hamming used to ask his students: *"What is the important problem in your field, and why aren't you working on it?"* The question was designed to expose the difference between working on what you know how to solve and working on what actually matters. Most engineers, most of the time, are doing the first and calling it the second.

Hickey's version of the same point: *"Programmers know the benefits of everything and the tradeoffs of nothing."* That is not a complaint about knowledge. It is a complaint about the *kind* of knowledge. Knowing the benefits is pattern-matching. Knowing the tradeoffs is thinking. You can memorize the first. You cannot memorize the second.

---

So what is thinking, if it is not pattern-matching?

Thinking is the act of refusing to accept your first pattern-match as evidence.

That is it. That is the whole difference. Not a framework. Not a methodology. Not a decision matrix. Just the refusal to treat "this looks like something I've seen before" as a sufficient basis for action.

The refusal sounds trivial. It isn't. It means:

When the pattern says *microservices*, you ask what problem microservices solved for the team you are copying from, and whether you have that problem.

When the pattern says *the tests pass*, you ask who wrote the tests, and whether they cover the thing you actually care about.

When the pattern says *more context*, you ask what the context is replacing — a fact, a judgment, or a constraint you haven't articulated.

Each of these questions is uncomfortable. Each of them is a way of saying *I don't know* to a room that wants you to know.

That is the cost. Thinking is slower than pattern-matching. Thinking is more embarrassing than pattern-matching. Thinking makes you the person who asks the question nobody wanted asked, and the room does not always thank you for it.

But here is the thing Hamming understood, and Hickey understood, and most engineering teams do not:

**The cost of pattern-matching when you should be thinking is always higher than the cost of thinking when you could have been pattern-matching.**

The team that spent eighteen months migrating to microservices could have spent two days measuring their test suite. They chose the expensive mistake because it felt like progress. The measurement felt like delay. Both feelings were correct, in the moment. The moment is what they optimized for.

---

AI has not changed this. AI has removed the friction.

When you wrote the code yourself, your analogies were bounded by your own understanding. You knew where your knowledge ended. You had a felt sense of uncertainty that came from having to type the thing out yourself.

When an agent writes the code, its analogies are bounded by nothing you can see. It reaches for the pattern that looks statistically most plausible, and it reaches with the same confidence for a correct pattern as for a wrong one. It does not experience uncertainty. It does not pause before a decision that will matter in six months.

This means the discipline has moved. It has not disappeared. It now sits entirely with you — not in the writing of the code, but in the definition of the problem, the choice of the proof, and the enforcement of the constraint.

The question is no longer *can you write the thing?* The question is *can you specify what the thing must never do?*

That is a harder question. It is also the only question that survives contact with an agent.

---

Hamming's question was *what is the important problem?* Hickey's was *what are the tradeoffs?* They were asking the same thing in different words: what do you actually know, and what have you only pattern-matched?

The three questions I use now are a version of theirs.

```
┌───────────────┬───────────────┬───────────────┐
│ 1. THE        │ 2. THE        │ 3. THE        │
│    PROBLEM    │    PROOF      │    SIMPLEST   │
│               │               │               │
│ Yours. Not    │ Never false.  │ What is.      │
│ the           │ Checked by    │ Not what      │
│ pattern's.    │ something     │ feels like    │
│               │ that doesn't  │ progress.     │
│               │ trust you.    │               │
└───────────────┴───────────────┴───────────────┘
```

**What is the actual problem?** Not the one the pattern solves. The one you have.

**What would prove it's solved?** Not *it works*. A property that must never be false, checked by something that doesn't trust you.

**What is the simplest thing that would satisfy that proof?** Not the thing that feels like progress. The thing that actually is.

None of these questions is clever. All of them are uncomfortable. That is how you know they are working.

If your reasoning feels smooth, you are pattern-matching. If it feels like you keep having to stop and check something, you are thinking. The stopping is the point.

---

There is no version of this where you stop using analogy. You will keep pattern-matching. You will keep borrowing solutions. The library of things you have seen will keep growing, and most of the time it will serve you well.

The discipline is not to stop. The discipline is to notice the moment the pattern doesn't fit — and to have the willingness to say so, in the room, before the migration starts.

That moment is the whole job. Everything else is typing.

---

*This essay is part of a series on building software with judgment. The earlier posts are linked below — read in order, they build on each other.*

1. *[Beyond AI Code Generation: Why Human Focus Is Still Everything](https://antinodelabs.com/blog/2025-11-11-beyond-ai-code-generation-why-human-focus-is-still-everything/)* — establishes that AI is brilliant at *easy* and blind to *simple*.
2. *[Your AI Agent Made You Faster. So Why Are You Shipping Slower?](https://antinodelabs.com/blog/2026-10-27-your-ai-agent-made-you-faster-so-why-are-you-shipping-slower/)* — agents optimize locally while quality is global.
3. *[Why Is More Context Making Your AI Agent Worse?](https://antinodelabs.com/blog/2026-10-28-why-is-more-context-making-your-ai-agent-worse/)* — context is avoidance; invariants are the answer.
4. *[From Deterministic Component to Agentic System](https://antinodelabs.com/blog/2026-10-17-from-deterministic-component-to-agentic-system/)* — how far up the abstraction ladder you actually need to climb.

