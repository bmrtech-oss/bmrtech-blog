---
title: "The Five Levels of AI Coding Agents: A Practical Rating"
description: A personal take on AI coding tools—from Copilot’s autocomplete to
  Claude Code’s autonomous engineering—and the five levels that actually help
  you decide what to trust
date: 2026-03-24
draft: true
tags:
  - AI coding
  - AI-assisted programming
  - Autonomous coding
---


You've asked me to rate ChatGPT, Copilot, Cursor, and Claude Code against a "5 Levels of AI Coding" framework. This is timely—because the industry is finally moving beyond "which AI is best?" to "how much autonomy should I give this thing?"

Let me give you a honest, practical rating based on real-world performance data and a framework that actually makes sense.

## The 5 Levels of AI Coding Autonomy

First, we need a common language. Drawing from automotive autonomy levels, several frameworks have emerged . The most practical for our purposes comes from Dan Shapiro (and echoed by Simon Willison) :

| Level | Name | Description |

|-------|------|-------------|

| **Level 0** | Spicy Autocomplete | AI suggests the next line or snippet; you review everything |

| **Level 1** | Coding Intern | AI writes small, unimportant snippets with full human review |

| **Level 2** | Junior Developer | Pair programming—AI generates code, you review every line |

| **Level 3** | Developer | Most code is AI-generated; you're a full-time code reviewer |

| **Level 4** | Engineering Team | AI agents handle entire features; you're the product manager |

| **Level 5** | Dark Factory | Lights-out development—AI builds from specs, no human code review |

This framework is useful because it separates **capability** from **trust**. A tool might be capable of Level 4 work, but you might only trust it at Level 2 for certain tasks.

## Rating the Tools

Now let's place each tool on this spectrum. I've synthesized data from benchmark comparisons, real user reports, and firsthand testing .

### GitHub Copilot: Level 0–1 (Spicy Autocomplete to Coding Intern)

**Rating: 0.5** (can occasionally reach Level 1)

GitHub Copilot remains the most widely adopted tool, with over 1.5 million paid subscribers . But adoption doesn't equal autonomy.

**What it actually does:**

- Inline suggestions based on the current file and open tabs 
- Excellent at boilerplate and repetitive code
- ~45% suggestion acceptance rate in real-world use 

**Where it fails:**

- Limited context window (~8K tokens) means it doesn't understand your full codebase 
- Cannot make multi-file changes autonomously
- Suggests code that compiles but misses edge cases, error handling, and production concerns 

**Real user quote:** *"Copilot is good for reducing typing. Not for thinking."* 

**Best for:** Developers who want frictionless autocomplete without leaving their editor .

**Verdict:** Copilot is a Level 0 tool with occasional Level 1 capability. It's an advanced autocomplete, not an autonomous agent.

### ChatGPT (GPT-5): Level 1–2 (Coding Intern to Junior Developer)

**Rating: 1.5** (versatile but manual)

ChatGPT (particularly GPT-5) is the Swiss Army knife of coding assistance. It achieves 95% coding correctness in benchmarks , but there's a catch: **you have to copy-paste**.

**What it actually does:**

- Excellent at generating new code from scratch
- Strong reasoning across many languages and frameworks
- 128K token context window (can handle decent-sized files)
- Canvas feature for iterative refinement 

**Where it's limited:**

- No direct IDE integration—manual copy-paste required
- Cannot run code, execute tests, or modify files
- Can confidently explain things that are wrong 

**Real user quote:** *"It makes things sound good but doesn't verify facts."* 

**Best for:** Versatile everyday coding, rapid prototyping, and learning new frameworks .

**Verdict:** ChatGPT is a Level 1–2 tool. It can generate substantial code, but you're the integrator and tester. It's a consultant, not an agent.

### Cursor: Level 2–3 (Junior Developer to Developer)

**Rating: 2.5** (can touch Level 3 with agent mode)

Cursor represents a genuine leap forward. It's a full IDE (forked from VS Code) with AI deeply integrated . The key differentiator: **agent mode**.

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

- Can be "aggressive with suggestions" 
- Learning curve for agent mode
- Pricing opacity concerns leading some users to alternatives 

**Best for:** Developers ready to commit to an AI-first editing experience.

**Verdict:** Cursor reaches Level 2 comfortably and touches Level 3 in agent mode. It's the first tool that genuinely feels like a collaborator rather than a tool.

### Claude Code: Level 3–4 (Developer to Engineering Team)

**Rating: 3.5** (approaching Level 4 for some tasks)

Claude Code (Anthropic's CLI-based agent) is the current leader in autonomous capability. Released in early 2025, it represents a fundamentally different approach.

**What it actually does:**

- Command-line tool that delegates programming tasks directly from terminal
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

**Best for:** Complex refactoring, legacy code understanding, and tasks requiring deep reasoning .

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

1.  **Expensive models (Claude Opus 4.5)** → Planning and complex review only
2.  **Cheap models (DeepSeek V3, Gemini Flash)** → Code generation and unit tests 

This optimizes "intelligence-per-dollar" while maintaining quality.

## The Honest Comparison Table

Based on verified benchmarks and user reports :

| Tool | Autonomy Level | Multi-File Refactor | Large Codebase | Speed | Cost/Month | Best For |

|------|---------------|---------------------|----------------|-------|------------|----------|

| **GitHub Copilot** | 0–1 | 45-55% | 40% | Fast | $10-39 | Boilerplate, autocomplete |

| **ChatGPT (GPT-5)** | 1–2 | N/A (manual) | 128K context | Fast | $20 | Prototyping, learning |

| **Cursor** | 2–3 | 70-80% | 60% | Fast | $20-40 | AI-first editing |

| **Claude Code** | 3–4 | 85-95% | 75% | Slow | $100+ | Complex refactoring |

| **Devin** | 3? | Unknown | Unknown | Unknown | $20 | "Autonomous engineer" |

## The Framework You Actually Need

Here's what this means for your COBOL reverse engineering project and beyond:

### Match Tool to Task

- **Level 0–1 (Copilot)**: Use for writing repetitive parser boilerplate

- **Level 1–2 (ChatGPT)**: Use for designing the analysis algorithms and discussing architecture

- **Level 2–3 (Cursor)**: Use for implementing the multi-file analyzer with agent assistance

- **Level 3–4 (Claude Code)**: Use for the complex rule extraction and edge case detection—tasks requiring deep understanding

### The "Plan Mode" Protocol

Before letting any agent write code, force it to produce a text-based architectural plan . This:

- Articulates logic before implementation

- Identifies dependencies

- Outlines changes BEFORE committing to code

- Drastically reduces "infinite repair loops"

### Context Is Everything

The gap between Level 2 and Level 4 isn't just model capability—it's **context engineering**. Claude Code succeeds because it understands entire projects. Cursor succeeds because it indexes your codebase. Copilot struggles because it only sees the current file.

For your COBOL tool, this means:

- Provide the full grammar

- Show examples of input and expected output

- Include edge cases explicitly

- Structure the spec as a phased task list (which you've already done brilliantly)

## The Bottom Line

If you're building the COBOL reverse engineering tool:

- Use **ChatGPT** for designing the analysis approach and discussing algorithms

- Use **Cursor** for implementing the parser and analyzer (it will understand your project structure)

- Consider **Claude Code** for the trickiest parts—the business rule extraction and edge case detection

- Keep **Copilot** running in the background for boilerplate, but don't rely on it for complex logic

The tools aren't competitors—they're a stack. Level 0 saves you typing. Level 2 saves you context-switching. Level 4 saves you thinking about implementation entirely.

And for your spec? It's already at Level 4 quality. The question is which agent you trust to execute it.

&nbsp;