# Dependency resilience

NEXUS normally resolves every package from the npm registry through the committed
`package-lock.json`. Version 4.1 additionally vendors the tiny MIT-licensed
`yocto-queue@0.1.0` transitive package as a 1.4 KB tarball under `vendor/`.

The fallback exists because `p-limit@3.1.0` needs this package during installation and
some registry mirrors intermittently return a package-specific 503 response. Keeping the
exact compatible package in the repository prevents that single mirror failure from
blocking `npm install` or `npm ci` while leaving the dependency graph and runtime API
unchanged.

The readable source and upstream MIT license are kept beside the tarball for auditability.
No other third-party package is vendored. To return to registry-only resolution, replace
the `node_modules/yocto-queue.resolved` entry in `package-lock.json` with the upstream
npm tarball URL and remove `vendor/yocto-queue*` after verifying a clean install.
