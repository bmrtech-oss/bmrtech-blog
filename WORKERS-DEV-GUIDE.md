# Cloudflare Pages Functions: Build, Run, and Test Guide

This guide provides step-by-step commands to build, run, and test your Cloudflare Pages Functions in this project.

## 1. Install Dependencies

```bash
npm install
```

## 2. Build the Project

This will build the static site and bundle your Cloudflare functions:

```bash
npm run build:cloudflare
```

- This runs Eleventy and builds your functions.
- The output worker bundle will be at `_worker.bundle` in the project root.

## 3. Run Locally (Development)

To start a local development server with your static site and functions:

```bash
npm run dev:full
npm run build:cloudflare && npx wrangler pages publish _site --project-name=bmrtech-blog
```

- This will build everything and start the local Cloudflare Pages dev server.
- Your functions will be served using the generated `_worker.bundle`.

## 4. Test Functions

You can test your API endpoints and functions locally using tools like `curl`, Postman, or your browser. Example:

```bash
curl http://localhost:8788/api/subscribe
```

Or use the provided test scripts:

```bash
npm run test:api
npm run test:db
```

## 5. Deploy to Cloudflare Pages

To deploy your site and functions to Cloudflare:

```bash
npm run deploy
```

- This will publish your static site and the `_worker.bundle` to Cloudflare Pages.

## 6. Additional Commands

- **Database backup:**
  ```bash
  npm run db:backup
  ```
- **Wrangler login:**
  ```bash
  npm run wrangler:login
  ```

---

For more details, see the `package.json` scripts and Cloudflare Pages documentation.
