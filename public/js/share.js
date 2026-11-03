(function () {
	var box = document.querySelector(".share");
	if (!box) return;
	var url = box.dataset.shareUrl;
	var title = box.dataset.shareTitle;
	var copy = box.querySelector(".share-copy");
	var native = box.querySelector(".share-native");

	copy.addEventListener("click", function () {
		var done = function () {
			copy.textContent = "Copied!";
			setTimeout(function () { copy.textContent = "Copy link"; }, 2000);
		};
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(done, function () { window.prompt("Copy this link:", url); });
		} else {
			window.prompt("Copy this link:", url);
		}
	});

	if (navigator.share) {
		native.hidden = false;
		native.addEventListener("click", function () {
			navigator.share({ title: title, url: url }).catch(function () {});
		});
	}
})();
