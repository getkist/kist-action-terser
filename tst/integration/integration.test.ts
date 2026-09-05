import fs from "fs/promises";
import os from "os";
import path from "path";

import { JavaScriptMinifyAction } from "../../src/actions/JavaScriptMinifyAction/JavaScriptMinifyAction.js";

/**
 * Runs Terser for real over files on disk, so the assertions are about the
 * bytes that actually land in the output rather than about a mock's arguments.
 */
describe("JavaScriptMinifyAction integration", () => {
    const tmpDir = path.join(os.tmpdir(), `terser-integration-${Date.now()}`);
    const inputPath = path.join(tmpDir, "in.js");

    const SOURCE = `
export function greet(name) {
    const greeting = "hello, " + name;
    return greeting;
}
`;

    beforeAll(async () => {
        await fs.mkdir(tmpDir, { recursive: true });
        await fs.writeFile(inputPath, SOURCE, "utf8");
    });

    afterAll(async () => {
        await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it("writes minified output that is smaller than the source", async () => {
        const outputPath = path.join(tmpDir, "out.min.js");

        await new JavaScriptMinifyAction().execute({ inputPath, outputPath });

        const minified = await fs.readFile(outputPath, "utf8");
        expect(minified.length).toBeLessThan(SOURCE.length);
        // The exported name is part of the module's contract and must survive.
        expect(minified).toContain("greet");
    });

    it("keeps the code runnable after minification", async () => {
        const outputPath = path.join(tmpDir, "runnable.min.js");

        await new JavaScriptMinifyAction().execute({ inputPath, outputPath });

        const minified = await fs.readFile(outputPath, "utf8");
        // Strip the ESM export so the body can be evaluated in isolation.
        const body = minified.replace(/^export\s+/, "");
        const fn = new Function(`${body}; return greet("world");`);
        expect(fn()).toBe("hello, world");
    });

    it("honours a custom Terser configuration", async () => {
        const outputPath = path.join(tmpDir, "custom.min.js");

        await new JavaScriptMinifyAction().execute({
            inputPath,
            outputPath,
            customConfig: { compress: false, mangle: false },
        });

        const minified = await fs.readFile(outputPath, "utf8");
        // With compression on, Terser inlines the local away regardless of
        // mangling; turning both off is what makes the name observable, and
        // proves the custom config reached Terser rather than being dropped.
        expect(minified).toContain("greeting");
    });

    it("rejects when the input file does not exist", async () => {
        await expect(
            new JavaScriptMinifyAction().execute({
                inputPath: path.join(tmpDir, "missing.js"),
                outputPath: path.join(tmpDir, "never.js"),
            }),
        ).rejects.toThrow();
    });

    it("rejects before touching disk when required options are missing", async () => {
        await expect(
            new JavaScriptMinifyAction().execute({ inputPath } as never),
        ).rejects.toThrow();
    });
});
