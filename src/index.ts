// ============================================================================
// Export
// ============================================================================

export { JavaScriptMinifyAction } from "./actions/JavaScriptMinifyAction/index.js";
export type { JavaScriptMinifyActionOptions } from "./actions/JavaScriptMinifyAction/index.js";
export { Action, ActionPlugin } from "./types/Action.js";
export type { ActionOptionsType } from "./types/Action.js";

// ============================================================================
// Plugin Definition
// ============================================================================

import { ActionPlugin } from "./types/Action.js";
import { JavaScriptMinifyAction } from "./actions/JavaScriptMinifyAction/index.js";

const plugin: ActionPlugin = {
    version: "1.0.0",
    description: "JavaScript minification for kist using Terser",
    author: "kist",
    repository: "https://github.com/getkist/kist-action-terser",
    keywords: ["kist", "kist-action", "terser", "minify", "javascript"],
    registerActions() {
        return {
            JavaScriptMinifyAction,
        };
    },
};

export default plugin;
