// Sanity checks on the built site (run after `npm run build`).
// Fails the process if any published page has a basic SEO, accessibility or
// mobile-readability problem.
const fs = require("node:fs");
const path = require("node:path");

const siteDir = path.join(__dirname, "..", "_site");
// Posts from this date on must keep ASCII diagrams in plain ASCII, because
// box-drawing glyphs fall back to different-width fonts on phones.
const ASCII_ONLY_FROM = "2026-10-28";
const NON_ASCII_DIAGRAM_CHARS = /[\u2500-\u257F\u2580-\u259F\u2190-\u21FF\u2713\u2717]/;

const problems = [];
const report = (file, msg) => problems.push(`${path.relative(siteDir, file)}: ${msg}`);

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
	});
}

if (!fs.existsSync(siteDir)) {
	console.error("_site not found. Run `npm run build` first.");
	process.exit(1);
}

const pages = walk(siteDir).filter(f => !f.includes(`${path.sep}pagefind${path.sep}`));
for (const file of pages) {
	const html = fs.readFileSync(file, "utf8");
	if (/http-equiv="refresh"/i.test(html)) continue;

	if (!/<title>[^<]+<\/title>/.test(html)) report(file, "missing <title>");
	if (!/<meta name="description" content="[^"]+"/.test(html)) report(file, "missing meta description");
	if (!/<link rel="canonical" href="https:\/\//.test(html)) report(file, "missing canonical link");
	if (!/<html lang="/.test(html)) report(file, "missing html lang");
	if ((html.match(/<h1[\s>]/g) || []).length !== 1 && !file.endsWith("404.html")) report(file, "expected exactly one <h1>");
	for (const img of html.match(/<img\b[^>]*>/g) || []) {
		if (!/\balt=/.test(img)) report(file, `image without alt: ${img.slice(0, 80)}`);
	}

	const post = file.match(/blog[\\/](\d{4}-\d{2}-\d{2})-/);
	if (post && post[1] >= ASCII_ONLY_FROM) {
		for (const pre of html.match(/<pre[\s\S]*?<\/pre>/g) || []) {
			if (NON_ASCII_DIAGRAM_CHARS.test(pre)) report(file, "diagram uses non-ASCII box/symbol characters");
		}
	}
}

if (problems.length) {
	console.error(`${problems.length} problem(s) found:\n- ${problems.join("\n- ")}`);
	process.exit(1);
}
console.log(`Checked ${pages.length} pages: OK`);
