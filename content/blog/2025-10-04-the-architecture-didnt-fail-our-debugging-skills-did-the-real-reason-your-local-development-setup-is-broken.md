---
title: The Architecture Didn't Fail. Our Debugging Skills Did. The Real Reason
  Your Local Development Setup Is Broken
description: "Is your docker-compose up failing? The problem isn't your
  microservices or monolith—it's a critical gap in your team's debugging skills.
  "
date: 2025-10-04
draft: false
---
\---

Let me tell you a story that’s probably unfolding in a tech company near you.

A team inherits a complex system. The backend is a constellation of REST API microservices. The frontend is a collection of micro-frontends, bundled with Webpack and orchestrated to work together. It’s a modern, scalable architecture designed for independent teams and rapid growth.

Then, a regime change. New leadership arrives, and with them, a new engineering team. The old guard is gone, and the new team is handed the keys—the source code, the documentation, the "Knowledge Transfer" (KT) sessions.

But when they try to run the projects locally, nothing works. The `docker-compose up` command throws cryptic errors. One service can’t find another. The React micro-frontend fails to resolve a shared dependency. The logs are a wall of red.

Frustration sets in. Days turn into a week. The local development environment remains a brick.

The narrative quickly solidifies: "This micro-architecture is too complex. It's over-engineered. We can't even get it running!" The new leadership, eager to make their mark, seizes this narrative. The verdict is swift: **Dismantle the microservices and micro-frontends. We're going back to a monolith.**

And so, the great migration begins. Months of effort are invested in merging codebases, untangling deployment pipelines, and creating a single, unified repository.

But then, a hauntingly familiar problem resurfaces. Even in the new, shiny monolith, engineers are... _still_ struggling to set up the project completely.

It brings to mind the famous words of **Edsger W. Dijkstra**: _"If debugging is the process of removing bugs, then programming must be the process of putting them in."_ The original bugs in the process weren't removed; they were just relocated and repackaged.

What happened?

\#### **The Real Culprit: A Debugging Deficit**

We blamed the architecture, but the architecture was just a scapegoat. The real failure was a critical gap in a fundamental engineering skill: **systematic debugging.**

The initial problem wasn't that the microservices were inherently "bad." The problem was that the team lacked the methodology to diagnose _why_ the setup was failing. They saw a cascade of errors and concluded the system was broken, rather than seeing a series of puzzles to be solved.

This is a classic case of what **John Gall** wittily observed in his _Systemantics_: _"A complex system that works is invariably found to have evolved from a simple system that worked. ... A complex system designed from scratch never works and cannot be patched up to make it work. You have to start over, beginning with a simple working system."_

The old team had evolved a working complex system. The new team tried to run the final, complex result without understanding the simple steps that made it work.

Let's break down what effective debugging would have looked like in that initial scenario:

1\. **Isolate the Problem:** Instead of running `docker-compose up` and giving up at the first wall of red, the first step is to run services one by one. Can Service A start in isolation? If not, the problem is likely within that service's configuration or dependencies, not the architecture itself.

2\. **Check the Prerequisites:** Were all the necessary dependencies installed? Was the correct Node.js or Java version being used? Were environment variables properly set? A `./scripts/setup.sh` script might have failed silently, leaving a crucial tool uninstalled.

3\. **Follow the Traffic:** If Service A starts but can't connect to Service B, the next step is to diagnose the network. Can you ping Service B's container? Is the port mapping correct in the Docker configuration? Is there a firewall rule blocking the communication? Tools like `curl`, `telnet`, or even your browser, are your best friends here.

4\. **Read the Logs, Don't Just See Them:** An error message is a clue, not a conclusion. "Connection refused" is a starting point. It tells you _where_ to look next—the network, the service health, the configuration. The team saw noise; a skilled debugger sees signal.

5\. **Divide and Conquer:** The micro-frontend failing? Don't try to run the entire host app. Run the standalone micro-frontend first. Does its Webpack dev server start? If not, the issue is in that specific project's build configuration, not the micro-frontend framework.

This methodical approach is what separates good engineers from great ones. As the legendary **Brian Kernighan** put it: _"The most effective debugging tool is still careful thought, coupled with judiciously placed print statements."_ The team had the tools; what was missing was the "careful thought" to wield them effectively.

\#### **The Monolith is a Red Herring**

The decision to move to a monolith was a strategic misdirection. It didn't address the root cause; it merely simplified the _symptoms_ by reducing the number of moving parts. It traded one set of problems (orchestrating distributed systems) for another (tight coupling, deployment bottlenecks, and tangled code).

The tragedy is that the core skill gap remained. When the next critical bug appears in production, the team will be just as stuck. They solved the wrong problem.

This reminds me of a brilliant insight from **Andrew Hunt and David Thomas in _The Pragmatic Programmer_**: _"Don't live with broken windows. Fix bad designs, wrong decisions, and poor code when you see them."_ The team saw a broken window (the failed setup) and instead of fixing the pane, they condemned the entire building and built a new one with the same faulty blueprint.

\#### **Cultivating a Culture of Debugging**

This story isn't about blaming the new engineers. It's about a failure of engineering culture. We often prioritize shipping features over cultivating foundational skills. We must change that.

Here’s how:

\* **Formalize Debugging Training:** Don't assume everyone knows how to do it. Run workshops on using debugging tools, reading stack traces, and systematic problem isolation.

\* **Celebrate the "Fix":** When an engineer spends a day untangling a gnarly setup issue, celebrate that win. It's as valuable as shipping a new feature.

\* **Document the "Why":** Good documentation doesn't just list commands; it explains the system's moving parts. An architecture diagram that shows how services connect is a debugging map.

\* **Empower with Tools:** Invest in robust, well-documented local development environments. But more importantly, teach everyone how to maintain and fix them.

**Conclusion**

**Leslie Lamport** once said, _"A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable."_ The new team experienced this firsthand. But the solution wasn't to eliminate distribution; it was to learn how to discover that "computer you didn't know existed."

Architectural decisions should be driven by scalability, team velocity, and business needs—not by a team's current comfort zone. Throwing away a scalable architecture because of a temporary skills gap is an expensive and ultimately futile solution.

The most powerful tool in your tech stack isn't the latest framework or the trendiest architecture. It's the collective ability of your engineers to open the hood, diagnose the problem, and fix what's broken. Before you dismantle your system, ask yourself: are you solving an architectural problem, or are you masking a skills deficit?

Invest in debugging. It’s the skill that builds all others.