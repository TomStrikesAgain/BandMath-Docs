# AI Agent Guidelines for BandMath-Docs

When assisting with this Docusaurus knowledge base project, ALWAYS adhere to the following rules based on our established workflow to prevent build errors and ensure consistency.

## 1. Docusaurus Admonitions Syntax
Do NOT use GitHub-flavored Markdown alerts (e.g. `> [!NOTE]`). Docusaurus does not support them natively.
Instead, you must use Docusaurus Admonition syntax:
```markdown
:::note
Your note text here.
:::
```
Supported types: `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`.

## 2. Image Link Validation
Docusaurus strictly validates all internal image paths during the build process. 
- If you add a Markdown image link (e.g. `![Placeholder](./assets/my-image.png)`), the physical image file **MUST** exist at that path before you run the build.
- If you need a temporary placeholder to test the build, you should copy an existing image from the `assets` folder and rename it, rather than leaving the link broken.

## 3. Mandatory Build Verification
Before committing ANY changes to the repository, you must always run `npm run build` locally. This ensures that no broken links, missing images, or malformed MDX files are pushed to production. 
If the build fails, fix the errors and rebuild before proceeding.

## 4. Deployment
The site is automatically built and deployed via GitHub Actions whenever changes are pushed to the `main` branch. No manual deployment commands are necessary.
