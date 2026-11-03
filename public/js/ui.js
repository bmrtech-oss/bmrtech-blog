(function () {
	"use strict";

	var bar = document.getElementById("reading-progress");
	var toc = document.querySelector(".toc");
	var tocLinks = toc ? Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]')) : [];
	var headings = tocLinks.map(function (a) {
		return document.getElementById(decodeURIComponent(a.hash.slice(1)));
	});
	var ticking = false;

	function update() {
		ticking = false;

		if (bar) {
			var max = document.documentElement.scrollHeight - window.innerHeight;
			var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
			bar.style.transform = "scaleX(" + p + ")";
		}

		if (tocLinks.length) {
			var active = -1;
			for (var i = 0; i < headings.length; i++) {
				if (headings[i] && headings[i].getBoundingClientRect().top <= 120) active = i;
			}
			tocLinks.forEach(function (a, i) {
				a.classList.toggle("is-active", i === active);
			});
		}
	}

	function onScroll() {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(update);
		}
	}

	if (bar || tocLinks.length) {
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		update();
	}

	// The table of contents starts collapsed on small screens
	if (toc && window.matchMedia("(max-width: 700px)").matches) {
		toc.removeAttribute("open");
	}

	function copyText(text) {
		if (navigator.clipboard && window.isSecureContext) {
			return navigator.clipboard.writeText(text);
		}
		return new Promise(function (resolve, reject) {
			var ta = document.createElement("textarea");
			ta.value = text;
			ta.setAttribute("readonly", "");
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			try {
				document.execCommand("copy") ? resolve() : reject();
			} catch (e) {
				reject(e);
			}
			document.body.removeChild(ta);
		});
	}

	document.querySelectorAll("[data-pagefind-body] pre").forEach(function (pre) {
		var wrap = document.createElement("div");
		wrap.className = "code-block";
		pre.parentNode.insertBefore(wrap, pre);
		wrap.appendChild(pre);

		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "code-copy";
		btn.textContent = "Copy";
		btn.setAttribute("aria-label", "Copy code to clipboard");
		wrap.insertBefore(btn, pre);

		btn.addEventListener("click", function () {
			var code = pre.querySelector("code");
			copyText((code || pre).textContent).then(function () {
				btn.textContent = "Copied";
				btn.dataset.state = "copied";
			}, function () {
				btn.textContent = "Press Ctrl+C";
			}).then(function () {
				setTimeout(function () {
					btn.textContent = "Copy";
					delete btn.dataset.state;
				}, 2000);
			});
		});
	});

	document.addEventListener("keydown", function (event) {
		var t = event.target;
		var typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
		if (event.key !== "/" || typing || event.ctrlKey || event.metaKey || event.altKey) return;
		var input = document.getElementById("header-search-input");
		if (input) {
			event.preventDefault();
			input.focus();
		}
	});

	document.querySelectorAll("form.signup-form").forEach(function (form) {
		var status = form.querySelector(".signup-status");
		var button = form.querySelector('button[type="submit"]');

		function show(message, isError) {
			status.textContent = message;
			if (isError) status.dataset.state = "error";
			else delete status.dataset.state;
		}

		form.addEventListener("submit", function (event) {
			event.preventDefault();
			var email = form.elements.email.value.trim();

			// Honeypot: real visitors never fill this hidden field
			if (form.elements.website && form.elements.website.value) {
				show("Thanks! You are on the list.");
				return;
			}

			button.disabled = true;
			show("Subscribing...");
			fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "subscribe", email: email })
			}).then(function (res) {
				return res.json().then(function (data) {
					if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
					show(data.message || "Thanks! You are on the list.");
					form.reset();
				});
			}).catch(function (err) {
				show(err.message, true);
			}).then(function () {
				button.disabled = false;
			});
		});
	});
})();
