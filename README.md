# snowpack-repro-json-and-mount-config

Repro: snowpack bug on json imports for some mount configs.

The problem:

JSON import specs that start with / (not with ./ or ../) fail. This is because
CWD (or root path) is used, and mount is not used, which leads to wrong fs paths.

## how to repro

```bash
cd apps/app1
npx snowpack dev
```

or...

```
npx snowpack build
```

And just check out network panel in chrome.

## Offending code:

https://github.com/snowpackjs/snowpack/blob/0d8ffed/snowpack/src/build/import-resolver.ts#L52

Instead, maybe do something like...

```patch
diff --git a/node_modules/snowpack/lib/build/import-resolver.js b/node_modules/snowpack/lib/build/import-resolver.js
index 90ce443..6d5eb6a 100644
--- a/node_modules/snowpack/lib/build/import-resolver.js
+++ b/node_modules/snowpack/lib/build/import-resolver.js
@@ -56,7 +56,16 @@ function createImportResolver({ fileLoc, config }) {
             return spec;
         }
         if (spec.startsWith('/')) {
-            const importStats = getImportStats(path_1.default.resolve(cwd, spec.substr(1)));
+            let importStats;
+            for (const [mountKey, mountEntry] of Object.entries(config.mount)) {
+                const candidate = path_1.default.resolve(mountKey, spec.replace(mountEntry.url, '').replace(/^[/\\]+/, ''));
+                importStats = getImportStats(candidate);
+
+                if (importStats) {
+                    break;
+                }
+            }
+
             return resolveSourceSpecifier(spec, importStats, config);
         }
         if (spec.startsWith('./') || spec.startsWith('../')) {

```

There is a cleaner proposal in...

https://github.com/snowpackjs/snowpack/compare/main...N8-B:import-resolve-absolute-path-and-nested-dirs

And that's about it.