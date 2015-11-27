function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('function create(__helpers) { var str = __helpers.s, empty = __helpers.e,\nnotEmpty = __helpers.ne, forEachProp = __helpers.fp, attr = __helpers.a,\nescapeXml = __helpers.x; return function render(data, out) { out.w(\'potatoes\n<nav class="nav">\'); forEachProp(data.nav, function(name,urls) { out.w(\'<span><a class="nav__link" \' + attr("href", urls[0])>\' + escapeXml(name) + \'</a>&nbsp;</span>\'); }); out.w(\'</nav>\'); }; } (module.exports = require("marko").c(__filename)).c(create);');
  };
}
(module.exports = require("marko").c(__filename)).c(create);