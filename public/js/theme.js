(function () {
	var KEY = "theme";
	var THEMES = ["light", "dark", "solarized"];
	var root = document.documentElement;

	function stored() {
		try {
			var v = localStorage.getItem(KEY);
			return THEMES.indexOf(v) !== -1 ? v : null;
		} catch (e) {
			return null;
		}
	}

	function systemTheme() {
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	function apply(theme) {
		root.setAttribute("data-theme", theme);
	}

	// Runs in <head> before first paint to avoid a flash of the wrong theme.
	apply(stored() || systemTheme());

	document.addEventListener("DOMContentLoaded", function () {
		var btn = document.getElementById("theme-toggle");
		if (!btn) return;

		function label() {
			var current = root.getAttribute("data-theme");
			var next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
			btn.setAttribute("aria-label", "Theme: " + current + ". Switch to " + next);
			btn.title = "Theme: " + current + " (click for " + next + ")";
		}

		label();
		btn.addEventListener("click", function () {
			var current = root.getAttribute("data-theme");
			var next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
			apply(next);
			try { localStorage.setItem(KEY, next); } catch (e) {}
			label();
		});
	});
})();