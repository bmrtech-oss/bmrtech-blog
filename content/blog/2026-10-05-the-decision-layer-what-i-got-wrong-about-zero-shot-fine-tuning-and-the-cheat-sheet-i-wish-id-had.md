---
title: "The Decision Layer: What I Got Wrong About Zero-Shot, Fine-Tuning, and
  the Cheat Sheet I Wish I'd Had"
description: I spent weeks treating every structured decision like a text
  generation problem. Then I built a cheat sheet to stop.
date: 2026-10-05
draft: false
tags:
  - System One Models
  - Decision Layer
  - Zero-Shot Classification
  - Typesafe AI
---
#

---

I spent three weeks building a customer support router that took **2,347 milliseconds** to decide whether a message was about billing or technical issues. I thought that was fine. I thought that was the cost of doing business with AI.

Then a staff engineer who had been quietly watching my dashboard for a week — leaned over my shoulder and asked:

> *“Why are you using a model that writes paragraphs to make a decision that fits in a single word?”*

I didn’t have an answer. So I went looking for one.

That question led me down a path that reshaped how I think about AI in production. Not because the answer was complicated — because it was embarrassingly simple. And I had missed it for three weeks.

---

## The Anchor

Rich Hickey, in *Simple Made Easy*, drew a distinction that most engineers nod at and then immediately forget: **easy is not the same as simple.** Easy means “close at hand.” Simple means “one fold, one braid — not interleaved.”

Reaching for a frontier LLM to classify a support ticket is *easy*. It’s right there. It’s familiar. It writes fluent English. But it is not *simple*. It is a giant, interleaved, probabilistic engine being used to answer a question that a logistic regression could answer in 6.8 milliseconds.

I had chosen easy. I had not chosen simple. And the dashboard was screaming at me about it.

---

## Act I — The Tuesday I Looked at the Dashboard

**p95 latency: 2,347 milliseconds.**

Not terrible for an LLM. Fast enough for a human reading a chat message. But I wasn’t building a chatbot. I was building **automated routing**. Every ticket triggered a full autoregressive generation. The model thought token by token — *“This looks like a billing issue…”* — then emitted `"billing"` or `"technical"`.

I was paying for every token of that reasoning. My users were waiting for it. And the decision didn’t need reasoning.

> *“I was charged twice”* → billing.
> *“The app crashes when I upload”* → technical.

A logistic regression trained on 500 examples could handle this. I had reached for the biggest hammer I had — and I had done it because the hammer was shiny, not because the nail was big.

---

## Act II — A Different Kind of Model

I started reading about **Jev**, then about the broader category of **System One models** — named after Kahneman’s fast, automatic thinking. These models don’t generate text. They take a context, a question, and a set of predefined options. They return **calibrated probabilities in a single forward pass**.

No token-by-token decoding. No parsing generated text. No hoping the output is valid JSON.

Here’s what the two approaches look like side by side:

```
THE WAY I WAS DOING IT — LLM with free-text output

  Client  ──prompt──►  LLM
                        │
                        │  generates 200 tokens, token by token
                        │  "This looks like a billing issue..."
                        ▼
  Client  ◄──text────  LLM
     │
     │  parse free text, hope it says the right thing
     │  handle the 2% of cases where the model rambles
     ▼
  Decision: "billing"        ~1,351 ms


THE WAY I SHOULD HAVE BEEN DOING IT — System One decision

  Client  ──context + question + options──►  System One model
                                                  │
                                                  │  single forward pass
                                                  ▼
  Client  ◄──probability distribution────────  {"billing":   0.91,
                                                "refunds":   0.06,
                                                "technical": 0.02,
                                                "account":   0.01}
     │
     ▼
  Decision: "billing"        ~87 ms
```

The second version is **15x faster** on latency, an order of magnitude cheaper, and the output is **type-safe**: the schema defines the possible answers, so the model cannot return anything outside it. No parsing. No repair logic. No hallucinated categories.

Jev claims up to **200x faster** and **1/400th the cost** of frontier LLMs, with end-to-end latency in the **70–500ms** range. That’s the pitch. But the pitch isn’t the whole story.

---

### The Part Where I Almost Made a Second Mistake

When I first read about zero-shot decision models, I thought: *this solves everything. I never need to train a model again.*

That’s wrong. And it’s the most important thing in this post.

**Zero-shot does not automatically beat fine-tuning on accuracy.** It wins on flexibility, speed, cost, and drift robustness. Not raw accuracy.

The data is clear. On **LexGLUE**, a fine-tuned BERT-base scored **77.4 micro-F1**. Jev zero-shot scored **69.9**. That’s a **7.5-point gap** that narrows to 3.2 with per-label threshold tuning — but never closes.

On **BANKING77** — 77 intent classes — a logistic regression on top of MiniLM embeddings hit **90.3% accuracy** at **6.8ms median latency on CPU**. Zero-shot GPT-5.6 Terra reached **83.8%** at **1,351ms**. The fine-tuned model was *both* more accurate and faster.

```
MEDIAN LATENCY — same job, wildly different times
(log scale, lower is better)

  Logistic regression    6.8 ms   |#
  System One model        87 ms   |##########
  Zero-shot LLM        1,351 ms   |##############################
  What I shipped       2,347 ms   |##########################################

ACCURACY — BANKING77, 77 intent classes

  Logistic regression (MiniLM)    90.3%
  Zero-shot frontier LLM          83.8%
```

When you have enough labeled data and a stable task, **fine-tuning wins on accuracy**. Zero-shot wins on everything else.

Here’s the nuance that changed how I think about it. On a **5,733-email spam/phishing test**, Jev and a TF-IDF logistic regression trained on ~4,600 labeled messages per fold **tied at roughly 98.7%**. But on **853 phishing messages from 2024–25**, Jev caught **95.31%**. The regression, trained on older data, caught **75.26%**. The fine-tuned model was **brittle to temporal drift**. The zero-shot model wasn’t.

So the question isn’t *“which is better?”* It’s **“which trade-off do I actually need?”**

---

## The Decision Tree I Wish I’d Had

```
WHICH DECISION MODEL SHOULD YOU REACH FOR?

Is the task a structured decision?
│
├── NO  ──►  Generative LLM / RAG
│
└── YES
    │
    ├── Do you have labeled examples for this exact task?
    │   │
    │   ├── NO  ──►  Zero-shot System One model
    │   │            (Jev, Decision-4B) or few-shot LLM
    │   │
    │   └── YES
    │       │
    │       ├── Is the task / label set stable over time?
    │       │   │
    │       │   ├── NO  ──►  Hybrid: fine-tuned for stable classes
    │       │   │            + zero-shot for new or uncertain cases
    │       │   │
    │       │   └── YES
    │       │       │
    │       │       ├── Enough data to fine-tune? (~1k+ per class)
    │       │       │   │
    │       │       │   ├── NO  ──►  Zero-shot System One model
    │       │       │   │
    │       │       │   └── YES
    │       │       │       │
    │       │       │       ├── Is max accuracy the top priority?
    │       │       │       │   │
    │       │       │       │   ├── YES  ──►  Fine-tuned classifier
    │       │       │       │   │            (BERT, GBM, logistic regression)
    │       │       │       │   │
    │       │       │       │   └── NO
    │       │       │       │       │
    │       │       │       │       ├── Latency <100ms or cost critical?
    │       │       │       │       │   │
    │       │       │       │       │   ├── YES  ──►  System One / small classifier
    │       │       │       │       │   │
    │       │       │       │       │   └── NO
    │       │       │       │       │       │
    │       │       │       │       │       └── Type-safe, calibrated output?
    │       │       │       │       │           │
    │       │       │       │       │           ├── YES  ──►  System One model
    │       │       │       │       │           │
    │       │       │       │       │           └── NO   ──►  Fine-tuned model or LLM


THEN, FOR EVERY PATH:

  High-stakes decision? (medical, legal, financial, safety)
    YES  ──►  Human-in-the-loop + monitor calibration
    NO   ──►  Automate with monitoring
```

---

## The Quick Reference

| Condition | Recommended approach | Why |
|---|---|---|
| Open-ended text output | Generative LLM | Structured models can’t write paragraphs |
| Structured decision, no labels | Zero-shot System One / few-shot LLM | No training data required |
| Labels exist, task stable, enough data | Fine-tuned classifier | Highest accuracy for fixed task |
| Labels exist, task drifts or new categories appear | Hybrid: fine-tuned + zero-shot | Stable classes get accuracy; new classes get flexibility |
| Labels scarce (<1k/class) | Zero-shot System One / few-shot LLM | Fine-tuning overfits |
| Latency <100ms or cost/decision critical | System One / small classifier | Single forward pass, no text generation |
| Type-safe, calibrated output required | System One model | Output schema is guaranteed |
| Explainability required | Decision tree / logistic regression / rules | Interpretable by design |
| High-stakes decision | Hybrid + human-in-the-loop | Accuracy + safety |
| Rapidly changing policy | Zero-shot + human review | Redefine categories without retraining |

---

## Read These Before You Use This

I almost published this cheat sheet without the caveats. That would have been irresponsible. Here are the four themes that matter most — everything else is a detail.

**1. On accuracy — zero-shot is not magic.**  
Fine-tuned models typically beat zero-shot models when you have enough labeled data and a stable task. The 200x speed claim is real; the 7-point F1 gap is also real. Don’t let the first number blind you to the second.

**2. On trust — type safety is not correctness.**  
A guaranteed output schema does not guarantee the answer is *right*. It guarantees the answer is *well-formed*. Calibration can also degrade: a `0.9` from a zero-shot model may not mean 90% correct on your domain. Validate on your data before you trust the number.

**3. On stakes — never fully automate without review.**  
Medical, legal, financial, and safety decisions require a human-in-the-loop. Period. Monitor drift continuously: the spam example above is a warning. Fine-tuned models can degrade silently as the world moves on.

**4. On method — start with the baseline.**  
A logistic regression on embeddings is cheap and sets a floor. Don’t reach for the fanciest tool first. Benchmark on your data — public benchmarks are directional. Your distribution is what matters. Hybrid is often best: route high-confidence cases to automation, send low-confidence or novel cases to zero-shot or humans. And document the decision: task, data, constraints, chosen approach, fallback, owner, review date. Future-you will thank present-you.

---

## The Gut-Check

Stop reading. Open your codebase. Search for `openai.chat.completions.create` or `anthropic.messages.create` or whatever your team uses. Count how many of those calls are making a **decision** — routing, classifying, tagging, scoring — rather than generating text.

If that number is greater than zero, you have a decision layer problem. And you’re paying for it in latency, cost, and silent drift.

---

## The Question That Stays With Me

I still don’t have a tidy resolution. What I have is a new habit: before I write a single line of code, I ask what kind of decision I’m actually making.

Most of the automation I’ve built over the last year didn’t need a text generator. It needed a **decision layer**. Fast. Calibrated. Type-safe. And sometimes — often — a logistic regression I trained myself on 500 examples beats a zero-shot model that can do anything.

The decision tree above isn’t a law. It’s a starting point. A way to ask better questions before you build the wrong thing.

So before you reach for the frontier model, ask yourself the question Priya asked me:

**Does this decision need a paragraph, or a probability?**

If you’ve been here too — if you over-engineered a decision that fit in one word — I’d like to hear about it. What did you build, and what would you build instead?

---
