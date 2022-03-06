# Apollo Client Issue Reproduction

Modified by Travis Collins to reproduce the following error when using a binary built by pkg.

# Reproduction Creation Steps

The following steps will produce a working build.

1. npm ci
1. npm run build
1. cd dist
1. Run the build that coresponds with your OS (This should work as expected, and print some instructions)

- Windows: apollo-client-error-tsinvariant-process-pkg-win.exe
- Mac: ./apollo-client-error-tsinvariant-process-pkg-macos
- Linux: ./apollo-client-error-tsinvariant-process-pkg-linux

Upgrading beyond @apollo/client 3.4.0 will break running this simple app via pkg built binaries.

1. cd ..
1. npm install @apollo/client@3.4.0
1. npm run build
1. Run the executable again, see the resulting error.

# Theory of why this fails

It appears the ts-invariant/process package is referenced in the "globals.js" file in the Apollo Client. But that package is not included in the package.json of ts-invariant. And therefore the packaging step of the pkg library does not include it in the "snapshot filesystem" (the virtual filesystem created at build time that includes all node_modules, assets, etc).

There is a relevant note in the Apollo Client 3.5.4 release notes about referecing the ts-invariant/process/index.js directly, rather than using a require("ts-invariant/process") statement. But upgrading beyond 3.5.4 does not fix this issue.

# Example Error

```text
./dist/apollo-client-error-tsinvariant-process-pkg-macos
pkg/prelude/bootstrap.js:1740
      throw error;
      ^

Error: Cannot find module 'ts-invariant/process'
Require stack:
- /snapshot/react-apollo-error-template/node_modules/@apollo/client/utilities/utilities.cjs.js
- /snapshot/react-apollo-error-template/node_modules/@apollo/client/core/core.cjs.js
- /snapshot/react-apollo-error-template/node_modules/@apollo/client/main.cjs.js
- /snapshot/react-apollo-error-template/src/index.js
1) If you want to compile the package/file into executable, please pay attention to compilation warnings and specify a literal in 'require' call. 2) If you don't want to compile the package/file into executable and want to 'require' it from filesystem (likely plugin), specify an absolute path in 'require' call using process.cwd() or process.execPath.
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
    at Function._resolveFilename (pkg/prelude/bootstrap.js:1819:46)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at Module.require (pkg/prelude/bootstrap.js:1719:31)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/snapshot/react-apollo-error-template/node_modules/@apollo/client/utilities/utilities.cjs.js)
    at Module._compile (pkg/prelude/bootstrap.js:1794:22)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/snapshot/react-apollo-error-template/node_modules/@apollo/client/utilities/utilities.cjs.js',
    '/snapshot/react-apollo-error-template/node_modules/@apollo/client/core/core.cjs.js',
    '/snapshot/react-apollo-error-template/node_modules/@apollo/client/main.cjs.js',
    '/snapshot/react-apollo-error-template/src/index.js'
  ],
  pkg: true
}
```
