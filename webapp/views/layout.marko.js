function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('`<!doctype html> <script src="/jspm_packages/system.js"></script><script src="/config.js"></script><script>\n    System.import(\'main.js\');\n  </script><a href="/tunes">tunes</a><a href="/learn">learn</a><a href="/rehearse">rehearse</a><a href="/sets">sets</a>`');
  };
}
(module.exports = require("marko").c(__filename)).c(create);