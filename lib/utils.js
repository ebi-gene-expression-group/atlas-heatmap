"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
};

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
var numberWithCommas = function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.numberWithCommas = numberWithCommas;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(capitalizeFirstLetter, "capitalizeFirstLetter", "src/utils.js");

    __REACT_HOT_LOADER__.register(numberWithCommas, "numberWithCommas", "src/utils.js");
}();

;