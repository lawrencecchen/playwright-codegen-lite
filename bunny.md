```ts
declare module globalThis {
	let __pw_recorderPerformAction: (action: Action) => Promise<void>;
	let __pw_recorderRecordAction: (action: Action) => Promise<void>;
	// let __pw_recorderState: () => Promise<UIState>; // unused
	// let __pw_recorderSetSelector: (selector: string) => Promise<void>;
	// let __pw_refreshOverlay: () => void; // unused
}
```

## notes

- `utils/generate_injected.js` compiles the injected `recorder.ts` (`packages/playwright-core/src/server/injected/recorder.ts`) to `packages/playwright-core/src/generated/recorderSource.ts`

bunx esbuild packages/playwright-core/src/server/recorder.ts --platform=node --bundle --outfile=recorderBundle.js

- yoink server recorder (with recorderApp commented out)

bunx esbuild packages/playwright-core/src/server/recorder/javascript.ts --platform=node --bundle --outfile=javascriptBundle.js

- this yoinks the javascript generator

## thoughts

- what is an InjectedScript?
- should i use Recorder? or just mock the events? how much should i rewrite?
  - i think the play is the mock the server and keep the recorder scripts inside
- why are there different `BrowserContext`s?
  - one is for server, one is for client
- "polling for recording start/stop state (always record)"
  - i don't think polling is relevant? user action (`__pw_recorderPerformAction`) -> action prevented on frontend -> backend receives action -> backend replicates action via playwright internal API -> frontend receives action

## bugs

- https://github.com/microsoft/playwright/issues/12017
