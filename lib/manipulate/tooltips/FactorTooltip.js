"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propertyRow = function propertyRow(property) {
  if (!property.testValue) {
    return null;
  }

  function isFactor(property) {
    return property.contrastPropertyType === "FACTOR";
  }

  var style = { whiteSpace: "normal" };

  if (isFactor(property)) {
    style["fontWeight"] = "bold";
  } else {
    style["color"] = "gray";
  }

  return _react2.default.createElement(
    "tr",
    { key: property.propertyName },
    _react2.default.createElement(
      "td",
      { style: style },
      property.propertyName
    ),
    _react2.default.createElement(
      "td",
      { style: style },
      property.testValue
    )
  );
};

var FactorTooltip = function FactorTooltip(props) {
  var propertyNames = props.properties.map(function (e) {
    return e.propertyName;
  }).filter(function (e, ix, self) {
    return self.indexOf(e) === ix;
  });

  return _react2.default.createElement(
    "div",
    { className: "gxaFactorTooltip" },
    _react2.default.createElement(
      "table",
      null,
      _react2.default.createElement(
        "thead",
        null,
        _react2.default.createElement(
          "tr",
          null,
          _react2.default.createElement(
            "th",
            null,
            "Property"
          ),
          _react2.default.createElement(
            "th",
            null,
            "Value",
            props.replicates ? " (N=" + props.replicates + ")" : ""
          )
        )
      ),
      _react2.default.createElement(
        "tbody",
        null,
        propertyNames.map(function (propertyName) {
          var values = props.properties.filter(function (e) {
            return e.propertyName === propertyName;
          }).map(function (e) {
            return e.testValue;
          }).filter(function (e, ix, self) {
            return self.indexOf(e) === ix;
          });

          return {
            propertyName: propertyName,
            testValue: values.length ? values.reduce(function (l, r) {
              return l + ", " + r;
            }) : ""
          };
        }).map(propertyRow)
      )
    )
  );
};

var _default = FactorTooltip;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(propertyRow, "propertyRow", "src/manipulate/tooltips/FactorTooltip.js");

  __REACT_HOT_LOADER__.register(FactorTooltip, "FactorTooltip", "src/manipulate/tooltips/FactorTooltip.js");

  __REACT_HOT_LOADER__.register(_default, "default", "src/manipulate/tooltips/FactorTooltip.js");
}();

;