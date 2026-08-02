// ============================================================================
// Export
// ============================================================================

/**
 * Public API of the `@getkist/action-terser` package. Re-exported here so
 * consumers using this package standalone (i.e. not through the kist plugin
 * loader) can `import { JavaScriptMinifyAction } from "@getkist/action-terser"`
 * without reaching into internal file paths.
 */
export { JavaScriptMinifyAction } from "./actions/JavaScriptMinifyAction/index.js";
export type { JavaScriptMinifyActionOptions } from "./actions/JavaScriptMinifyAction/index.js";
export { Action, ActionPlugin } from "./types/Action.js";
export type { ActionOptionsType } from "./types/Action.js";

// ============================================================================
// Plugin Definition
// ============================================================================

import { ActionPlugin } from "./types/Action.js";
import { JavaScriptMinifyAction } from "./actions/JavaScriptMinifyAction/index.js";

/**
 * kist plugin manifest for this package, matching the {@link ActionPlugin}
 * interface. This is the default export kist loads when a `kist.yml`
 * pipeline declares `plugins: ["@getkist/action-terser"]`; `registerActions`
 * is called to obtain the map of action names (here, `JavaScriptMinifyAction`)
 * to their constructors that become available as `action:` values in
 * pipeline steps.
 */
const plugin: ActionPlugin = {
    version: "1.0.23",
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

/** Default export required by kist's plugin loader; see the JSDoc above `plugin`. */
export default plugin;
