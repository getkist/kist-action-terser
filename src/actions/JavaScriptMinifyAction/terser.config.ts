// ============================================================================
// Terser Configuration
// ============================================================================

// https://terser.org/docs/api-reference/

const terserConfig = {
    parse: {
        // parse options
    },
    compress: {
        // compress options
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ["console.info", "console.debug", "console.warn"], // Remove specific console functions

        // defaults (default: true) -- Pass false to disable most default enabled compress transforms.
        // Useful when you only want to enable a few compress options while disabling the rest.

        // Class and object literal methods are converted will also be
        // converted to arrow expressions if the resultant code is shorter:
        // m(){return x} becomes m:()=>x. To do this to regular ES5 functions
        // which don't use this or arguments, see unsafe_arrows.
        arrows: true, // (default: true)

        // arguments (default: false) -- replace arguments[index] with function parameter name whenever possible.
        // booleans (default: true) -- various optimizations for boolean context, for example !!a ? b : c → a ? b : c
        // booleans_as_integers (default: false) -- Turn booleans into 0 and 1
        // collapse_vars (default: true) -- Collapse single-use non-constant variables, side effects permitting.
        // comparisons (default: true) -- apply certain optimizations to binary nodes
        // computed_props (default: true) -- Transforms constant computed properties into regular ones
        // conditionals (default: true) -- apply optimizations for if-s and conditional expressions
        // dead_code (default: true) -- remove unreachable code
        // directives (default: true) -- remove redundant or non-standard directives
        // drop_console (default: false) -- Pass true to discard calls to console.* functions
        // drop_debugger (default: true) -- remove debugger; statements
        // ecma (default: 5) -- Pass 2015 or greater to enable compress options that will transform ES5 code
        // evaluate (default: true) -- attempt to evaluate constant expressions
        // expression (default: false) -- Pass true to preserve completion values from terminal statements
        // global_defs (default: {}) -- see conditional compilation
        // hoist_funs (default: false) -- hoist function declarations
        // hoist_props (default: true) -- hoist properties from constant object and array literals
        // hoist_vars (default: false) -- hoist var declarations
        // if_return (default: true) -- optimizations for if/return and if/continue
        // inline (default: true) -- inline calls to function with simple/return statement
        // join_vars (default: true) -- join consecutive var, let and const statements
        // keep_classnames (default: false) -- Pass true to prevent discarding class names
        // keep_fargs (default: true) -- Prevents discarding unused function arguments
        // keep_fnames (default: false) -- Pass true to prevent discarding function names
        // keep_infinity (default: false) -- Pass true to prevent Infinity from being compressed into 1/0
        // lhs_constants (default: true) -- Moves constant values to the left-hand side of binary nodes
        // loops (default: true) -- optimizations for do, while and for loops
        // module (default false) -- Pass true when compressing an ES6 module
        // negate_iife (default: true) -- negate "Immediately-Called Function Expressions"
        // passes (default: 1) -- The maximum number of times to run compress
        // properties (default: true) -- rewrite property access using the dot notation
        // pure_funcs (default: null) -- array of function names that don't produce side effects
        // pure_getters (default: "strict") -- assume object property access doesn't have side effects
        // pure_new (default: false) -- Set to true to assume new X() never has side effects
        // reduce_vars (default: true) -- Improve optimization on variables assigned as constants
        // reduce_funcs (default: true) -- Inline single-use functions when possible
        // sequences (default: true) -- join consecutive simple statements using the comma operator
        // side_effects (default: true) -- Remove expressions which have no side effects
        // switches (default: true) -- de-duplicate and remove unreachable switch branches
        // toplevel (default: false) -- drop unreferenced functions and/or variables in toplevel scope
        // top_retain (default: null) -- prevent specific toplevel functions and variables from removal
        // typeofs (default: true) -- Transforms typeof foo == "undefined" into foo === void 0
        // unsafe (default: false) -- apply "unsafe" transformations
        // unsafe_arrows (default: false) -- Convert ES5 style anonymous function expressions to arrow functions
        // unsafe_comps (default: false) -- Reverse < and <= to > and >=
        // unsafe_Function (default: false) -- compress and mangle Function(args, code)
        // unsafe_math (default: false) -- optimize numerical expressions
        // unsafe_symbols (default: false) -- removes keys from native Symbol declarations
        // unsafe_methods (default: false) -- Converts { m: function(){} } to { m(){} }
        // unsafe_proto (default: false) -- optimize expressions like Array.prototype.slice.call(a)
        // unsafe_regexp (default: false) -- enable substitutions of variables with RegExp values
        // unsafe_undefined (default: false) -- substitute void 0 if there is undefined in scope
        // unused (default: true) -- drop unreferenced functions and variables
    },
    mangle: {
        // mangle options
        // Mangle names for obfuscation and size reduction
        properties: false, // Don't mangle property names (can break code)
    },
    format: {
        // format options (can also use `output` for backwards compatibility)
        comments: false, // Remove comments to reduce file size
        beautify: false, // Disable beautification for smaller file size
    },
    sourceMap: {
        // source map options
    },
    // Define ECMAScript target version
    ecma: 5, // specify one of: 5, 2015, 2016, etc.
    enclose: false, // or specify true, or "args:values"
    keep_classnames: false, // Remove class names
    keep_fnames: false, // Remove function names
    ie8: false,
    module: false,
    nameCache: null, // or specify a name cache object
    safari10: false,
    toplevel: false, // Don't remove top-level variables by default (can break exports)
};

// ============================================================================
// Export
// ============================================================================

export default terserConfig;
