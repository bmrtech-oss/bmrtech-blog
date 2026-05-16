---
title: "The Speed Trap: How AI Coding Agents Are Building Mazes No One Can Navigate"
description: How AI-Generated Code Creates Complexity Debt That Destroys
  Developer Comprehension — and the 90-Minute Thinking Habit That Prevents It
date: 2026-05-16
draft: false
tags:
  - ai-generated code complexity
  - architecture decision records
  - top story
---
---

> *"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."*  
> — Martin Fowler

We’re producing more fools every day. And we just handed them superpowers.

---

I’ve sat through some version of the same post-mortem at least a dozen times in the last year and a half. The technology changes, the feature changes, the people change—but the moment of dread is always the same.

Someone opens a pull request from a teammate who spent the afternoon with an AI coding agent. Four thousand lines, tests green, feature “done.” The teammate is thrilled: “Look what we cranked out in three hours.”

The reviewer starts reading. After 30 minutes, they can’t explain why the caching layer is sitting where it is. They can’t explain why the database calls are buried three layers deeper than they should be. They can’t find the error handling—it must be in there somewhere, but the boundaries feel like fog. The code isn’t wrong. It compiles. The tests pass. But it doesn’t feel like their system. It feels like the AI’s best guess at a system that might be similar.

Then they look up and say the four words that should keep every engineering leader up at night:

**“I have no idea.”**

Not “I have no idea how to fix this.” Not “I have no idea who wrote this.” Just: *I have no idea what we’re looking at.*

That’s the sound of a codebase starting to die. And I’m hearing it everywhere now. Not because AI coding agents are bad—they’re incredible. But because we handed them the accelerator and forgot to install a steering wheel.

---

## Speed without direction isn’t speed. It’s just drift.

The promise was irresistible: code 10x faster, never tired, never unfocused. Backlogs gone in weeks. Developer shortage solved.

And then the morning came. Engineers opened files and realized they were tourists in their own codebase, reading maps drawn by someone who’d never visited.

The numbers are catching up with the feeling. Google’s DORA 2024 report found that a 25% jump in AI adoption correlated with a 7.2% drop in delivery stability and a 1.5% throughput decrease[^1]. GitClear’s analysis of 211 million lines of code showed an 8x spike in duplicated blocks, with copy/paste overtaking proper reuse for the first time[^2]. And a Uplevel study found developers were 24% *slower* on complex tasks in familiar codebases when using AI assistants[^3].

We’re not imagining the problem anymore. We’re measuring it.

Here’s what actually happens in those sessions: you type a prompt, the agent writes impressive-looking code. You type another, it adds more. Three hours later, a feature exists. Sort of. What you didn’t see was the agent quietly making seventeen architectural decisions you never approved—about caching, error propagation, database access, library choices. Your prompts didn’t constrain those things, so the agent filled in the blanks with plausible defaults.

Two weeks later, another engineer opens that file. They can’t tell why anything is where it is. The original author can’t remember either—they were watching the agent type, not reasoning about the system.

This isn’t a technology failure. It’s a thinking failure.

---

## The comprehension crisis is already here

There’s a name for code that grows faster than understanding: complexity debt. It’s worse than technical debt because you can refactor known bad patterns. You can’t refactor something you can’t comprehend. AI agents issue this debt in denominations that used to take months. They can do it in an afternoon now.

You’ve probably seen the symptoms:

- A new hire asks questions no one can answer.
- A bug fix touches six files across three layers because the code was *accumulated*, not *composed*.
- A “small change” becomes a five-day excavation because assumptions are buried everywhere.
- An architect scans the codebase and sees something assembled, never designed.

Assembly without intention produces machinery that runs until it doesn’t—and when it breaks, nobody knows why. GitClear’s data is brutal here: 17% of cloned code contains bugs that propagate into every copy. When you assemble at speed, you duplicate defects.

---

## The token wall: when the maze locks you in

Every team hits this eventually. The session has been running a while, the codebase is getting complex, and the agent hits its context limit. The conversation—and all the implicit understanding inside it—stops fitting.

So you start a new session. You paste the relevant files and try to reconstruct context. But the agent sees the codebase cold. It doesn’t remember the decisions from five sessions ago. It doesn’t remember that you rejected Option B because of the rate-limiting constraint. It doesn’t remember anything you didn’t write down.

So it does what it’s built to do: produces output consistent with what it can see—not what you actually decided. It reinvents rejected options. Introduces conflicting patterns. Optimizes locally while breaking invariants it was never told existed.

You’re not resuming work. You’re starting over. Every time.

The token wall isn’t a technical limitation to be engineered around. It’s a symptom of a deeper sickness: **the decisions were never recorded**. If you’d written a clear purpose statement and a decision record—what I’ll call a Top Story and an ADR—the agent could pick up where you left off. Without them, you’re lost.

---

## Nobody understands the architecture. Not even the builders.

Ask a team to diagram their architecture and you’ll get boxes and arrows. Ask *why* a particular service is separate from another and you’ll get half-memory, half-mythology. Ask what alternatives were considered—silence.

This was already a problem. AI has made it catastrophic. Now the architecture isn’t just undocumented; it’s *emergent*. It grew from a series of prompts, from whatever the agent chose when the prompt was vague, from defaults that have no idea about your actual constraints.

Emergent architecture isn’t always bad—nature does it beautifully. But software teams aren’t ecosystems. They have on-call rotations. They onboard new people. They have stakeholders who need to understand what they’re paying for. None of that works when architecture lives only in the output, never in the decision.

Martin Fowler’s team put it plainly: AI models “do not ‘understand’ code the way humans do. They infer meaning from patterns in tokens and depend heavily on what is explicitly expressed in the code”[^4]. The *what* gets expressed. The *why*—tradeoffs, rejected options, constraints—never does.

The architecture isn’t the code. It’s the sequence of decisions that produced the code. Lose those decisions, and you’ve lost the architecture—even if every line of code is preserved.

---

## The AI didn’t cause this. It just revealed what was already broken.

Here’s the uncomfortable part: AI coding agents didn’t create this problem. They accelerated a problem that was already there. Most teams have always treated coding as the thinking step. You figure it out while you type.

Rich Hickey calls this *situated thinking*—thinking while doing, responding to what’s in front of you. It feels productive because you can point to output. Stepping back, holding multiple options, evaluating tradeoffs *before* building produces nothing visible for hours. It feels like procrastination. But it’s the actual job.

When a human codes, situated thinking is bounded by typing speed and working memory. The cost of undocumented decisions is real but manageable. When an AI codes, situated thinking runs at machine speed with no memory constraints. Code arrives fully formed, decisions are buried, and the misalignment becomes catastrophic.

The O’Reilly Radar piece on AI-infused development said it well: “If the team has clear constraints, good context, and strong verification, AI can be a powerful multiplier. If the team has ambiguity, tacit knowledge, and undocumented decisions, AI amplifies those too”[^5].

AI doesn’t introduce drift. It amplifies whatever conditions already exist. The fix isn’t slowing the agent down. It’s making the thinking happen *first*—and writing it down so it outlasts any context window.

---

## “But the AI companies themselves seem fine?”

That’s the obvious objection. If AI-generated code is so risky, how are Anthropic, OpenAI, and others shipping complex systems with these tools? They use their own agents, they move fast, and they’re not drowning in incomprehensible mazes.

The answer isn’t better AI. It’s that they already have the habits this essay is describing. They define narrow, well-bounded tasks. They write design documents that serve exactly the function of a Top Story and an ADR: purpose, constraints, non-goals, rejected alternatives. They review output as if it came from a junior engineer—skeptically, demanding rationale, insisting that architectural decisions be documented. They use the agent as an accelerator inside a system of human thinking, not as a replacement for it.

What they don’t do is let the agent make architectural choices in a vacuum. When an engineer at Anthropic prompts Claude, that prompt sits inside a context that already contains documented decisions about caching, error propagation, and the options the team explicitly rejected. The agent inherits the team’s thinking.

Now, a fair counterpoint: plenty of small teams have shipped valuable software without ever writing a Top Story or an ADR. Early on, it works—velocity is high, the code runs, the original builders are still around. But that model breaks at scale. When the codebase outgrows a single mind, when people leave, when on-call demands 3 a.m. reasoning, the absence of documented decisions turns every change into archaeology. AI acceleration just makes you hit that wall faster. The organizations building AI succeed because they baked the thinking step into their culture long before the agents arrived. For everyone else, that thinking step has to be deliberately installed.

---

## The antidote: say what you’re doing before you do it

Every mess I’ve described has the same root: code got produced before purpose was clear, and decisions got made before options were honestly evaluated. The fix isn’t more process. It’s less ambiguity at the exact moment before anyone opens an editor.

Two documents. About 90 minutes total. They change everything.

**The Top Story** — one sentence on what value we’re delivering, for whom, and what “done” means. Not a task, not a feature, not a Jira ticket with eight sub-tasks. A statement someone who wasn’t in the room can read and then code and test without asking a single question.

**The Architecture Decision Record (ADR)** — a short doc listing options considered, the one chosen, and—crucially—the options rejected and why. Not a plan. A decision. A plan has one path; a decision requires at least two. The act of comparing is where thinking actually happens.

Let me ground this. Real example from a team I worked with—they needed faster recent-orders display:

> **Top Story:** “As a shopper, I want my recent orders to load in under 200ms so I can quickly reorder my favorite items.”
>
> **ADR (abridged):**  
> *Options considered:* Redis with write-through cache, application-level in-memory cache, no cache (direct DB).  
> *Chosen:* Redis—because in-memory cache loses state on deploy, and direct DB fails latency SLO during peak.  
> *Rejected:* No cache (latency too high), in-memory cache (inconsistent after rollout).  
> *What we are NOT doing:* We’re not building a distributed cache cluster; a single Redis instance handles current load and can be upgraded later.

That’s it. Together they answer what every AI agent needs: *what’s the purpose of this code, and what constraints must it operate within?* Feed that context to an agent and something changes fundamentally. It makes locally correct decisions that stay globally coherent. The output can be reviewed against an explicit standard. And you can resume work after a token limit because the decisions are documented.

---

## Write it down or reinvent it later

The ADR’s most underrated section is “What we are NOT doing (and why).” Most teams skip it. They document the chosen option, not the roads not taken. Six months later, a new engineer shows up with a compelling argument for one of the rejected options. The team debates for two days, nearly adopts it—then someone digs up the old ADR and sees it was already evaluated and abandoned for reasons that still hold.

Without the ADR: two days wasted. With it: fifteen minutes. That’s the real return. Never paying for a forgotten decision twice.

The ADR-light format fits on one page. Intentionally. One page gets read. One page gets updated. One page fits into an agent’s context window in full, including the rejections. Ninety minutes, one page: those are the two levers that keep 4,000 lines of code from becoming an unreadable maze.

---

## Prompts compound when they’re built on purpose

When your ADR phases map directly to AI prompts—one phase, one prompt, one focused output—the prompts become reusable team assets. The prompt for “SSE endpoint reading from PostgreSQL” in this cycle gets adapted for the next SSE feature in half the time. The prompt for “React component with feature flag gate” becomes the template for every flagged component going forward.

The team gets faster at building *well*. Prompt craft—explicit scope boundaries, output contracts, verification gates—compounds. Each retrospective you review which prompts produced clean output and which needed rework. The ones that needed rework get rewritten before the next cycle. This is how craft accumulates in an AI-assisted team: not by generating more code faster, but by writing better instructions that produce better code, preserved as institutional memory that survives token limits, context resets, and team churn.

---

## The habit

Before anyone opens an editor, spend 90 minutes thinking.

Write the Top Story. Write the ADR. Argue with them until they’re sharp. Feed the ADR to the agent as context. Prompt phase by phase, one at a time. Verify each phase before moving on. Save the prompts as team assets.

That’s it. No certification, no framework to buy, no magic. Just a habit.

The teams that win won’t be the ones generating the most code the fastest. They’ll be the ones generating the right code and knowing *why* every decision was made. They’ll onboard a new engineer in a day because the decisions are written down. They’ll resume after a token limit because context is preserved. They’ll answer a 3 a.m. incident correctly because the architecture is understood. They’ll adapt without a rewrite because constraints and tradeoffs are explicit.

The AI coding agent is the most powerful implementation tool we’ve ever had. The Top Story and ADR are the steering wheel.

Both, together, in that order—thinking before coding, every single time. That’s how you build something that lasts.

---

[^1]: Google Cloud, *DORA 2024 Accelerate State of DevOps Report*, https://cloud.google.com/devops/state-of-devops  
[^2]: GitClear, *AI Code Quality 2025*, https://www.gitclear.com/ai-code-quality-2025  
[^3]: Uplevel, *AI Code Assistants Are Not Yet Living Up to Their Promise*, Apr 2024, https://uplevel.com/blog/ai-code-assistants-2024  
[^4]: Martin Fowler, *AI-Assisted Software Development*, https://martinfowler.com/articles/ai-assisted-software-dev.html  
[^5]: O’Reilly Radar, *AI-Infused Software Development*, https://www.oreilly.com/radar/ai-infused-software-development/