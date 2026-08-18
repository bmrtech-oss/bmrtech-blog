---
title: "The AI Productivity Paradox: Why AI Made Me Slower and What I Finally
  Did About It. "
description: I spent a year blaming AI for deleting my code. Then I looked in
  the mirror. Here's what the data and my own mistakes; taught me about using AI
  assistants the right way.
date: 2026-08-18
draft: false
tags:
  - AI Coding Assistants
  - Prompt Engineering
---
---


<pre>

+--------------------------------------------------------------------+
|                                                                    |
|            T H E   U N C O M F O R T A B L E   C O N F E S S I O N |
|            O F   A N   A I   U S E R                               |
|                                                                    |
|                   .        - .      - .                            |
|                  / \       / \       / \                           |
|                 | A |     | B |     | C |                          |
|                  \ /       \ /       \ /                           |
|                 ' - '     ' - '     ' - '                          |
|                                                                    |
|               Dump it    Fix it    Trust it                        |
|                                                                    |
|            "The problem isn't the AI. It's me."                    |
|                                                                    |
+--------------------------------------------------------------------+

</pre>

---

I need to write this down. Not because I have a solution. Not because I've figured it out.

I need to write it down because I keep staring at Claude apologizing to me for the fifth time today, and I finally have to admit something out loud:

**I am the problem.**

Not the context window. Not the model. Not the system prompt I copied from Twitter.

Me.

And the worst part? I've known it for months. I just didn't want to say it.

---

## The Day I Stopped Blaming the Tool

It was a Tuesday. An utterly unremarkable Tuesday.

I had been working on the same project for three weeks. Beautiful architecture. Modular. Testable. Everything I'd ever wanted. And I had been using Claude to generate most of it.

I pasted my prompt. Claude generated the code. I copied it. I overwrote my file.

And then I realized: my first function was gone. Completely gone. Not refactored. Not modified. **Gone.**

My first instinct was anger. *"Claude deleted my function."*

And then, for the first time, I stopped myself.

*No. I deleted my function. I pasted over it without reading. I trusted a machine to remember what I refused to check myself.*

That was the moment the ground shifted. All those hours. All those carefully crafted prompts. All that trust placed in a tool that was doing *exactly what I told it to do.*

I was just too careless to notice what I was telling it.

---

## The Numbers That Confirmed My Fear

After that Tuesday, I went digging. I needed to know if I was alone in this mess. So I pulled up the Stack Overflow 2024 survey—the one everyone cites.

Eighty percent of us are using AI tools now.

But trust in the accuracy of those tools? It's dropped from 40% to just 29%.

We're using it more and believing it less. That hit close to home. I was using Claude every day, but I was also apologizing to it every day. The numbers just confirmed what my gut already knew.

Then I came across the Bain & Company report.

Teams using AI assistants saw a modest 10 to 15% productivity bump. Not the 10x everyone tweets about. Not the revolution we were promised. Just a small step forward.

Then came the study that really stung.

A controlled experiment with experienced developers found that using AI actually made them *slower*.

By 19%.

Not faster. Slower.

Why? The same reason I lost my function. We spend so much time reviewing and fixing the AI's output that whatever time we save on writing gets eaten up on the back end. The tool doesn't fix carelessness. It just amplifies it.

The numbers didn't give me a solution. But they gave me something more valuable: permission to stop blaming the tool and start looking in the mirror.

---

## The Three Camps We All Fall Into

I started watching how my colleagues used AI. Not to judge them—to understand why we were all getting the same frustrating results.

And I saw three distinct patterns emerge—the very ones you see in the banner above.

**Camp A** dumps their entire codebase into the prompt. Every file. Every dependency. They think more context equals better answers.

**Camp B** keeps asking the AI to "fix it" over and over, hoping that sheer repetition will eventually produce the right output.

**Camp C** blindly trusts whatever the AI generates. They copy, paste, and move on without reviewing a single line.

I've been in all three camps. Probably in the same week.

And here's the uncomfortable truth I had to face: **None of these camps work because none of them involve *me* actually thinking.**

---

## The Three Rules That Finally Broke the Loop

I didn't find these rules in a tutorial. I didn't watch a YouTube video.

I discovered them the hard way—by losing code, getting angry, calming down, and finally admitting that I was the variable that needed to change.

### Rule One: Plan Before You Prompt

I was in "Follow Mode." I'd say *"change the font"* and Claude would output 200 lines of code. I'd copy it without reading, overwrite everything, and then wonder why my slides vanished.

The fix is brutally simple: **Force "Plan & Approve" mode.**

Add this to your custom instructions:

> *"CRITICAL: You are in 'Plan & Approve' mode. You are FORBIDDEN from writing any code until I say 'APPROVED'. Output only a bulleted plan of exactly what changes and what stays untouched. I will review and say 'Proceed'."*

Now when I ask for a change, Claude says:

> *"Plan: Keep Slides 1-3 untouched. Modify only the CSS on Slide 4. Awaiting approval."*

I read it. I spot the flaw. I correct it. I say "Proceed."

No more deleted slides. No more apologies.

### Rule Two: One File Per Chat

The context window is a two-foot desk. You can only lay out a few things at a time. Dump your entire codebase on it, and things fall off.

Fix: Never paste more than one file per chat. If a task touches three files, spin up three separate chats. Finish File A. Close it. Open a new chat for File B. Only paste File B.

### Rule Three: Summarize, Don't Re-paste

When moving from Task 1 to Task 2, do NOT paste the 500 lines you just generated. Summarize it in three bullet points:

> *"Context: Built a login() function returning a JWT token. DB is PostgreSQL. Now here's my NEW file for Task 2..."*

This compresses 500 tokens into 50. Saves space for the actual work. Keeps the AI focused instead of drowning in its own history.

---

## What I'd Say to You

If you're reading this and nodding along—I'm sorry. I'm sorry you're dealing with the same frustration. I know exactly how it feels.

If you're reading this and thinking, "That's not me"—I'm happy for you. Protect that discipline with everything you have.

And if you're reading this and wondering whether you're the problem—whether you're bad at prompting, whether you're just not "getting it"—

**Stop.**

You're not the problem. The way you're using the tool is the problem.

And that's fixable. It doesn't require a new model or a better subscription. It just requires you to slow down.

Plan before you prompt. Approve before you apply. Chunk before you chat.

Try it for one day. Just one.

I think you'll be surprised at how few apologies you hear.

---

## The Question That Stays With Me

I started this with a confession. I'll end it with a question that I'm still trying to answer:

*Why did it take me so long to admit that I was the one who needed to change?*

Pride, probably. Laziness, definitely. The seductive belief that technology should adapt to me, rather than the other way around.

I don't have a tidy resolution. I don't have a neat bow to put on this post.

What I have is a new habit. Three rules. And a willingness to finally, actually, read the code before I paste it.

If you've been here—or are here now—I'd genuinely love to hear from you. What broke the loop for you? What made you realize you were the variable that needed to change?

Let's talk. The best conversations always start with uncomfortable confessions.

---

<pre>

+--------------------------------------------------------------------+
|                                                                    |
|            Plan before you prompt.                                 |
|            Approve before you apply.                               |
|            Chunk before you chat.                                  |
|                                                                    |
|            Try it for one day. Just one.                           |
|                                                                    |
|            "The apologies will stop."                              |
|                                                                    |
+--------------------------------------------------------------------+

</pre>

---

