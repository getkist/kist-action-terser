import { ActionPlugin } from "./types/Action.js";
import { JavaScriptMinifyAction } from "./actions/JavaScriptMinifyAction/index.js";

const plugin: ActionPlugin = {
    name: "@getkist/action-terser",
    version: "1.0.0",
    actions: { JavaScriptMinifyAction },
};

export default plugin;
export type { JavaScriptMinifyActionOptions } from "./actions/JavaScriptMinifyAction/index.js";
export { JavaScriptMinifyAction };
export { Action, ActionPlugin, ActionOptionsType } from "./types/Action.js";
