// Manual helper: fixes common heading problems in post sources.
//   npm run fix            apply fixes to content/blog/*.md
//   npm run fix -- --dry   show what would change without writing
// Fixes: empty "#" headings are removed, and body "# Title" headings become
// "## Title" (the layout already renders the post title as the page <h1>).
// Lines inside code fences and front matter are never touched.
const fs = require("node:fs");
const path = require("node:path");

const dry = process.argv.includes("--dry");
const dir = path.join(__dirname, "..", "content", "blog");
let changed = 0;

for (const name of fs.readdirSync(dir).filter(f => f.endsWith(".md"))) {
	const file = path.join(dir, name);
	const original = fs.readFileSync(file, "utf8");
	const eol = original.includes("\r\n") ? "\r\n" : "\n";
	const lines = original.split(/\r?\n/);
	const notes = [];
	const out = [];
	let fence = null;
	let frontMatter = lines[0] === "---";

	lines.forEach((line, i) => {
		if (frontMatter) {
			if (i > 0 && line === "---") frontMatter = false;
			out.push(line);
			return;
		}
		const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
		if (fenceMatch) {
			if (!fence) fence = fenceMatch[1][0];
			else if (fenceMatch[1][0] === fence) fence = null;
			out.push(line);
			return;
		}
		if (!fence) {
			if (/^#\s*$/.test(line)) {
				notes.push(`line ${i + 1}: removed empty heading`);
				return;
			}
			if (/^#\s+\S/.test(line)) {
				notes.push(`line ${i + 1}: "${line}" -> "#${line}"`);
				out.push("#" + line);
				return;
			}
		}
		out.push(line);
	});

	if (notes.length) {
		changed++;
		console.log(`${name}\n  ${notes.join("\n  ")}`);
		if (!dry) fs.writeFileSync(file, out.join(eol));
	}
}

console.log(changed ? `${dry ? "Would fix" : "Fixed"} ${changed} post(s).` : "Nothing to fix.");
