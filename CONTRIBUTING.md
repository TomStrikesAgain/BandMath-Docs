# BandMath Knowledge Base Workflow

Welcome to the BandMath documentation repository! This site is built with [Docusaurus](https://docusaurus.io/). To ensure a smooth editing and deployment process, please follow the established workflow below.

## 1. Local Development & Building
Before pushing any changes to GitHub, you should verify them locally:
- **Run the local server:** `npm run start` (Starts a live-reloading dev server)
- **Verify the build:** `npm run build` 
  - **Crucial:** Always run a full build before committing! Docusaurus has strict validation. It will catch broken internal links, malformed markdown, and missing image files.

## 2. Working with Images
Docusaurus strictly checks all local image links. If you add an image link to a markdown file (e.g., `![My Image](./assets/my-image.png)`), that file **must physically exist** in the `assets` folder before you build or commit. 
- If you need to drop an image link as a placeholder for someone else to fill in later, make a copy of an existing image and rename it to your target filename so the build doesn't crash.

## 3. Callouts & Admonitions
Do not use standard GitHub alerts (like `> [!NOTE]`). Docusaurus does not natively support rendering these nicely. Instead, use the built-in [Docusaurus Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) syntax:

```markdown
:::note
This is a standard note.
:::

:::tip
This is a helpful tip.
:::

:::danger
This is a critical warning.
:::
```

## 4. Sidebar Organization
We control the order of the sidebar menu explicitly.
- **Directories:** Use a `_category_.json` file inside a directory to control its name and position.
- **Files:** Use frontmatter at the top of a `.md` file to force its position (e.g., `sidebar_position: 1`).

## 5. Deployment
We use a continuous deployment setup. Any changes committed and pushed to the `main` branch will automatically trigger a GitHub Action that builds the site and deploys it to our live domain. There is no need to run manual deploy commands.
