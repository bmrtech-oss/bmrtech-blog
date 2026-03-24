---
title: "The Five Levels of AI Coding Agents: A Practical Rating -  From
  Autocomplete to “Just Ship It”"
description: A personal take on AI coding tools—from Copilot’s autocomplete to
  Claude Code’s autonomous engineering—and the five levels that actually help
  you decide what to trust
date: 2026-03-24
draft: false
tags:
  - AI coding
  - AI-assisted programming
  - Autonomous coding
---
Here is the rating of ChatGPT, Copilot, Cursor, and Claude Code against a "5 Levels of AI Coding" framework. This is timely because the industry is finally moving beyond "which AI is best?" to "how much autonomy should I give this thing?" Let me give you an honest, practical rating based on real-world performance data and a framework that actually makes sense.

## The 5 Levels of AI Coding Autonomy

First, we need a common language. Drawing from automotive autonomy levels, several frameworks have emerged. The most practical for our purposes comes from Dan Shapiro (and echoed by Simon Willison) :

<table>

  <thead>

    <tr>

      <th>Level</th>

      <th>Name</th>

      <th>Description</th>

    </tr>

  </thead>

  <tbody>

    <tr>

      <td><strong>Level 0</strong></td>

      <td>Spicy Autocomplete</td>

      <td>AI suggests the next line or snippet; you review everything</td>

    </tr>

    <tr>

      <td><strong>Level 1</strong></td>

      <td>Coding Intern</td>

      <td>AI writes small, unimportant snippets with full human review</td>

    </tr>

    <tr>

      <td><strong>Level 2</strong></td>

      <td>Junior Developer</td>

      <td>Pair programming—AI generates code, you review every line</td>

    </tr>

    <tr>

      <td><strong>Level 3</strong></td>

      <td>Developer</td>

      <td>Most code is AI-generated; you're a full-time code reviewer</td>

    </tr>

    <tr>

      <td><strong>Level 4</strong></td>

      <td>Engineering Team</td>

      <td>AI agents handle entire features; you're the product manager</td>

    </tr>

    <tr>

      <td><strong>Level 5</strong></td>

      <td>Dark Factory</td>

      <td>Lights-out development—AI builds from specs, no human code review</td>

    </tr>

  </tbody>

</table>

This framework is useful because it separates **capability** from **trust**. A tool might be capable of Level 4 work, but you might only trust it at Level 2 for certain tasks.

## Rating the Tools

Now, let's place each tool on this spectrum. I've synthesized data from benchmark comparisons, real user reports, and firsthand testing.

### GitHub Copilot: Level 0–1 (Spicy Autocomplete to Coding Intern)

**Rating: 0.5** (can occasionally reach Level 1)

GitHub Copilot remains the most widely adopted tool, with over 1.5 million paid subscribers. But adoption doesn't equal autonomy.

**What it actually does:**

- Inline suggestions based on the current file and open tabs 
- Excellent at boilerplate and repetitive code
- ~45% suggestion acceptance rate in real-world use

**Where it fails:**

- Limited context window (~8K tokens) means it doesn't understand your full codebase 
- Cannot make multi-file changes autonomously
- Suggests code that compiles but misses edge cases, error handling, and production concerns

**Real user quote:** *"Copilot is good for reducing typing. Not for thinking."* 

**Best for:** Developers who want frictionless autocomplete without leaving their editor.

**Verdict:** Copilot is a Level 0 tool with occasional Level 1 capability. It's an advanced autocomplete, not an autonomous agent.

### ChatGPT (GPT-5): Level 1–2 (Coding Intern to Junior Developer)

**Rating: 1.5** (versatile but manual)

ChatGPT (particularly GPT-5) is the Swiss Army knife of coding assistance. It achieves 95% coding correctness in benchmarks, but there's a catch: **you have to copy-paste**.

**What it actually does:**

- Excellent at generating new code from scratch
- Strong reasoning across many languages and frameworks
- 128K token context window (can handle decent-sized files)
- Canvas feature for iterative refinement

**Where it's limited:**

- No direct IDE integration—manual copy-paste required
- Cannot run code, execute tests, or modify files
- Can confidently explain wrong things

**Real user quote:** *"It makes things sound good but doesn't verify facts."* 

**Best for:** Versatile everyday coding, rapid prototyping, and learning new frameworks.

**Verdict:** ChatGPT is a Level 1–2 tool. It can generate substantial code, but you're the integrator and tester. It's a consultant, not an agent.

### Cursor: Level 2–3 (Junior Developer to Developer)

**Rating: 2.5** (can touch Level 3 with agent mode)

Cursor represents a genuine leap forward. It's a full IDE (forked from VS Code) with AI deeply integrated. The key differentiator: **agent mode**.

**What it actually does:**

- Understands your entire codebase through indexing
- Can make multi-file changes autonomously
- Runs terminal commands (npm install, git commands) 
- 70-80% success rate on multi-file refactoring tasks

**Real-world performance:**

- Multi-file refactor success: 70-80% 
- Large codebase (>50K LOC) understanding: 60% 
- Speed: Fast (3-10s response)

**Where it struggles:**

- Can be "aggressive with suggestions." 
- Learning curve for agent mode
- Pricing opacity concerns leading some users to alternatives

**Best for:** Developers ready to commit to an AI-first editing experience.

**Verdict:** Cursor reaches Level 2 comfortably and touches Level 3 in agent mode. It's the first tool that genuinely feels like a collaborator rather than a tool.

### Claude Code: Level 3–4 (Developer to Engineering Team)

**Rating: 3.5** (approaching Level 4 for some tasks)

Claude Code (Anthropic's CLI-based agent) is the current leader in autonomous capability. Released in early 2025, it represents a fundamentally different approach.

**What it actually does:**

- Command-line tool that delegates programming tasks directly from the terminal
- Based on Claude 3.7 Sonnet with 200K context 
- Understands entire projects, not just files
- Generates robust unit tests automatically
- Integrates with Git and CI/CD systems

**Real-world performance:**

- Multi-file refactor success: 85-95% 
- Large codebase (>50K LOC) understanding: 75% 
- Speed: Slow but thorough (30s-2m per task) 
- 62.3% SWE-Bench score (industry-leading)

**Real user experience:** *"Claude Code even generated usable frontend code and, with Playwright, proper UI tests."* 

**Where it's limited:**

- Terminal freezing issues reported 
- Requires learning CLI-based workflow
- Higher cost: $100+ per month

**Best for:** Complex refactoring, legacy code understanding, and tasks requiring deep reasoning.

**Verdict:** Claude Code operates at Level 3 consistently and reaches Level 4 for well-defined tasks. It's the closest thing to an autonomous engineering teammate.

## The Elite Tier: Level 4–5 Teams

Here's where it gets interesting. Some teams are **already operating at Level 4–5**, but they're not using off-the-shelf tools in the normal way.

**The StrongDM Example:**

A tiny team (fewer than 5 people) with 20+ years of experience each has built a workflow where:

- Nobody reviews AI-produced code—ever
- The goal is proving the system works, not reviewing the code
- AI agents do testing, tooling, simulation, and demos
- Humans design the system and find patterns that help agents work effectively

This is Level 4 (Engineering Team) approaching Level 5 (Dark Factory). The key insight: **trust is earned through testing, not code review**.

**The "Two-Tier" Workflow:**

Power users are adopting a cost-optimized approach:

1. **Expensive models (Claude Opus 4.5)** → Planning and complex review only
2. **Cheap models (DeepSeek V3, Gemini Flash)** → Code generation and unit tests

This optimizes "intelligence-per-dollar" while maintaining quality.

## The Honest Comparison Table

Based on verified benchmarks and user reports :

<table>

  <thead>

    <tr>

      <th>Tool</th>

      <th>Autonomy Level</th>

      <th>Multi-File Refactor</th>

      <th>Large Codebase</th>

      <th>Speed</th>

      <th>Cost/Month</th>

      <th>Best For</th>

    </tr>

  </thead>

  <tbody>

    <tr>

      <td><strong>GitHub Copilot</strong></td>

      <td>0–1</td>

      <td>45-55%</td>

      <td>40%</td>

      <td>Fast</td>

      <td>$10-39</td>

      <td>Boilerplate, autocomplete</td>

    </tr>

    <tr>

      <td><strong>ChatGPT (GPT-5)</strong></td>

      <td>1–2</td>

      <td>N/A (manual)</td>

      <td>128K context</td>

      <td>Fast</td>

      <td>$20</td>

      <td>Prototyping, learning</td>

    </tr>

    <tr>

      <td><strong>Cursor</strong></td>

      <td>2–3</td>

      <td>70-80%</td>

      <td>60%</td>

      <td>Fast</td>

      <td>$20-40</td>

      <td>AI-first editing</td>

    </tr>

    <tr>

      <td><strong>Claude Code</strong></td>

      <td>3–4</td>

      <td>85-95%</td>

      <td>75%</td>

      <td>Slow</td>

      <td>$100+</td>

      <td>Complex refactoring</td>

    </tr>

    <tr>

      <td><strong>Devin</strong></td>

      <td>3?</td>

      <td>Unknown</td>

      <td>Unknown</td>

      <td>Unknown</td>

      <td>$20</td>

      <td>"Autonomous engineer"</td>

    </tr>

  </tbody>

</table>

## The Framework You Actually Need

Here's what this means for your COBOL reverse engineering project and beyond:

### Match Tool to Task

- **Level 0–1 (Copilot)**: Use for writing repetitive parser boilerplate
- **Level 1–2 (ChatGPT)**: Use for designing the analysis algorithms and discussing architecture
- **Level 2–3 (Cursor)**: Use for implementing the multi-file analyzer with agent assistance
- **Level 3–4 (Claude Code)**: Use for the complex rule extraction and edge case detection—tasks requiring deep understanding

### The "Plan Mode" Protocol

Before letting any agent write code, force it to produce a text-based architectural plan. This:

- Articulates logic before implementation
- Identifies dependencies
- Outlines changes BEFORE committing to code
- Drastically reduces "infinite repair loops."

The tools aren't competitors—they're a stack. Level 0 saves you typing. Level 2 saves you context-switching. Level 4 saves you thinking about implementation entirely.

And for your spec? It's already at Level 4 quality. The question is which agent you trust to execute it.

&nbsp;