# esbuild-ctor-param-decorator-bug-sample

The build result of the decorator given to the constructor parameters is different between tsc and esbuild(v0.8.38).
This repository presents an example of using the Inversify.js decorator.

## Caution

This bug has been fixed in esbuild v0.8.40.

https://github.com/evanw/esbuild/issues/734

## How to use

1. Run `npm install`.

2. Run `npm run build`. The code built by tsc will be output to `dist`, and the code built by esbuild will be output to `dist_esbuild`.

3. Run `npm run start:tsc`. The decorator will be recognized correctly and "cut!" will be output to the console.

4. Run `npm run start:esbuild`. It does not work properly and the following error occurs.

```sh
/path/to/node_modules/inversify/lib/annotation/decorator_utils.js:21
        throw new Error(ERROR_MSGS.INVALID_DECORATOR_OPERATION);
        ^

Error: The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.
    at _tagParameterOrProperty (/path/to/node_modules/inversify/lib/annotation/decorator_utils.js:21:15)
    at Object.tagParameter (/path/to/node_modules/inversify/lib/annotation/decorator_utils.js:8:5)
    at /path/to/node_modules/inversify/lib/annotation/inject.js:25:31
    at /path/to/dist_esbuild/container.js:36:54
    at __decorate (/path/to/dist_esbuild/container.js:31:24)
    at Object.<anonymous> (/path/to/dist_esbuild/container.js:78:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
```

## Why does the error occur?

You can find the cause by comparing these two files.

- dist/src/container.js
- dist_esbuild/container.js

The decorator in the constructor parameter of the Ninja class is handled differently.

```ts
// in dist/src/container.js
Ninja = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(exports.Symbols.Katana)),
    __param(1, inversify_1.inject(exports.Symbols.Shuriken))
], Ninja);
```

```ts
// in dist_esbuild/container.js
__decorate([
  __param(0, import_inversify.inject(Symbols.Katana)),
  __param(1, import_inversify.inject(Symbols.Shuriken))
], Ninja.prototype, "constructor", 1);
Ninja = __decorate([
  import_inversify.injectable()
], Ninja);
```

This problem can be fixed by modifying the above code in `dist_esbuild/container.js` as follows.

```ts
Ninja = __decorate([
  import_inversify.injectable(),
  __param(0, import_inversify.inject(Symbols.Katana)),
  __param(1, import_inversify.inject(Symbols.Shuriken))
], Ninja);
```
