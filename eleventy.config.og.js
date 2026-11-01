// Generates a 1200x630 social-share card (PNG) per post at build time:
// _site/img/og/<fileSlug>.png. Uses satori (text -> SVG, fonts bundled via
// @fontsource/inter) and sharp (SVG -> PNG), so it needs no system fonts or browser.
// A post can still set `image:` in its front matter to override the card.
const fs = require("node:fs");
const path = require("node:path");

const WIDTH = 1200;
const HEIGHT = 630;

const fontFile = weight => fs.readFileSync(
	require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`)
);

const titleSize = title => (title.length <= 55 ? 72 : title.length <= 90 ? 58 : 48);

const el = (type, style, children) => ({ type, props: { style, children } });

function card({ title, date, logo }) {
	return el("div", {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		width: WIDTH,
		height: HEIGHT,
		boxSizing: "border-box",
		padding: "64px 72px",
		color: "#ffffff",
		fontFamily: "Inter",
		background: "linear-gradient(135deg, #05070d 0%, #0b1a2b 100%)",
		borderLeft: "14px solid #f5a524",
	}, [
		el("div", { display: "flex", alignItems: "center", gap: 20 }, [
			{ type: "img", props: { src: logo, width: 64, height: 64, style: { borderRadius: 12 } } },
			el("div", { display: "flex", fontSize: 32, fontWeight: 700, color: "#7fd3f7" }, "Antinode Labs"),
		]),
		el("div", { display: "flex", width: 1042, fontSize: titleSize(title), fontWeight: 700, lineHeight: 1.15 }, title),
		el("div", { display: "flex", fontSize: 28, color: "#9fb3c8" }, `${date}  |  antinodelabs.com`),
	]);
}

module.exports = function(eleventyConfig) {
	let posts = [];
	eleventyConfig.addCollection("ogPosts", collectionApi => {
		posts = collectionApi.getFilteredByGlob("content/blog/*.md").map(item => ({
			slug: item.fileSlug,
			title: String(item.data.title || "").trim(),
			date: item.date.toISOString().slice(0, 10),
			custom: Boolean(item.data.image),
		}));
		return [];
	});

	eleventyConfig.on("eleventy.after", async ({ dir }) => {
		const targets = posts.filter(p => p.title && !p.custom);
		if(!targets.length) return;

		try {
			const { default: satori } = await import("satori");
			const sharp = require("sharp");
			const fonts = [
				{ name: "Inter", data: fontFile(400), weight: 400, style: "normal" },
				{ name: "Inter", data: fontFile(700), weight: 700, style: "normal" },
			];
			const logoPath = path.join(__dirname, "public", "img", "web-app-manifest-192x192.png");
			const logo = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;

			const outDir = path.join(dir.output, "img", "og");
			fs.mkdirSync(outDir, { recursive: true });

			for(const post of targets) {
				const svg = await satori(card({ ...post, logo }), { width: WIDTH, height: HEIGHT, fonts });
				await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${post.slug}.png`));
			}
			console.log(`[og-images] Wrote ${targets.length} share images`);
		} catch(e) {
			console.warn("[og-images] Share images were not generated:", e.message);
		}
	});
};
