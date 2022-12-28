"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/playwright-core/src/server/recorder/codeGenerator.ts
var codeGenerator_exports = {};
__export(codeGenerator_exports, {
  CodeGenerator: () => CodeGenerator
});
module.exports = __toCommonJS(codeGenerator_exports);
var import_events = require("events");
var CodeGenerator = class extends import_events.EventEmitter {
  constructor(browserName, enabled, launchOptions, contextOptions, deviceName, saveStorage) {
    super();
    this._currentAction = null;
    this._lastAction = null;
    this._actions = [];
    launchOptions = { headless: false, ...launchOptions };
    contextOptions = { ...contextOptions };
    this._enabled = enabled;
    this._options = { browserName, launchOptions, contextOptions, deviceName, saveStorage };
    this.restart();
  }
  restart() {
    this._currentAction = null;
    this._lastAction = null;
    this._actions = [];
    this.emit("change");
  }
  setEnabled(enabled) {
    this._enabled = enabled;
  }
  addAction(action) {
    if (!this._enabled)
      return;
    this.willPerformAction(action);
    this.didPerformAction(action);
  }
  willPerformAction(action) {
    if (!this._enabled)
      return;
    this._currentAction = action;
  }
  performedActionFailed(action) {
    if (!this._enabled)
      return;
    if (this._currentAction === action)
      this._currentAction = null;
  }
  didPerformAction(actionInContext) {
    if (!this._enabled)
      return;
    const action = actionInContext.action;
    let eraseLastAction = false;
    if (this._lastAction && this._lastAction.frame.pageAlias === actionInContext.frame.pageAlias) {
      const lastAction = this._lastAction.action;
      if (this._lastAction && action.name === "fill" && lastAction.name === "fill") {
        if (action.selector === lastAction.selector)
          eraseLastAction = true;
      }
      if (lastAction && action.name === "click" && lastAction.name === "click") {
        if (action.selector === lastAction.selector && action.clickCount > lastAction.clickCount)
          eraseLastAction = true;
      }
      if (lastAction && action.name === "navigate" && lastAction.name === "navigate") {
        if (action.url === lastAction.url) {
          this._currentAction = null;
          return;
        }
      }
      if (lastAction && (action.name === "check" || action.name === "uncheck") && lastAction.name === "click") {
        if (action.selector === lastAction.selector)
          eraseLastAction = true;
      }
    }
    this._lastAction = actionInContext;
    this._currentAction = null;
    if (eraseLastAction)
      this._actions.pop();
    this._actions.push(actionInContext);
    this.emit("change");
  }
  commitLastAction() {
    if (!this._enabled)
      return;
    const action = this._lastAction;
    if (action)
      action.committed = true;
  }
  signal(pageAlias, frame, signal) {
    if (!this._enabled)
      return;
    if (this._currentAction) {
      this._currentAction.action.signals.push(signal);
      return;
    }
    if (this._lastAction && !this._lastAction.committed) {
      const signals = this._lastAction.action.signals;
      if (signal.name === "navigation" && signals.length && signals[signals.length - 1].name === "download")
        return;
      if (signal.name === "download" && signals.length && signals[signals.length - 1].name === "navigation")
        signals.length = signals.length - 1;
      this._lastAction.action.signals.push(signal);
      this.emit("change");
      return;
    }
    if (signal.name === "navigation") {
      this.addAction({
        frame: {
          pageAlias,
          isMainFrame: frame._page.mainFrame() === frame,
          url: frame.url()
        },
        committed: true,
        action: {
          name: "navigate",
          url: frame.url(),
          signals: []
        }
      });
    }
  }
  generateStructure(languageGenerator) {
    const header = languageGenerator.generateHeader(this._options);
    const footer = languageGenerator.generateFooter(this._options.saveStorage);
    const actions = this._actions.map((a) => languageGenerator.generateAction(a)).filter(Boolean);
    const text = [header, ...actions, footer].join("\n");
    return { header, footer, actions, text };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CodeGenerator
});
