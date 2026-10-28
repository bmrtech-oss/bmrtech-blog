(function () {
	document.addEventListener("DOMContentLoaded", function () {
		if (!navigator.clipboard) return;
		document.querySelectorAll("main pre").forEach(function (pre) {
			var btn = document.createElement("button");
			btn.type = "button";
			btn.className = "copy-code";
			btn.textContent = "Copy";
			btn.setAttribute("aria-label", "Copy code to clipboard");
			btn.addEventListener("click", function () {
				var code = pre.querySelector("code") || pre;
				navigator.clipboard.writeText(code.innerText).then(function () {
					btn.textContent = "Copied";
					setTimeout(function () { btn.textContent = "Copy"; }, 1500);
				}, function () {
					btn.textContent = "Failed";
					setTimeout(function () { btn.textContent = "Copy"; }, 1500);
				});
			});
			var wrap = document.createElement("div");
			wrap.className = "code-block";
			pre.parentNode.insertBefore(wrap, pre);
			wrap.appendChild(pre);
			wrap.appendChild(btn);
		});
	});
})();
