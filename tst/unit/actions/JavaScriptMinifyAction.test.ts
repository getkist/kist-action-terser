import { JavaScriptMinifyAction } from "../../../src/actions/JavaScriptMinifyAction/JavaScriptMinifyAction.js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("JavaScriptMinifyAction", () => {
    let action: JavaScriptMinifyAction;
    const testDir = path.join(__dirname, "../fixtures");
    const inputFile = path.join(testDir, "input.js");
    const outputFile = path.join(testDir, "output.min.js");

    beforeAll(async () => {
        // Create test fixtures directory
        await fs.mkdir(testDir, { recursive: true });
    });

    beforeEach(async () => {
        action = new JavaScriptMinifyAction();
        // Create a sample JS file for testing
        // Note: Using code that won't be completely stripped by terser's dead code elimination
        const sampleJS = `
// This is a comment that should be removed
(function() {
    function greet(name) {
        return "Hello, " + name + "!";
    }

    // Export to global scope to prevent dead code elimination
    window.greet = greet;
    window.message = greet("World");
})();
`;
        await fs.writeFile(inputFile, sampleJS, "utf8");
    });

    afterEach(async () => {
        // Clean up test files
        try {
            await fs.unlink(inputFile);
        } catch { /* ignore */ }
        try {
            await fs.unlink(outputFile);
        } catch { /* ignore */ }
    });

    afterAll(async () => {
        // Clean up test directory
        try {
            await fs.rmdir(testDir);
        } catch { /* ignore */ }
    });

    describe("name", () => {
        it("should return the action name", () => {
            expect(action.name).toBe("JavaScriptMinifyAction");
        });
    });

    describe("describe", () => {
        it("should return a description", () => {
            expect(action.describe()).toContain("Minifies JavaScript files");
        });
    });

    describe("validateOptions", () => {
        it("should return true for valid options", () => {
            const result = action.validateOptions({
                inputPath: inputFile,
                outputPath: outputFile,
            });
            expect(result).toBe(true);
        });

        it("should return false when inputPath is missing", () => {
            const result = action.validateOptions({
                inputPath: "",
                outputPath: outputFile,
            });
            expect(result).toBe(false);
        });

        it("should return false when outputPath is missing", () => {
            const result = action.validateOptions({
                inputPath: inputFile,
                outputPath: "",
            });
            expect(result).toBe(false);
        });
    });

    describe("execute", () => {
        it("should minify a JavaScript file", async () => {
            await action.execute({
                inputPath: inputFile,
                outputPath: outputFile,
            });

            const result = await fs.readFile(outputFile, "utf8");
            
            // Minified output should be smaller and have no comments
            expect(result).not.toContain("// This is a comment");
            expect(result.length).toBeLessThan(200); // Original is ~250 chars
        });

        it("should throw error for missing input file", async () => {
            await expect(
                action.execute({
                    inputPath: "/nonexistent/file.js",
                    outputPath: outputFile,
                })
            ).rejects.toThrow();
        });

        it("should throw error for invalid options", async () => {
            await expect(
                action.execute({
                    inputPath: "",
                    outputPath: "",
                })
            ).rejects.toThrow("Invalid options");
        });

        it("should accept custom config", async () => {
            await action.execute({
                inputPath: inputFile,
                outputPath: outputFile,
                customConfig: {
                    compress: {
                        drop_console: false, // Keep console statements
                    },
                },
            });

            const result = await fs.readFile(outputFile, "utf8");
            // With drop_console: false, the minified output may still have console references
            expect(result).toBeDefined();
        });

        it("should create output directory if it does not exist", async () => {
            const nestedOutput = path.join(testDir, "nested", "deep", "output.min.js");
            
            await action.execute({
                inputPath: inputFile,
                outputPath: nestedOutput,
            });

            const result = await fs.readFile(nestedOutput, "utf8");
            expect(result).toBeDefined();

            // Clean up nested directories
            await fs.unlink(nestedOutput);
            await fs.rmdir(path.join(testDir, "nested", "deep"));
            await fs.rmdir(path.join(testDir, "nested"));
        });
    });
});
