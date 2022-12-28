# playwright-codegen-lite

A lightweight version of [Playwright's codegen](https://playwright.dev/docs/cli/#record-a-script) that only runs in the CLI, doesn't highlight, and uses the external Playwright APIs.

https://user-images.githubusercontent.com/54008264/209814311-f71099ea-c8cc-4319-b382-838c8c84ac76.mov

## Usage

```bash
git clone https://github.com/lawrencecchen/playwright-codegen-lite
cd playwright-codegen-lite

npm install

npm run start
```

## Vendor

The injected recorder (`vendor/playwright/packages/playwright-core/src/server/injected/recorder.ts`) has been modified to remove polling and highlighting. Additionally, we also need to bundle and copy over the `CodeGenerator` and `JavaScriptLanguageGenerator` modules from Playwright.

```bash
git submodule update --init --recursive
(cd vendor/playwright && npm install && npm run build)
npm run build:vendor # sh build_vendor.sh
```

## About

Much of the code is simply `packages/playwright-core/src/server/recorder.ts` rewritten to instead use the external Playwright APIs.

`src/generated/*` contains the source for JavaScript that is injected into the browser. This comes from the Playwright repo, under `packages/playwright-core/src/generated`, which can be built via `node utils/generate_injected.js`.

`src/server/*` and `src/utils/isomorphic` are from the Playwright repo, under `packages/playwright-core/src/server` and `packages/playwright-core/src/utils/isomorphic`, respectively. This is used for the `CodeGenerator`, which generates Playwright code from the events. Currently, only `JavaScriptLanguageGenerator` is ported.

## Todos

- [ ] make proper CLI and pre-compile TypeScript
- [ ] vendor `src/types.ts` from Playwright instead of copying
- [ ] configurable URL via CLI
- [ ] fix inline script execution for Content Security Policy (migrate to `addInitScript`?)
- [ ] support languages other than JavaScript (also add ESM output)
- [ ] handle back/forward navigation (and other page events)
- [ ] add flag to `npx playwright codegen ...` CLI and upstream it instead
- [ ] gracefully handle page close
- [ ] add browsers other than chromium
- [ ] figure out which generated sources actually have to be injected
- [ ] properly handle text selection intricacies (highlighting, etc.)
