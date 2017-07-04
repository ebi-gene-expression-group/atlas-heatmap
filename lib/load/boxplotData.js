"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var quartilesFromExpression = function quartilesFromExpression(expression) {
  return expression.quartiles ? [expression.quartiles.min, expression.quartiles.lower, expression.quartiles.median, expression.quartiles.upper, expression.quartiles.max] : [];
};

var tryCreateBoxplotData = function tryCreateBoxplotData(_ref) {
  var dataRow = _ref.dataRow,
      columnHeaders = _ref.columnHeaders;

  var dataSeries = dataRow.expressions.map(quartilesFromExpression);

  if (dataSeries.map(function (e) {
    return e.length;
  }).reduce(function (l, r) {
    return l + r;
  }, 0)) {
    return {
      dataSeries: dataSeries,
      xAxisCategories: columnHeaders.map(function (header) {
        return header.factorValue;
      }),
      title: dataRow.name + " - " + dataRow.id,
      unit: dataRow.expressionUnit
    };
  } else {
    return null;
  }
};

var _default = function _default(_ref2) {
  var profiles = _ref2.profiles,
      columnHeaders = _ref2.columnHeaders;
  return profiles.rows.length === 1 ? tryCreateBoxplotData({ dataRow: profiles.rows[0], columnHeaders: columnHeaders }) : null;
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(quartilesFromExpression, "quartilesFromExpression", "src/load/boxplotData.js");

  __REACT_HOT_LOADER__.register(tryCreateBoxplotData, "tryCreateBoxplotData", "src/load/boxplotData.js");

  __REACT_HOT_LOADER__.register(_default, "default", "src/load/boxplotData.js");
}();

;