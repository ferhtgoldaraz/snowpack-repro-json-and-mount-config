# snowpack-repro-json-and-mount-config

Repro: snowpack bug on json imports for some mount configs.

The problem:

JSON import specs that start with / (not with ./ or ../) fail. This is because
CWD is used, and omunt is not used, which leads to wrong fs paths.
