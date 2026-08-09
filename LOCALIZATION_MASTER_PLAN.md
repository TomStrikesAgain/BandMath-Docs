# Localization Master Plan (App + Knowledge Base)

This master plan outlines the end-to-end strategy for localizing both the BandMath Flutter application and the Docusaurus Knowledge Base into 5 languages, utilizing Gemini AI for translation.

## 1. Scope & Target Languages

*   **Base Language:** English (`en`)
*   **Target Languages:** French (`fr`), German (`de`), Spanish (`es`), Polish (`pl`)
*   **Translation Engine:** Internal Gemini AI automation

---

## 2. Subagent Execution Strategy

To keep the primary workspace context clean and ensure high-quality execution, every phase of this project will follow a dual-agent structure:
*   **Executor Agent:** A subagent spun up strictly to implement the codebase changes (e.g., refactoring Flutter code, running Python AI translation scripts).
*   **Reviewer Agent:** A separate subagent tasked with verifying the executor's work (e.g., checking for syntax errors, running tests, ensuring the layout didn't break).

The primary agent (me) will orchestrate these subagents, review their final reports, and keep you updated on the high-level progress.

---

## 3. Phase 1: App Localization (Flutter)

1.  **Framework Setup:** Enable `flutter_localizations` in `pubspec.yaml` and configure the `MaterialApp` to support the 5 target locales.
2.  **Pseudo-Localization (Enterprise Standard):** Before real translations begin, generate an `en-XA` pseudo-locale (e.g., `[Šéttîñĝš ℓôřè₥ !!!]`). Run the app with this locale to easily spot hardcoded English strings we missed and visually identify layout overflows caused by inflated string lengths.
3.  **ARB File Generation:** Extract all English text from the UI into a master `app_en.arb` file (Application Resource Bundle). 
    *   **ICU Enforcement:** Ensure all variables and plurals strictly follow the ICU Message Format (e.g., `{count, plural, =0{No items} =1{1 item} other{{count} items}}`).
4.  **UI Refactoring:** Replace hardcoded strings like `Text("Add Expense")` with the localization variable `Text(AppLocalizations.of(context)!.addExpense)` throughout the `lib/` directory.
5.  **AI Translation Script:** Create a Python script utilizing the Gemini API to automatically parse `app_en.arb`, translate the key-value pairs contextually, and output the 4 new `.arb` files for the target languages.

---

## 4. Phase 2: Localized Screenshots (Testing Infrastructure)

*Note: We will evaluate transitioning from full Integration Tests to Flutter Golden Tests to speed up execution and avoid CI timeouts.*

1.  **Locale Injection (`run_super_e2e.sh`):** Modify the shell script to pass the current loop's locale as an environment variable using `--dart-define=TEST_LOCALE=[locale]`.
2.  **Naming Convention (`test_helpers.dart`):** Update `takeScreenshot(IntegrationTestWidgetsFlutterBinding binding, WidgetTester tester, String name)` to read the `TEST_LOCALE` environment variable and prepend it to the screenshot file names.
3.  **Iterative Test Execution:** Modify `run_super_e2e.sh` to loop the test suite 5 times.
4.  **Database Reset per Loop:** The shell script must trigger the backend database reset at the start of *every* loop iteration to ensure a clean state, otherwise the second language run will fail due to duplicate data.
5.  **Screenshot Protection:** Update `run_super_e2e.sh` so it doesn't accidentally run `rm -f .../screenshots/financials/*.png` and wipe out the previous language's screenshots between loops. The script must organize images into localized folders.

---

## 5. Phase 3: Knowledge Base Localization (Docusaurus)

1.  **Docusaurus Configuration:** 
    *   Update `docusaurus.config.js` to register the 4 new locales in the `i18n` array and add a `localeDropdown` language switcher to the navbar.
    *   **Crucial:** Update `@easyops-cn/docusaurus-search-local` config to include the `language: ["en", "fr", "de", "es", "pl"]` array, otherwise local search will completely break for non-English users.
2.  **Theme Translations:** Run `npm run write-translations` to extract built-in theme strings for translation.
3.  **Folder Structure Setup:** Scaffold the required directory structure: `i18n/[locale]/docusaurus-plugin-content-docs/current/`.
4.  **AST-Based AI Translation (Enterprise Standard):** To prevent AI from breaking markdown syntax, links, and MDX components:
    *   The Python translation script will use an Abstract Syntax Tree (AST) parser to programmatically separate text nodes from the markdown structure.
    *   Only the text nodes will be sent to Gemini for translation.
    *   The script will reconstruct the markdown file using the translated text nodes, guaranteeing that URLs, JSX, and code blocks remain 100% intact.
    *   The script will perform a targeted swap of image URLs to point to the localized screenshots.
    *   Write the finalized file into the respective `i18n/[locale]/` directory, strictly maintaining identical base filenames.

---

## 6. Risk Assessment

Before we execute, here are the critical risks that could break our infrastructure during this transition:

> [!WARNING]
> **Phase 1 Risks (Flutter App)**
> *   **Variable Interpolation:** Hardcoded strings with dynamic variables (e.g. `Text("Welcome back, $userName")`) can be tricky to translate because different languages structure sentences differently. We must ensure the ARB variables allow positional arguments.
> *   **Missed Strings:** It's highly likely a few obscure error messages or backend strings will be missed during the UI refactor, causing a mix of English and translated text in the final app.

> [!WARNING]
> **Phase 2 Risks (Automated Screenshots)**
> *   **RenderFlex Overflows:** Languages like German often have words that are 30-50% longer than English. When we force the app into German to take screenshots, buttons and text fields might overflow their bounds (`RenderFlex overflowed by X pixels`), causing the automated screenshot tests to crash.
> *   **Performance Timeouts:** Running the entire `super_e2e_test.dart` suite 5 times in a row could trigger CI pipeline timeouts.

> [!CAUTION]
> **Phase 3 Risks (Docusaurus Knowledge Base)**
> *   **Broken Internal Links:** If the AI translates the URL paths inside `[link](url.md)` tags, clicking a link in the translated documentation will lead to a 404 page. Docusaurus expects file names and internal paths to remain identical to the English base.
