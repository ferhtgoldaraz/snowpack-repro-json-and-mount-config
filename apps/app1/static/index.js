import '/whatever.js';
import foo from '/packages/some-package/foo.json' // BROKEN!!!!!
import bar from './aha.json';

console.log(foo, bar);