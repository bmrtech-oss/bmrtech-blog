(function () {
	"use strict";

	var input = document.getElementById("header-search-input");
	if (!input) return;

	var pagefind = null;
	var pagefindFailed = false;
	var dialog = null;
	var qEl, listEl, tagsEl, statusEl;
	var activeTag = "";
	var searchId = 0;
	var timer = null;
	var lastFocus = null;

	function esc(s) {
		return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
		});
	}

	function loadPagefind() {
		if (pagefind || pagefindFailed) return Promise.resolve(pagefind);
		return import("/pagefind/pagefind.js").then(function (pf) {
			pagefind = pf;
			return pf;
		}).catch(function () {
			pagefindFailed = true;
			return null;
		});
	}

	function build() {
		dialog = document.createElement("dialog");
		dialog.className = "search-dialog";
		dialog.setAttribute("aria-label", "Search posts");
		dialog.innerHTML =
			'<div class="search-panel">' +
			'<div class="search-bar">' +
			'<input class="search-q" type="search" placeholder="Search posts&hellip;" autocomplete="off" aria-label="Search posts">' +
			'<button type="button" class="search-close" aria-label="Close search">Esc</button>' +
			'</div>' +
			'<div class="search-tags" role="group" aria-label="Filter by topic"></div>' +
			'<p class="search-status" aria-live="polite"></p>' +
			'<ul class="search-results"></ul>' +
			'</div>';
		document.body.appendChild(dialog);
		qEl = dialog.querySelector(".search-q");
		listEl = dialog.querySelector(".search-results");
		tagsEl = dialog.querySelector(".search-tags");
		statusEl = dialog.querySelector(".search-status");

		dialog.addEventListener("click", function (e) {
			if (e.target === dialog) close();
		});
		dialog.addEventListener("close", function () {
			document.documentElement.classList.remove("search-open");
			if (lastFocus && lastFocus.focus) lastFocus.focus();
		});
		dialog.querySelector(".search-close").addEventListener("click", close);

		qEl.addEventListener("input", function () {
			clearTimeout(timer);
			timer = setTimeout(run, 120);
		});
		qEl.addEventListener("keydown", function (e) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				moveSelection(1);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				moveSelection(-1);
			} else if (e.key === "Enter") {
				var sel = listEl.querySelector("a.is-selected") || listEl.querySelector("a");
				if (sel) {
					e.preventDefault();
					location.href = sel.href;
				}
			}
		});
		tagsEl.addEventListener("click", function (e) {
			var b = e.target.closest("button[data-tag]");
			if (!b) return;
			activeTag = activeTag === b.dataset.tag ? "" : b.dataset.tag;
			renderTags(currentTags);
			run();
		});
	}

	function moveSelection(dir) {
		var links = Array.prototype.slice.call(listEl.querySelectorAll("a"));
		if (!links.length) return;
		var i = links.findIndex(function (a) { return a.classList.contains("is-selected"); });
		if (i >= 0) links[i].classList.remove("is-selected");
		i = (i + dir + links.length) % links.length;
		links[i].classList.add("is-selected");
		links[i].scrollIntoView({ block: "nearest" });
	}

	var currentTags = [];
	function renderTags(tags) {
		currentTags = tags;
		tagsEl.innerHTML = tags.map(function (t) {
			return '<button type="button" class="tag-pill search-tag' + (t === activeTag ? " is-active" : "") +
				'" data-tag="' + esc(t) + '" aria-pressed="' + (t === activeTag) + '">' + esc(t) + "</button>";
		}).join("");
	}

	function fmtDate(d) {
		if (!d) return "";
		var dt = new Date(d + "T00:00:00");
		return isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
	}

	function card(data) {
		var tags = (data.filters && data.filters.tag) || [];
		var date = fmtDate(data.meta && data.meta.date);
		return '<li class="search-result"><a href="' + esc(data.url) + '">' +
			(date ? '<span class="search-result-date">' + esc(date) + "</span>" : "") +
			'<span class="search-result-title">' + esc((data.meta && data.meta.title) || data.url) + "</span>" +
			'<span class="search-result-excerpt">' + data.excerpt + "</span>" +
			(tags.length ? '<span class="search-result-tags">' + tags.slice(0, 3).map(function (t) {
				return '<span class="tag-pill">' + esc(t) + "</span>";
			}).join("") + "</span>" : "") +
			"</a></li>";
	}

	function showAllTagsAsSuggestions() {
		return pagefind.filters().then(function (f) {
			var counts = f.tag || {};
			return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
		}).catch(function () { return []; });
	}

	function run() {
		var id = ++searchId;
		var q = qEl.value.trim();
		loadPagefind().then(function (pf) {
			if (id !== searchId) return;
			if (!pf) {
				statusEl.textContent = "Search is not available right now.";
				listEl.innerHTML = "";
				return;
			}
			if (!q && !activeTag) {
				listEl.innerHTML = "";
				statusEl.textContent = "Type to search, or pick a topic.";
				showAllTagsAsSuggestions().then(function (tags) { if (id === searchId) renderTags(tags.slice(0, 12)); });
				return;
			}
			var opts = activeTag ? { filters: { tag: activeTag } } : {};
			var p = q ? pf.search(q, opts) : pf.search(null, opts);
			p.then(function (res) {
				if (id !== searchId) return;
				return Promise.all(res.results.slice(0, 8).map(function (r) { return r.data(); })).then(function (items) {
					if (id !== searchId) return;
					listEl.innerHTML = items.map(card).join("");
					var first = listEl.querySelector("a");
					if (first) first.classList.add("is-selected");
					var n = res.results.length;
					statusEl.textContent = n
						? n + " result" + (n === 1 ? "" : "s") + (n > 8 ? " (showing 8)" : "")
						: "No posts match" + (q ? " \u201c" + q + "\u201d" : "") + ". Try a different word or pick a topic.";
					if (!n) showAllTagsAsSuggestions().then(function (tags) { if (id === searchId) renderTags(tags.slice(0, 12)); });
				});
			});
		});
	}

	function open(prefill) {
		if (!dialog) build();
		if (dialog.open) return;
		lastFocus = document.activeElement === input ? null : document.activeElement;
		document.documentElement.classList.add("search-open");
		dialog.showModal();
		if (typeof prefill === "string") qEl.value = prefill;
		qEl.focus();
		qEl.select();
		run();
	}

	function close() {
		if (dialog && dialog.open) dialog.close();
	}

	if (typeof HTMLDialogElement === "undefined") return;

	// The header box becomes a trigger; without JS the form still goes to /search/
	input.addEventListener("focus", function () {
		var v = input.value;
		input.value = "";
		input.blur();
		open(v);
	});
	input.form.addEventListener("submit", function (e) {
		e.preventDefault();
		open(input.value);
	});

	document.addEventListener("keydown", function (e) {
		var isShortcut = (e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey);
		if (isShortcut) {
			e.preventDefault();
			open();
			return;
		}
		var t = e.target;
		var typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
		if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			open();
		}
	}, true);

	// Warm the index on first intent
	input.addEventListener("pointerenter", loadPagefind, { once: true });
})();
