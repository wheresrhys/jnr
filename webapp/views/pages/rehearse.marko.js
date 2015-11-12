function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __loadTemplate = __helpers.l,
      ___layout_marko = __loadTemplate(require.resolve("../layout.marko"), require),
      __renderer = __helpers.r,
      _________node_modules_marko_node_modules_marko_layout_use_tag_js = __renderer(require("marko/node_modules/marko-layout/use-tag")),
      __tag = __helpers.t,
      escapeXml = __helpers.x;

  return function render(data, out) {
    __tag(out,
      _________node_modules_marko_node_modules_marko_layout_use_tag_js,
      {
        "template": ___layout_marko,
        "getContent": function(__layoutHelper) {
          out.w(escapeXml(data.page));
        },
        "*": {
          "showHeader": true
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);