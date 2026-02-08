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
 * Options for the JavaScriptMinifyAction
 */
export interface JavaScriptMinifyActionOptions extends ActionOptionsType {
    /** Path to the input JavaScript file */
    inputPath: string;
    /** Path where the minified file will be saved */
    outputPath: string;
    /** Custom Terser configuration to merge with defaults */
    customConfig?: Record<string, unknown>;
}

// ============================================================================
// Classes
// ============================================================================

/**
 * JavaScriptMinifyAction handles the minification of JavaScript files.
 * Uses Terser to reduce file size and optimize performance.
 */
export class JavaScriptMinifyAction extends Action<JavaScriptMinifyActionOptions> {
    /**
     * Validates the action options.
     *
     * @param options - The options to validate.
     * @returns True if options are valid.
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
     * Executes the JavaScript minification action.
     *
     * @param options - The options containing input and output file paths.
     * @returns A Promise that resolves when the minification process completes.
     * @throws {Error} If input file is missing, minification fails, or output cannot be written.
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
     * Minifies a JavaScript file using Terser.
     *
     * @param inputPath - Path to the input JavaScript file.
     * @param outputPath - Path where the minified file will be saved.
     * @param customConfig - Custom Terser configuration.
     * @returns A Promise that resolves when the minification is complete.
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
     * Provides a description of the action.
     *
     * @returns A string description of the action.
     */
    describe(): string {
        return "Minifies JavaScript files using Terser to reduce size and optimize performance.";
    }
}
