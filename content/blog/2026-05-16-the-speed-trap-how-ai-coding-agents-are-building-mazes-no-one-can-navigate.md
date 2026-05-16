---
title: "The Speed Trap: How AI Coding Agents Are Building Mazes No One Can Navigate"
description: How AI-Generated Code Creates Complexity Debt That Destroys
  Developer Comprehension—and the 90-Minute Thinking Habit That Prevents It
date: 2026-05-16
draft: false
tags:
  - ai-generated code complexity
  - architecture decision records
  - top story
---
# 

---

*A blog for engineering leaders, architects, and anyone who has stared at AI-generated code and thought: "What just happened here?"*

---

> *"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."*
> — Martin Fowler

We are producing more fools every day. We just gave them superpowers.

---

## The Moment of Recognition

I've watched this scene play out in over a dozen teams during the past eighteen months. The details vary—the technology stack, the specific feature, the experience level of the people involved—but the moment of recognition is always the same.

An engineer reviews a pull request authored by a teammate who spent the afternoon prompting an AI coding agent. Four thousand lines. Feature-complete. Tests passing. The teammate is proud: "Look what we built in three hours."

The reviewing engineer starts reading. Thirty minutes later, they cannot explain why the caching layer is where it is. They cannot explain why the database is accessed three layers deeper than the team's standards permit. They cannot find the error handling—it must be in there somewhere, but the boundaries are invisible. The code isn't wrong. It compiles. The tests are green. But it doesn't seem to belong to *their* system. It belongs to whatever system the AI had in its head when the prompts were typed.

The engineer looks up from the screen and says four words that should terrify every engineering leader on the planet:

**"I have no idea."**

Not "I have no idea how to fix this." Not "I have no idea who wrote this."

Just: *I have no idea what we're looking at.*

That sentence is the sound of a codebase beginning to die. And we are hearing it in teams everywhere—in startups shipping MVPs, in enterprises modernizing monoliths, in platforms that serve internal developers. Not because AI coding agents are bad. They are astonishing. But because we handed them an accelerator and forgot to build a steering wheel.

---

## The Dream That Became a Trap

The pitch was irresistible.

An AI that could write code at ten times human speed. An agent that never gets tired, never takes lunch, never loses focus. Entire features conjured from a single sentence. Backlogs cleared. Sprints compressed. The developer shortage, solved.

For a brief, exhilarating moment, it felt true.

And then the morning came. Not just in one team. Across thousands of engineers in every industry, at every scale. People opened files and realized they were tourists in their own codebase, reading maps drawn by a cartographer who had never visited the territory.

The data is catching up with the feeling. Google's DORA 2024 research found that every 25% increase in AI adoption correlates with a 7.2% decrease in delivery stability and a 1.5% decrease in throughput . GitClear's analysis of 211 million changed lines revealed an eightfold increase in duplicated code blocks, with copy/paste exceeding code reuse for the first time in history . Developers report being 24% slower when using AI tools on complex tasks in familiar codebases .

We are not imagining the problem. We are measuring it. And it has a name.

---

## Speed Without Direction Is Not a Feature

> *"Speed is irrelevant if you are going in the wrong direction."*
> — Mahatma Gandhi

Here is what actually happens inside an AI-assisted development session, stripped of the euphoria:

The engineer types a prompt. The agent writes code. Impressive code. Detailed, syntactically correct, occasionally beautiful code. The engineer is delighted. They type another prompt. The agent writes more code. And more. And more.

Three hours later, the engineer has a working feature. Sort of. The tests pass. Sort of. And somewhere in those three hours—buried inside a cascade of keystrokes no human could track—the agent made seventeen architectural decisions that no one explicitly approved. Decisions about state management. About error propagation. About caching strategy. About database access patterns. About library choices. The prompts didn't constrain them, so the agent filled the gaps with plausible defaults.

The engineer didn't notice. The agent didn't flag them. The code just… appeared.

Two weeks later, a different engineer opens that file. They have no idea why the caching layer is where it is. They have no idea why the database is accessed three layers deeper than it should be. They have no idea what alternatives were considered before this approach was chosen. The original engineer doesn't remember either—they were watching the agent type, not reasoning about the system.

This is not a technology failure. This is a thinking failure.

A growing body of research gives this phenomenon a name: **vibe architecting**—architecture shaped by prompts rather than by deliberate, recorded design . The agent picks frameworks, scaffolds infrastructure, and wires integrations. Each of those choices is an architectural decision. Almost no one reviews them as such .

> *"Design is about making decisions under uncertainty with incomplete information. Document the uncertainty."*
> — Rich Hickey

When the decisions are made by an agent in the space between prompts, and the uncertainty was never acknowledged by the human in the loop, the architecture is no longer designed. It is *emitted*.

---

## The Comprehension Crisis Is Already Here

> *"The most dangerous kind of waste is the waste we do not recognize."*
> — Shigeo Shingo

There is a name for what happens when code grows faster than understanding can keep pace with it: **complexity debt**. It is worse than technical debt because you can pay down technical debt by refactoring known bad patterns. You cannot refactor what you cannot comprehend.

AI coding agents are issuing this debt in denominations that would have taken teams months to accumulate. They can now do it in a single afternoon.

The symptoms are already familiar. You've probably seen them in your own team:

- A new engineer joins and spends their first two weeks asking questions no one can definitively answer. "Why is this service separate from that one?" Silence. Half-memory. Half-mythology.

- A bug fix requires touching six files in three layers because the original structure has no clear seam to cut at. The code works. It just wasn't *composed*—it was *accumulated*.

- A "small change" becomes a five-day effort because the implicit assumptions embedded in the AI-generated code are so numerous, and so undocumented, that touching anything triggers a cascade. The agent made choices the human never saw.

- An architect reviews the codebase and realizes they are looking at a system that was *assembled* but never *designed*. The difference is the difference between a house and a pile of lumber. Both contain wood. Only one contains intention.

Assembled. That is the operative word. AI coding agents are magnificent assemblers. They can stitch together coherent-looking components with remarkable speed. But assembly is not architecture. Assembly without intention produces elaborate machinery that runs until it doesn't—and when it doesn't, nobody knows why.

GitClear's 2025 report captured this in numbers: duplicated code blocks increased by an order of magnitude, and 17% of cloned code contains bugs that propagate into every copy . When you assemble at speed, you don't just duplicate code. You duplicate its defects.

> *"Complex systems that work invariably evolved from simple systems that worked."*
> — John Gall

Systems that were *assembled at speed* by AI agents are not the same as systems that *evolved from simple systems*. They are the opposite: complex systems that arrived fully-formed, with no record of the choices that created them. They are mazes drawn in invisible ink. You can walk them. You just can't see the walls until you hit one.

---

## The Token Wall: When the Maze Locks You In

> *"Nine people can't make a baby in one month."*
> — Fred Brooks, *The Mythical Man-Month*

There is a moment every team using AI coding agents eventually hits. It arrives quietly, without warning. The codebase has grown complex enough, and the AI session has run long enough, that the agent hits its context limit.

The conversation—and all the implicit understanding embedded in it—simply stops fitting.

What happens next is instructive. And if you've been there, you know exactly how this feels.

The engineer starts a new session. They paste in the relevant files. They try to reconstruct the context. But the agent is seeing the codebase cold, without the conversational history, without the decisions that were made five sessions ago, without the "we rejected option B because of the rate-limiting constraint" that was discussed and then never written down.

So the agent—doing exactly what it was designed to do—produces output consistent with what it can see. Which is not the same as what the team actually decided. The agent reinvents options that were already rejected. It introduces patterns that conflict with patterns established three sessions ago. It optimizes locally for what it can see and breaks global invariants it was never told existed.

You're not resuming. You're starting over, with a collaborator who has no memory of what the two of you already agreed on.

This is the token wall. Not a technical limitation to be engineered around, but a symptom of a deeper disease: **the decisions were never written down**.

If you have a Top Story that states the purpose and acceptance criteria in one place, the agent can reconstruct context. If you have an Architecture Decision Record that documents what was decided, what was rejected, and why—the agent can resume mid-project without betraying the architecture.

Without those documents, you are not resuming. You are starting over. Every. Single. Time.

> *"If you don't know where you are going, you'll end up someplace else."*
> — Yogi Berra

The token wall is not the cliff. The cliff was built when the decisions were never recorded. The token limit just shows you how close to the edge you've been standing the entire time.

---

## Nobody Understands the Architecture. Not Even the People Who Built It.

> *"Any intelligent fool can make things bigger, more complex, and more violent. It takes a touch of genius—and a lot of courage—to move in the opposite direction."*
> — E.F. Schumacher

Ask a team to explain their architecture and watch what happens. They will produce a diagram. The diagram will show boxes and arrows. If you ask what goes in each box and why, the answers will diverge. If you ask why a particular service is separated from another, you will get a story—half memory, half mythology. If you ask what alternatives were considered before this structure was chosen, you will get silence.

This was already a problem before AI coding agents. AI coding agents have made it catastrophic.

Because now the architecture is not just undocumented—it is *emergent*. It emerged from a series of prompts. It emerged from whatever the agent chose when the prompt left room for choice. It emerged from the accumulated defaults of a system that has no idea what the team's actual constraints were, what the team's actual priorities are, or what the team explicitly decided *not* to do.

Emergent architecture is not inherently bad. Natural systems produce remarkable structure through emergence. But software teams are not ecosystems. They have stakeholders who need to understand what they are paying for. They have new engineers who need to contribute without breaking existing invariants. They have on-call rotations where a 3 a.m. incident requires fast, correct reasoning about which component failed and why.

None of that is possible when the architecture exists only in the output—never in the decision.

Martin Fowler's team has observed that AI models "do not 'understand' code the way humans do. They infer meaning from patterns in tokens and depend heavily on what is explicitly expressed in the code" . When the code is generated, the explicit expression is there. But the *why* behind it—the tradeoffs, the rejected alternatives, the constraints that shaped the choice—those were never expressed at all.

The architecture is not the code. The architecture is the sequence of decisions that produced the code. When those decisions are lost, the architecture is lost—even if every line of code is perfectly preserved.

---

## The Root Cause Is Not the AI. It Is the Missing Thinking Step.

> *"Give me six hours to chop down a tree and I will spend the first four sharpening the axe."*
> — Abraham Lincoln

Here is the uncomfortable truth:

AI coding agents do not create this problem. They *accelerate* a problem that was already latent in how most teams approach software delivery. The problem is that **coding has always been treated as thinking, and the thinking has always been done while coding**.

Rich Hickey calls this *situated thinking*—thinking while doing, responding to what is directly in front of you. It feels productive. You can see the output. You can point to lines of code and say: "Look, I made something." The alternative—deliberate thinking, stepping back, holding multiple options simultaneously, evaluating tradeoffs before committing—produces nothing visible for hours. It feels like procrastination.

It is not procrastination. It is the whole job.

When a human codes, situated thinking is constrained by the human's typing speed and the human's working memory. The misalignment between the thinking and the code is bounded. The cost of undocumented decisions is real but manageable.

When an AI agent codes, situated thinking runs at machine speed with no working memory constraints. The code arrives fully formed. The decisions are made and immediately buried under output. The misalignment between thinking and code is unbounded. The cost of undocumented decisions is catastrophic.

As the O'Reilly Radar piece on AI-infused development put it: "If the team has clear constraints, good context, and strong verification, AI can be a powerful multiplier. If the team has ambiguity, tacit knowledge, and undocumented decisions, AI amplifies those too" .

AI does not introduce drift. It accelerates whatever conditions already exist. If your team never wrote down decisions before, AI will now generate code faster than you can recover the missing context.

The solution is not to slow down the agent. The solution is to ensure that the *thinking* happens before the agent starts—and is written down so it can outlast any token limit.

---

## But the Companies Building AI Seem to Be Doing Fine

At this point, a fair objection arises: *If AI-generated code is so dangerous, how do Anthropic, OpenAI, and the other AI-first organizations build large, complex systems with these very tools? They're shipping models, infrastructure, and product features at incredible speed—and they use their own agents. Why aren't they drowning in incomprehensible mazes?*

The answer is not that they have better AI. It's that they already have the habits this essay advocates.

These organizations—and any high-functioning team that successfully integrates AI coding—do not hand the agent a one-line prompt and ship the output. They define clear, narrow tasks bounded by specifications. They write internal design documents that serve exactly the function of a Top Story and ADR: purpose, constraints, non-goals, rejected alternatives. They review the output as if it came from a junior engineer—with the same skepticism, the same demand for explanatory rationale, the same requirement that any architectural decision be documented. They treat the agent as an accelerator within a system of human thinking, not as a replacement for it.

What they do not do—and this is the critical point—is allow the agent to make architectural choices in a vacuum. When an engineer at Anthropic prompts Claude for a feature, that prompt lives inside a context that already includes documented decisions about caching, error propagation, layer boundaries, and the options the team explicitly rejected. The agent doesn't have to guess; it inherits the team's thinking.

These teams succeed because they practice the discipline of thinking before coding. They may not call their design doc a "Top Story," and they may not call their decision log an "ADR." But the function is the same: make decisions explicit, record rejections, share context, and never let code outpace comprehension.

The maze problem appears when teams adopt the speed tool without the thinking habits that the tool's creators themselves rely on. The antidote is not to stop using AI. It is to adopt the same practices that the organizations building AI already use. Those practices, stripped to their essence, are what follows.

---

## The Antidote: State Your Purpose Before You State Your Implementation

> *"If you don't know what you're trying to do, you can't know when you're done."*
> — Rich Hickey, *Design in Practice*

Every problem described in this essay has the same root cause: code was produced before the purpose was stated clearly, and decisions were made before the options were documented honestly.

The antidote is not more process. It is less ambiguity at the moment that matters: before anyone opens an editor.

Two documents, written in 90 minutes, change everything:

**The Top Story**—one sentence stating what value is being delivered, for whom, and what "done" looks like. Not a task. Not a feature. Not a Jira ticket with eight sub-tasks. A value statement that can be read aloud to someone who was not in the room and leave them able to code it and test it without asking a single clarifying question.

The engineer reviewing that 4,000-line pull request would have known within five minutes whether the code actually delivered what was promised—or just looked like it did—if a Top Story had existed.

**The Architecture Decision Record (ADR)**—a short document that states the options considered, the option chosen, and—critically—the options rejected and why. Not a plan. A decision. The difference matters: a plan has one option. A decision requires at least two, because the act of comparing options is where the actual thinking happens.

The Top Story answers: *what are we building and for whom?*
The ADR answers: *how will we build it, and what did we decide not to do?*

Together, they answer the question that every AI agent needs answered before it produces a single line: *what is the purpose of this code, and what constraints must it operate within?*

> *"Design is about producing something fit for its purpose. You have to know what the purpose is."*
> — Rich Hickey

An AI agent working from a clear Top Story and an ADR is not just faster than an AI agent working from a vague prompt. It is fundamentally different. It is an agent that can make locally correct decisions that are globally coherent. It is an agent whose output can be understood and reviewed against an explicit standard. It is an agent whose work can be resumed—even after hitting a token limit—because the decisions it was implementing are documented in a format that survives context resets.

---

## What Gets Documented Survives. What Doesn't, Gets Reinvented.

> *"Those who cannot remember the past are condemned to repeat it."*
> — George Santayana

The ADR's most underestimated section is called: **What We Are NOT Doing (and Why)**.

Most teams skip it. They document the choice. They do not document the roads not taken. Six months later, a new engineer arrives with fresh energy and a good argument for one of the rejected options. The team discusses it for two days. They almost adopt it. Then someone finds the old ADR—if they're lucky enough to have written one—and discovers that the rejected approach was already evaluated, found wanting, and abandoned for specific, documented reasons that are still valid.

Without the ADR, the team just spent two days relitigating a closed question. With the ADR, they spend fifteen minutes and move on.

This is the real ROI of architectural documentation. Not the compliance theatre of keeping records. Not the bureaucratic satisfaction of filling in templates. The actual, measurable return of never paying the cost of a forgotten decision twice.

> *"Simplicity is the ultimate sophistication."*
> — Leonardo da Vinci

The ADR-light format fits on one page. Intentionally. A document that fits on one page gets read. A document that fits on one page gets updated. A document that fits on one page can be given to an AI agent as context, and the agent will read the whole thing—including the rejected options—before it writes a line.

One page. Ninety minutes. The two levers that prevent a 4,000-line codebase from becoming something no one understands.

---

## The Compounding Return: Prompts as Team Assets

There is a second-order benefit that emerges when teams write Top Stories and ADRs before using AI coding agents—and it changes the economics of every future cycle.

When the ADR phases map directly to AI prompts (one phase, one prompt, one focused output), those prompts become **reusable team assets**. A prompt for "SSE endpoint reading from PostgreSQL" used in this cycle can be adapted for the next SSE feature in half the time. A prompt for "React component with feature flag gate" used this month becomes the starting template for every flagged component going forward.

The team does not just get faster at building. They get faster at building *well*. The accumulated prompt craft—the explicit scope boundaries, the stated output contracts, the verification gates—compounds across cycles. Each Friday retrospective reviews which prompts produced clean output and which needed rework. The prompts that needed rework are rewritten before the next cycle starts.

This is how craft accumulates in an AI-assisted team. Not by writing more code faster. By writing better *instructions* that produce better code—and preserving those instructions as a library of institutional knowledge that survives every context reset, every token limit, every team change.

> *"Before software can be reusable, it first has to be usable."*
> — Ralph Johnson

Before prompts can be reusable, they first have to be purposeful. The Top Story and ADR are the work that makes prompts purposeful.

---

## The Habit

> *"We are what we repeatedly do. Excellence, then, is not an act but a habit."*
> — Aristotle

Here is the whole discipline, stated plainly—not because it's complicated, but because simplicity deserves clarity:

Before anyone opens an editor—spend 90 minutes thinking.

Write the Top Story. Write the ADR. Let them argue with each other until both are sharp. Then give the ADR to the AI agent as context. Then prompt phase by phase, one phase at a time. Then verify each phase before proceeding to the next. Then save the prompts as team assets.

That is it.

It is not a methodology. It is not a framework requiring a certification. It is the habit of thinking before coding, applied consistently—and it produces the one thing that AI coding agents cannot generate for themselves: **a codebase that humans can understand, explain, maintain, and extend**.

The code is not the product. The understanding of the code is the product. The AI can generate the code. Only the team can generate the understanding—and they do it in the 90 minutes before the agent starts typing.

---

## A Final Word on Speed

> *"It is not enough to be busy. The question is: what are we busy about?"*
> — Henry David Thoreau

The teams that will win in an AI-assisted world are not the ones that generate the most code the fastest. They are the ones that generate the right code and know exactly why every architectural decision was made.

They will be able to onboard a new engineer in a day because the decisions are documented—not buried in a chat transcript that expired three context windows ago. They will be able to resume after a token limit because the context is preserved in artifacts the agent was built to consume. They will be able to answer a 3 a.m. incident correctly because the architecture is understood, not just running. They will be able to adapt without a rewrite because the constraints and tradeoffs are explicit.

The AI coding agent is the most powerful implementation tool the industry has ever seen.

The Top Story and ADR are the steering wheel.

Both, together, in the right order—thinking before coding, every single time—that is how you build something that lasts.

---

The Top Story + ADR practice described here is derived from the gstack cycle methodology, which builds on Rich Hickey's *Design in Practice* and the Unix philosophy of composable, well-bounded systems. The ADR format is adapted from the [ADR GitHub Organization](https://adr.github.io/) and Michael Nygard's original decision record structure.