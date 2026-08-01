/**
 * Base Action types for kist action plugins.
 * These types intentionally mirror the shape of kist's own `Action` interface
 * so that plugin packages (like this one) can be built and type-checked
 * independently of the kist core, while remaining structurally compatible
 * with whatever `Action` type kist itself uses at runtime.
 */

/**
 * Base shape for an action's options object: an untyped record of
 * key-value pairs. Concrete actions should extend this with their own
 * specific, strongly-typed option fields (see e.g.
 * `JavaScriptMinifyActionOptions`) rather than using it directly.
 */
export type ActionOptionsType = Record<string, unknown>;

/**
 * Abstract base class every kist action in this package should extend.
 * Supplies a default `name` (derived from the constructor), a no-op
 * `validateOptions`, a generic `describe`, and namespaced console logging
 * helpers (`logInfo`/`logError`/`logDebug`/`logWarning`) so subclasses don't
 * need to reimplement plumbing — only `execute` must be provided.
 */
export abstract class Action<T extends ActionOptionsType = ActionOptionsType> {
    /**
     * The action's display/identifier name, used as a prefix in all log
     * messages. Derived from the concrete subclass's constructor name
     * (e.g. `"JavaScriptMinifyAction"`), not overridable per-instance.
     *
     * @returns The runtime class name of this action instance.
     */
    get name(): string {
        return this.constructor.name;
    }

    /**
     * Validates the given options before `execute` runs. The base
     * implementation performs no checks and always succeeds; subclasses
     * with required or constrained options (e.g. required file paths)
     * should override this and return `false` (after logging via
     * `logError`) instead of throwing, so callers can decide how to react.
     *
     * @param _options - The options to validate. Unused in the base implementation.
     * @returns `true` if the options are acceptable; the base implementation always returns `true`.
     */
    validateOptions(_options: T): boolean {
        return true;
    }

    /**
     * Runs the action's work for a single pipeline step. Must be
     * implemented by every concrete subclass; implementations are expected
     * to validate their own options (typically via `validateOptions`) and
     * throw on unrecoverable failures rather than failing silently, so the
     * kist pipeline can halt/report correctly.
     *
     * @param options - The action-specific options for this invocation.
     * @returns A Promise that resolves when the action has completed successfully.
     * @throws {Error} Implementations should throw if options are invalid or the action's work fails.
     */
    abstract execute(options: T): Promise<void>;

    /**
     * Human-readable summary of what this action does, used by kist for
     * logging or introspection (e.g. listing available actions). Subclasses
     * should override this with a specific, one-line description; the base
     * implementation just returns the action's class name.
     *
     * @returns A one-line description of the action.
     */
    describe(): string {
        return `${this.name} action`;
    }

    /**
     * Logs an informational message to stdout, prefixed with this action's
     * `name`. Intended for normal progress/status output visible in
     * standard (non-debug) runs.
     *
     * @param message - The message to log.
     */
    protected logInfo(message: string): void {
        console.log(`[${this.name}] ${message}`);
    }

    /**
     * Logs an error message to stderr, prefixed with this action's `name`.
     * Intended to be called alongside (not instead of) throwing, so the
     * failure is both visible in logs and propagated to the caller.
     *
     * @param message - Description of what failed.
     * @param error - The underlying error or rejection value, if any; logged as-is (an empty string is logged when omitted).
     */
    protected logError(message: string, error?: unknown): void {
        console.error(`[${this.name}] ERROR: ${message}`, error || "");
    }

    /**
     * Logs a debug message to stderr, prefixed with this action's `name`.
     * Only emitted when the `DEBUG` environment variable is set (to any
     * truthy string); otherwise this is a no-op, so debug calls are safe to
     * leave in hot paths.
     *
     * @param message - The debug message to log.
     */
    protected logDebug(message: string): void {
        if (process.env.DEBUG) {
            console.debug(`[${this.name}] DEBUG: ${message}`);
        }
    }

    /**
     * Logs a warning message to stderr, prefixed with this action's `name`.
     * Intended for recoverable issues that don't warrant throwing but
     * should still be visible to the user (e.g. a deprecated option).
     *
     * @param message - The warning message to log.
     */
    protected logWarning(message: string): void {
        console.warn(`[${this.name}] WARNING: ${message}`);
    }
}

/**
 * Shape a kist action package's default export must satisfy so kist's
 * plugin loader can discover and register the actions it provides. In
 * practice kist's `PluginManager` requires `registerActions` to be present
 * as a function — a plugin missing it is rejected as not implementing
 * `ActionPlugin`, even though the field is typed optional here — and calls
 * it once at load time to obtain the action map; the static `actions` field
 * is accepted by this (locally-mirrored) type for compatibility but is not
 * read by the loader, so `registerActions` should always be provided (see
 * `src/index.ts` for this package's usage).
 */
export interface ActionPlugin {
    /** Plugin display name (default: falls back to the package name if omitted). */
    name?: string;
    /** Plugin version, typically kept in sync with the package's `package.json` version. */
    version: string;
    /** Short human-readable summary of what the plugin provides. */
    description?: string;
    /** Plugin author or maintaining organization. */
    author?: string;
    /** URL of the plugin's source repository, shown in tooling/documentation. */
    repository?: string;
    /** Keywords used for plugin discovery/search (default: `[]`). */
    keywords?: string[];
    /** Static map of action name → action constructor. Present for compatibility; not consulted by kist's plugin loader, so prefer `registerActions`. */
    actions?: Record<string, new () => Action>;
    /** Factory returning a map of action name → action constructor; called once at plugin load time. kist requires this to be present to recognize a package as a valid plugin. */
    registerActions?: () => Record<string, new () => Action>;
}
