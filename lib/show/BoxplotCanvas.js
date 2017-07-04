'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHighcharts = require('react-highcharts');

var _reactHighcharts2 = _interopRequireDefault(_reactHighcharts);

var _highchartsMore = require('highcharts/highcharts-more');

var _highchartsMore2 = _interopRequireDefault(_highchartsMore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(0, _highchartsMore2.default)(_reactHighcharts2.default.Highcharts);

var BoxplotCanvas = function BoxplotCanvas(_ref) {
    var title = _ref.title,
        xAxisCategories = _ref.xAxisCategories,
        dataSeries = _ref.dataSeries,
        unit = _ref.unit;


    var initialMarginRight = 60;
    var marginRight = initialMarginRight * (1 + 10 / Math.pow(1 + xAxisCategories.length, 2));

    // We need to filter because Mat.min(undefined, <any number or anything whatsoever>) returns NaN
    var min = Math.min.apply(Math, _toConsumableArray(dataSeries.filter(function (quartiles) {
        return quartiles.length;
    }).map(function (quartiles) {
        return quartiles[0];
    })));
    var max = Math.max.apply(Math, _toConsumableArray(dataSeries.filter(function (quartiles) {
        return quartiles.length;
    }).map(function (quartiles) {
        return quartiles[4];
    })));

    // If no all five points are the same and we want to show the box plot with just points
    // const scatter = dataSeries.every(quartiles => _.uniq(quartiles).length === 1)

    var series = {
        name: 'Observations',
        data: dataSeries,
        tooltip: {
            headerFormat: '<em>Factor: {point.key}</em><br/>'
        }
    };

    var config = {
        chart: {
            marginRight: marginRight,
            type: 'boxplot',
            spacingRight: xAxisCategories.slice(-1)[0].length > 6 ? 100 : 0
        },

        plotOptions: {
            boxplot: {
                turboThreshold: 0
            },
            column: {
                dataLabels: {
                    crop: false
                }
            },
            series: {
                states: {
                    hover: {
                        color: '#eeec38' //#edab12 color cell on mouse over
                    },
                    select: {
                        color: '#eeec38'
                    }
                }
            }
        },

        credits: {
            enabled: false
        },

        title: {
            text: title
        },

        legend: {
            enabled: false
        },

        xAxis: {
            tickLength: 5,
            tickColor: 'rgb(192, 192, 192)',
            lineColor: 'rgb(192, 192, 192)',
            categories: xAxisCategories,
            labels: {
                style: {
                    fontSize: '9px'
                }
                // opposite: 'true'
            } },

        yAxis: {
            title: {
                text: 'Expression' + (unit ? ' (' + unit + ')' : '')
            },
            min: min,
            max: max
            // reversed: true
        },

        series: [series]
    };

    return _react2.default.createElement(_reactHighcharts2.default, { config: config });
};

BoxplotCanvas.propTypes = {
    title: _propTypes2.default.string.isRequired,
    xAxisCategories: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    dataSeries: _propTypes2.default.arrayOf(_propTypes2.default.arrayOf(_propTypes2.default.number)).isRequired,
    unit: _propTypes2.default.string.isRequired
};

var _default = BoxplotCanvas;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(BoxplotCanvas, 'BoxplotCanvas', 'src/show/BoxplotCanvas.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/show/BoxplotCanvas.js');
}();

;