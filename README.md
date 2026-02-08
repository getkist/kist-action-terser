# @getkist/action-terser

JavaScript minification actions for kist using Terser.

## Installation

```bash
npm install @getkist/action-terser
```

## Usage

### As a kist plugin

```yaml
# kist.yml
plugins:
  - "@getkist/action-terser"

pipeline:
  - action: JavaScriptMinifyAction
    options:
      inputPath: "src/app.js"
      outputPath: "dist/app.min.js"
```

### Standalone usage

```typescript
import { JavaScriptMinifyAction } from "@getkist/action-terser";

const action = new JavaScriptMinifyAction();
await action.execute({
  inputPath: "src/app.js",
  outputPath: "dist/app.min.js",
  customConfig: {
    compress: {
      drop_console: false
    }
  }
});
```

## Actions

### JavaScriptMinifyAction

Minifies JavaScript files using Terser to reduce file size and optimize performance.

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `inputPath` | `string` | Yes | Path to the input JavaScript file |
| `outputPath` | `string` | Yes | Path where the minified file will be saved |
| `customConfig` | `object` | No | Custom Terser configuration to merge with defaults |

#### Default Terser Configuration

The action uses sensible defaults optimized for production:

- **Compression**: Drops console statements, removes debugger, dead code elimination
- **Mangling**: Minifies variable and function names
- **Output**: Removes comments, no beautification
- **ECMAScript**: Targets ES5 for broad compatibility

You can override any Terser option via `customConfig`.

## Configuration Examples

### Preserve console.log statements

```yaml
- action: JavaScriptMinifyAction
  options:
    inputPath: "src/app.js"
    outputPath: "dist/app.min.js"
    customConfig:
      compress:
        drop_console: false
```

### Generate source maps

```yaml
- action: JavaScriptMinifyAction
  options:
    inputPath: "src/app.js"
    outputPath: "dist/app.min.js"
    customConfig:
      sourceMap:
        filename: "app.min.js.map"
        url: "app.min.js.map"
```

### Target modern browsers (ES2020)

```yaml
- action: JavaScriptMinifyAction
  options:
    inputPath: "src/app.js"
    outputPath: "dist/app.min.js"
    customConfig:
      ecma: 2020
      module: true
```

## License

MIT