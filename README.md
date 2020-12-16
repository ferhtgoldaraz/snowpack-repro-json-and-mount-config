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
