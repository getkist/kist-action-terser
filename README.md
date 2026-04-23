# @getkist/action-terser

<div align="center">

[![npm version](https://img.shields.io/npm/v/@getkist/action-terser?style=flat-square&logo=npm&logoColor=FFFFFF&labelColor=5e4d34&color=5e4d34)](https://www.npmjs.com/package/@getkist/action-terser)
[![License: MIT](https://img.shields.io/badge/License-MIT-5e4d34?style=flat-square)](https://opensource.org/licenses/MIT)
[![kist plugin](https://img.shields.io/badge/kist-plugin-5e4d34?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN3Y2YzAgNS41NSAzLjg0IDEwLjc0IDEwIDEyIDYuMTYtMS4yNiAxMC02LjQ1IDEwLTEyVjdMMTIgMnoiLz48L3N2Zz4=)](https://github.com/getkist/kist)

</div>

JavaScript minification actions for [kist](https://github.com/getkist/kist) build tool using Terser.

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
