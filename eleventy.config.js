require('dotenv').config();
const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");
//const markdownIt = require("markdown-it");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css"
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// Add table support
	// const md = markdownIt({ html: true });
  // eleventyConfig.setLibrary("md", md);

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// One entry per tag slug, so tags differing only by case/punctuation
	// (e.g. "AI coding" and "AI Coding") share a single tag page.
	eleventyConfig.addCollection("tagPages", collectionApi => {
		const slugify = eleventyConfig.getFilter("slugify");
		const ignored = ["all", "nav", "post", "posts"];
		const bySlug = new Map();
		for(let item of collectionApi.getAll()) {
			for(let tag of (item.data.tags || [])) {
				if(ignored.includes(tag)) continue;
				const slug = slugify(tag);
				if(!bySlug.has(slug)) {
					bySlug.set(slug, { slug, title: tag, items: new Set() });
				}
				bySlug.get(slug).items.add(item);
			}
		}
		return Array.from(bySlug.values())
			.map(({ slug, title, items }) => ({ slug, title, items: Array.from(items) }))
			.sort((a, b) => a.slug.localeCompare(b.slug));
	});

	// Estimated reading time in minutes for rendered post HTML
	eleventyConfig.addFilter("readingTime", html => {
		const words = String(html || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.round(words / 220));
	});

	// Posts sharing the most tags with the current page (newest first on ties)
	eleventyConfig.addFilter("relatedPosts", (posts, page, tags, limit = 3) => {
		const ignored = ["all", "nav", "post", "posts"];
		const mine = new Set((tags || []).filter(t => !ignored.includes(t)).map(t => t.toLowerCase()));
		return (posts || [])
			.filter(p => p.url !== page.url)
			.map(p => ({
				post: p,
				score: (p.data.tags || []).filter(t => mine.has(String(t).toLowerCase())).length
			}))
			.filter(x => x.score > 0)
			.sort((a, b) => b.score - a.score || b.post.date - a.post.date)
			.slice(0, limit)
			.map(x => x.post);
	});

	// Build the Pagefind search index after each build (full builds only, not --serve incrementals)
	eleventyConfig.on("eleventy.after", ({ dir, runMode }) => {
		const result = spawnSync(
			process.execPath,
			[path.join(__dirname, "node_modules", "pagefind", "lib", "runner", "bin.cjs"), "--site", dir.output, "--quiet"],
			{ stdio: "inherit" }
		);
		if(result.status !== 0) {
			console.warn("[pagefind] Search index was not built.");
		}
	});

	// Table of contents from h2/h3 headings that already have anchor ids
	eleventyConfig.addFilter("toc", html => {
		const items = [];
		const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
		let m;
		while((m = re.exec(String(html || "")))) {
			const text = m[3]
				.replace(/<a class="header-anchor"[\s\S]*?<\/a>/, "")
				.replace(/<[^>]*>/g, "")
				.trim();
			if(text) items.push({ level: Number(m[1]), id: m[2], text });
		}
		return items;
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
