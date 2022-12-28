#!/usr/bin/env bash

mkdir -p src/vendor
mkdir -p src/vendor/generated

# codeGenerator.ts and javascript.ts
(cd vendor/playwright && npx esbuild packages/playwright-core/src/server/recorder/codeGenerator.ts --platform=node --bundle --outfile=../../src/vendor/codeGeneratorBundle.js)
(cd vendor/playwright && npx esbuild packages/playwright-core/src/server/recorder/javascript.ts --platform=node --bundle --outfile=../../src/vendor/javascriptBundle.js)

# build injected scripts
(cd vendor/playwright && node utils/generate_injected.js)

# copy necessary injected scripts sources
cp vendor/playwright/packages/playwright-core/src/generated/recorderSource.ts src/vendor/generated/recorderSource.ts
cp vendor/playwright/packages/playwright-core/src/generated/injectedScriptSource.ts src/vendor/generated/injectedScriptSource.ts