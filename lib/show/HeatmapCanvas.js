'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHighcharts = require('react-highcharts');

var _reactHighcharts2 = _interopRequireDefault(_reactHighcharts);

var _heatmap = require('highcharts/modules/heatmap');

var _heatmap2 = _interopRequireDefault(_heatmap);

var _highchartsCustomEvents = require('highcharts-custom-events');

var _highchartsCustomEvents2 = _interopRequireDefault(_highchartsCustomEvents);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _chartDataPropTypes = require('../manipulate/chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Highcharts = _reactHighcharts2.default.Highcharts;
(0, _heatmap2.default)(Highcharts);
(0, _highchartsCustomEvents2.default)(Highcharts);

// Custom Events default behaviour disables context menu on right-click, we bring it back
window.oncontextmenu = function () {
    return true;
};

var HeatmapCanvas = function (_React$Component) {
    _inherits(HeatmapCanvas, _React$Component);

    function HeatmapCanvas(props) {
        _classCallCheck(this, HeatmapCanvas);

        return _possibleConstructorReturn(this, (HeatmapCanvas.__proto__ || Object.getPrototypeOf(HeatmapCanvas)).call(this, props));
    }

    _createClass(HeatmapCanvas, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            // Callback that does setState fails: https://github.com/kirjs/react-highcharts/issues/245
            // Don’t call render again after zoom happens
            return _objectHash2.default.MD5([nextProps.heatmapData, nextProps.events.onClick]) !== _objectHash2.default.MD5([this.props.heatmapData, this.props.events.onClick]);
        }
    }, {
        key: '_countColumns',
        value: function _countColumns() {
            return this.props.heatmapData.xAxisCategories.length;
        }
    }, {
        key: '_getAdjustedMarginRight',
        value: function _getAdjustedMarginRight() {
            // TODO Should add extra margin if labels are slanted and last ones (3 or so?) are very long. See reference_experiment_single_gene.html
            var initialMarginRight = 60;
            return initialMarginRight * (1 + 10 / Math.pow(1 + this._countColumns(), 2));
        }
    }, {
        key: '_getAdjustedMarginTop',
        value: function _getAdjustedMarginTop() {
            var longestColumnLabelLength = Math.max.apply(Math, _toConsumableArray(this.props.heatmapData.xAxisCategories.map(function (category) {
                return category.label.length;
            })));

            // Minimum margins when labels aren’t tilted, -45° and -90° respectively see labels.autoRotation below
            var horizontalLabelsMarginTop = 30,
                tiltedLabelsMarginTop = 100,
                verticalLabelsMarginTop = 200;

            // TODO To know if the labels are actually rotated we must take into account the width of the chart and div

            if (this._countColumns() < 10) {
                return Math.max(horizontalLabelsMarginTop, Math.round(longestColumnLabelLength));
            } else if (this._countColumns() < 80) {
                return Math.max(tiltedLabelsMarginTop, Math.round(longestColumnLabelLength * 3.85));
            } else {
                return Math.max(verticalLabelsMarginTop, Math.round(longestColumnLabelLength * 5.5));
            }
        }
    }, {
        key: '_getAdjustedHeight',
        value: function _getAdjustedHeight(marginTop, marginBottom) {
            var rowsCount = this.props.heatmapData.yAxisCategories.length;
            var rowHeight = 30;
            return rowsCount * rowHeight + marginTop + marginBottom;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            // TODO Should the margins be recalculated when the window is resized?
            var marginBottom = 10;
            var marginTop = this._getAdjustedMarginTop();
            var marginRight = this._getAdjustedMarginRight();
            var height = this._getAdjustedHeight(marginTop, marginBottom);

            var _props = this.props,
                cellTooltipFormatter = _props.cellTooltipFormatter,
                xAxisFormatter = _props.xAxisFormatter,
                yAxisFormatter = _props.yAxisFormatter,
                events = _props.events,
                onZoom = _props.onZoom;


            var highchartsConfig = {
                chart: {
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    marginRight: marginRight,
                    height: height,
                    type: 'heatmap',
                    spacingTop: 0,
                    plotBorderWidth: 1,
                    events: {
                        handleGxaAnatomogramTissueMouseEnter: function handleGxaAnatomogramTissueMouseEnter(e) {
                            Highcharts.each(this.series, function (series) {
                                Highcharts.each(series.points, function (point) {
                                    if (point.series.xAxis.categories[point.x].id === e.svgPathId) {
                                        point.select(true, true);
                                    }
                                });
                            });
                        },
                        handleGxaAnatomogramTissueMouseLeave: function handleGxaAnatomogramTissueMouseLeave(e) {
                            var points = this.getSelectedPoints();
                            if (points.length > 0) {
                                Highcharts.each(points, function (point) {
                                    point.select(false);
                                });
                            }
                        }
                    },
                    zoomType: 'x'
                },

                plotOptions: {
                    heatmap: {
                        turboThreshold: 0
                    },

                    series: {
                        cursor: events.onClick ? 'pointer' : undefined,
                        point: {
                            events: {
                                click: events.onClick ? function () {
                                    events.onClick(this.x, this.y);
                                } : function () {}
                            }
                        },

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

                legend: {
                    enabled: false
                },

                title: null,

                colorAxis: this.props.colourAxis,

                xAxis: { //assay groups, contrasts, or factors across experiments
                    tickLength: 5,
                    tickColor: 'rgb(192, 192, 192)',
                    lineColor: 'rgb(192, 192, 192)',
                    labels: {
                        style: this.props.xAxisStyle,
                        // Events in labels enabled by 'highcharts-custom-events'
                        events: {
                            mouseover: function mouseover() {
                                events.onHoverColumn(this.value);
                            },
                            mouseout: function mouseout() {
                                events.onHoverOff();
                            }
                        },
                        autoRotation: [-45, -90],
                        formatter: function formatter() {
                            return xAxisFormatter(this.value);
                        }
                    },

                    opposite: 'true',
                    categories: this.props.heatmapData.xAxisCategories,
                    min: 0,
                    max: this._countColumns() - 1,

                    events: {
                        setExtremes: function setExtremes(event) {
                            onZoom(event.min !== undefined && event.max !== undefined);
                        }
                    }
                },

                yAxis: { //experiments or bioentities
                    useHTML: true,
                    reversed: true,
                    labels: {
                        style: this.props.yAxisStyle,
                        events: {
                            mouseover: function mouseover() {
                                events.onHoverRow(this.value);
                            },
                            mouseout: function mouseout() {
                                events.onHoverOff();
                            }
                        },
                        formatter: function formatter() {
                            return yAxisFormatter(this.value);
                        }
                    },

                    categories: this.props.heatmapData.yAxisCategories,
                    title: null,
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    endOnTick: false
                },

                tooltip: {
                    useHTML: true,
                    shared: false,
                    borderRadius: 0,
                    borderWidth: 0,
                    shadow: false,
                    enabled: true,
                    backgroundColor: 'none',
                    formatter: function formatter() {
                        return cellTooltipFormatter(this.series, this.point);
                    }
                },

                series: this.props.heatmapData.dataSeries.map(function (e) {
                    return {
                        name: e.info.name,
                        color: e.info.colour,
                        borderWidth: _this2._countColumns() > 200 ? 0 : 1,
                        borderColor: 'white',
                        data: e.data
                    };
                })
            };

            var maxWidthFraction = this._countColumns() > 6 ? 1 : Math.max(0.5, 1 - Math.exp(-(1 + 0.05 * Math.pow(1 + this._countColumns(), 2))));
            return _react2.default.createElement(
                'div',
                { style: { maxWidth: maxWidthFraction * 100 + '%', minWidth: '600px' } },
                _react2.default.createElement(_reactHighcharts2.default, { ref: function ref(_ref) {
                        return _this2.highchartsRef = _ref;
                    }, config: highchartsConfig })
            );
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var chart = this.highchartsRef.getChart();
            var forEachXNotInYsEmit = function forEachXNotInYsEmit(xs, ys, eventName) {
                xs.filter(function (id) {
                    return ys.indexOf(id) === -1;
                }).filter(function (id, ix, self) {
                    return ix === self.indexOf(id);
                }).forEach(function (id) {
                    Highcharts.fireEvent(chart, eventName, { svgPathId: id });
                });
            };
            forEachXNotInYsEmit(nextProps.ontologyIdsToHighlight, this.props.ontologyIdsToHighlight, 'handleGxaAnatomogramTissueMouseEnter');
            forEachXNotInYsEmit(this.props.ontologyIdsToHighlight, nextProps.ontologyIdsToHighlight, 'handleGxaAnatomogramTissueMouseLeave');
        }
    }]);

    return HeatmapCanvas;
}(_react2.default.Component);

HeatmapCanvas.propTypes = {
    heatmapData: _chartDataPropTypes.heatmapDataPropTypes.isRequired,
    colourAxis: _chartDataPropTypes.colourAxisPropTypes, // Only for experiment heatmap
    cellTooltipFormatter: _propTypes2.default.func.isRequired,
    xAxisFormatter: _propTypes2.default.func.isRequired,
    xAxisStyle: _propTypes2.default.object.isRequired,
    yAxisFormatter: _propTypes2.default.func.isRequired,
    yAxisStyle: _propTypes2.default.object.isRequired,
    events: _propTypes2.default.shape({
        onHoverRow: _propTypes2.default.func.isRequired,
        onHoverColumn: _propTypes2.default.func.isRequired,
        onHoverOff: _propTypes2.default.func.isRequired,
        onClick: _propTypes2.default.func
    }),
    onZoom: _propTypes2.default.func.isRequired
};

var _default = HeatmapCanvas;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Highcharts, 'Highcharts', 'src/show/HeatmapCanvas.js');

    __REACT_HOT_LOADER__.register(HeatmapCanvas, 'HeatmapCanvas', 'src/show/HeatmapCanvas.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/show/HeatmapCanvas.js');
}();

;