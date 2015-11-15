System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "babel": "npm:babel-core@5.8.33",
    "babel-runtime": "npm:babel-runtime@5.8.29",
    "co": "npm:co@4.6.0",
    "core-js": "npm:core-js@1.2.6",
    "hbs": "github:davis/plugin-hbs@1.2.1",
    "marko": "npm:marko@2.7.29",
    "page": "npm:page@1.6.4",
    "pouchdb": "github:pouchdb/pouchdb@5.1.0",
    "qs": "npm:qs@6.0.0",
    "querystring": "github:jspm/nodelibs-querystring@0.1.0",
    "github:davis/plugin-hbs@1.2.1": {
      "handlebars": "github:components/handlebars.js@4.0.4"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.5.2"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:app-module-path@1.0.4": {
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:app-root-dir@1.0.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:async-writer@1.4.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "events": "npm:events@1.0.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-runtime@5.8.29": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browser-refresh-client@1.1.4": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.5.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:dom-serializer@0.1.0": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "entities": "npm:entities@1.1.1"
    },
    "npm:domhandler@2.3.0": {
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:domutils@1.5.1": {
      "dom-serializer": "npm:dom-serializer@0.1.0",
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:entities@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:entities@1.1.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:htmlparser2@3.8.3": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "domhandler": "npm:domhandler@2.3.0",
      "domutils": "npm:domutils@1.5.1",
      "entities": "npm:entities@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jsonminify@0.2.3": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:marko-async@2.0.8": {
      "async-writer": "npm:async-writer@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "raptor-async": "npm:raptor-async@1.1.2",
      "raptor-dust": "npm:raptor-dust@1.1.12",
      "raptor-logging": "npm:raptor-logging@1.0.6"
    },
    "npm:marko-layout@2.0.2": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "raptor-dust": "npm:raptor-dust@1.1.12",
      "raptor-polyfill": "npm:raptor-polyfill@1.0.2",
      "raptor-util": "npm:raptor-util@1.0.10"
    },
    "npm:marko@2.7.29": {
      "app-module-path": "npm:app-module-path@1.0.4",
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "async-writer": "npm:async-writer@1.4.1",
      "browser-refresh-client": "npm:browser-refresh-client@1.1.4",
      "char-props": "npm:char-props@0.1.5",
      "events": "npm:events@1.0.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "htmlparser2": "npm:htmlparser2@3.8.3",
      "jsonminify": "npm:jsonminify@0.2.3",
      "marko-async": "npm:marko-async@2.0.8",
      "marko-layout": "npm:marko-layout@2.0.2",
      "minimatch": "npm:minimatch@0.2.14",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "property-handlers": "npm:property-handlers@1.0.1",
      "raptor-args": "npm:raptor-args@1.0.2",
      "raptor-json": "npm:raptor-json@1.1.0",
      "raptor-logging": "npm:raptor-logging@1.0.6",
      "raptor-modules": "npm:raptor-modules@1.1.2",
      "raptor-polyfill": "npm:raptor-polyfill@1.0.2",
      "raptor-promises": "npm:raptor-promises@1.0.3",
      "raptor-regexp": "npm:raptor-regexp@1.0.1",
      "raptor-strings": "npm:raptor-strings@1.0.2",
      "raptor-util": "npm:raptor-util@1.0.10",
      "resolve-from": "npm:resolve-from@1.0.1",
      "sax": "npm:sax@0.6.1",
      "try-require": "npm:try-require@1.2.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:minimatch@0.2.14": {
      "lru-cache": "npm:lru-cache@2.7.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sigmund": "npm:sigmund@1.0.1"
    },
    "npm:page@1.6.4": {
      "path-to-regexp": "npm:path-to-regexp@1.2.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-to-regexp@1.2.1": {
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:q@1.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:raptor-args@1.0.2": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:raptor-async@1.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:raptor-dust@1.1.12": {
      "async-writer": "npm:async-writer@1.4.1",
      "raptor-util": "npm:raptor-util@1.0.10"
    },
    "npm:raptor-json@1.1.0": {
      "raptor-strings": "npm:raptor-strings@1.0.2"
    },
    "npm:raptor-logging@1.0.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "raptor-polyfill": "npm:raptor-polyfill@1.0.2",
      "raptor-stacktraces": "npm:raptor-stacktraces@1.0.1"
    },
    "npm:raptor-modules@1.1.2": {
      "app-module-path": "npm:app-module-path@1.0.4",
      "app-root-dir": "npm:app-root-dir@1.0.2",
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "raptor-async": "npm:raptor-async@1.1.2",
      "raptor-logging": "npm:raptor-logging@1.0.6",
      "raptor-polyfill": "npm:raptor-polyfill@1.0.2",
      "raptor-promises": "npm:raptor-promises@1.0.3",
      "raptor-util": "npm:raptor-util@1.0.10",
      "resolve-from": "npm:resolve-from@1.0.1",
      "through": "npm:through@2.3.8",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:raptor-promises@1.0.3": {
      "q": "npm:q@1.4.1",
      "raptor-util": "npm:raptor-util@1.0.10"
    },
    "npm:raptor-strings@1.0.2": {
      "raptor-polyfill": "npm:raptor-polyfill@1.0.2"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:resolve-from@1.0.1": {
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:sax@0.6.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:sigmund@1.0.1": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:through@2.3.8": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
