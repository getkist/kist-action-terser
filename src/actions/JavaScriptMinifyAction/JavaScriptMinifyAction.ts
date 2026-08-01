// ============================================================================
// Import
// ============================================================================

import { promises as fs } from "fs";
import path from "path";
import { minify, MinifyOptions } from "terser";
import { Action, ActionOptionsType } from "../../types/Action.js";
import terserConfig from "./terser.config.js";

// ============================================================================
// Types
// ============================================================================

/**
 * Options accepted by {@link JavaScriptMinifyAction}.
 *
 * `inputPath` and `outputPath` are required; `customConfig` is optional and is
 * shallow-merged on top of the package's default Terser configuration
 * (see `terser.config.ts`), so any top-level key you provide (e.g. `compress`,
 * `mangle`, `format`) fully replaces that section of the defaults rather than
 * being deep-merged with it.
 *
 * @example
 * ```yaml
 * # kist.yml
 * pipeline:
 *   - action: JavaScriptMinifyAction
 *     options:
 *       inputPath: "src/app.js"
 *       outputPath: "dist/app.min.js"
 *       customConfig:
 *         compress:
 *           drop_console: false
 *         sourceMap:
 *           filename: "app.min.js.map"
 * ```
 */
export interface JavaScriptMinifyActionOptions extends ActionOptionsType {
    /** Path to the input JavaScript file to minify. Resolved relative to the current working directory. */
    inputPath: string;
    /** Path where the minified output will be written. Parent directories are created automatically if missing. */
    outputPath: string;
    /**
     * Custom Terser configuration, shallow-merged over the package defaults
     * (default: `{}`, i.e. use the defaults unchanged). See
     * {@link https://terser.org/docs/api-reference/ | Terser API reference}
     * for available keys such as `compress`, `mangle`, `format`, and `sourceMap`.
     */
    customConfig?: Record<string, unknown>;
}

// ============================================================================
// Classes
// ============================================================================

/**
 * kist action that minifies a single JavaScript file with Terser.
 *
 * Reads `inputPath`, runs it through Terser using the package's default
 * configuration merged with any `customConfig` override, and writes the
 * result to `outputPath`, creating parent directories as needed. Intended
 * to be registered and invoked by the kist pipeline (see the plugin
 * definition in `src/index.ts`), but can also be instantiated and used
 * standalone.
 */
export class JavaScriptMinifyAction extends Action<JavaScriptMinifyActionOptions> {
    /**
     * Checks that the required file-path options are present before the
     * action runs. This does not verify that `inputPath` actually exists on
     * disk — missing/unreadable input surfaces as a thrown error from
     * {@link execute} instead.
     *
     * @param options - The options to validate.
     * @returns `true` if `inputPath` and `outputPath` are both non-empty strings; `false` otherwise (an error is logged via `logError` for each failing check).
     */
    validateOptions(options: JavaScriptMinifyActionOptions): boolean {
        if (!options.inputPath || typeof options.inputPath !== "string") {
            this.logError("Invalid options: 'inputPath' is required and must be a string.");
            return false;
        }
        if (!options.outputPath || typeof options.outputPath !== "string") {
            this.logError("Invalid options: 'outputPath' is required and must be a string.");
            return false;
        }
        return true;
    }

    /**
     * Runs the minification: validates options, then reads `inputPath`,
     * minifies it with Terser, and writes the result to `outputPath`.
     *
     * @param options - The options containing input/output file paths and optional Terser overrides.
     * @returns A Promise that resolves once the minified file has been written.
     * @throws {Error} If `inputPath`/`outputPath` fail validation, the input file cannot be read, Terser produces no output, or the output file cannot be written.
     */
    async execute(options: JavaScriptMinifyActionOptions): Promise<void> {
        if (!this.validateOptions(options)) {
            throw new Error("Invalid options: 'inputPath' and 'outputPath' are required.");
        }

        const { inputPath, outputPath, customConfig = {} } = options;

        this.logInfo(`Minifying JavaScript file: ${inputPath} → ${outputPath}`);

        try {
            await this.minifyFile(inputPath, outputPath, customConfig as Record<string, unknown>);
            this.logInfo(`JavaScript minification completed: ${outputPath}`);
        } catch (error) {
            this.logError("JavaScript minification failed.", error);
            throw error;
        }
    }

    /**
     * Reads, minifies, and writes a single JavaScript file. Both input and
     * output paths are resolved to absolute paths before use, `outputPath`'s
     * parent directory is created recursively if it doesn't exist, and
     * `customConfig` is shallow-merged over `terserConfig` (with `ecma` and
     * `nameCache` explicitly normalized to satisfy Terser's `MinifyOptions`
     * type) before being passed to Terser.
     *
     * @param inputPath - Path to the input JavaScript file (absolute or relative to the working directory).
     * @param outputPath - Path where the minified file will be written (absolute or relative to the working directory).
     * @param customConfig - Terser configuration overrides, shallow-merged over the package defaults.
     * @returns A Promise that resolves once the minified file has been written to disk.
     * @throws {Error} If the input file cannot be read, Terser returns no `code` (empty output), or the output cannot be written.
     */
    private async minifyFile(
        inputPath: string,
        outputPath: string,
        customConfig: Record<string, unknown>,
    ): Promise<void> {
        try {
            const resolvedInputPath = path.resolve(inputPath);
            const resolvedOutputPath = path.resolve(outputPath);

            // Read JavaScript file
            const inputCode = await fs.readFile(resolvedInputPath, "utf8");

            // Merge Terser configuration with explicit type casting
            const terserOptions: MinifyOptions = {
                ...terserConfig,
                ...customConfig,
                ecma: terserConfig.ecma as MinifyOptions["ecma"],
                nameCache: terserConfig.nameCache ?? undefined,
            };

            // Minify using Terser
            const result = await minify(inputCode, terserOptions);

            if (!result.code) {
                throw new Error("Minification resulted in empty output.");
            }

            // Ensure output directory exists
            const outputDir = path.dirname(resolvedOutputPath);
            await fs.mkdir(outputDir, { recursive: true });

            // Write minified file
            await fs.writeFile(resolvedOutputPath, result.code, "utf8");

            this.logDebug(`Minified JavaScript file saved to ${resolvedOutputPath}`);
        } catch (error) {
            this.logError(`Error minifying JavaScript file: ${inputPath}`, error);
            throw error;
        }
    }

    /**
     * Human-readable summary used by kist for logging/reporting when
     * listing or introspecting registered actions.
     *
     * @returns A one-line description of what this action does.
     */
    describe(): string {
        return "Minifies JavaScript files using Terser to reduce size and optimize performance.";
    }
}
