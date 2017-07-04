'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _HeatmapWithControls = require('./HeatmapWithControls.js');

var _HeatmapWithControls2 = _interopRequireDefault(_HeatmapWithControls);

var _BoxplotCanvas = require('../show/BoxplotCanvas.js');

var _BoxplotCanvas2 = _interopRequireDefault(_BoxplotCanvas);

var _chartDataPropTypes = require('./chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Heatmap = (0, _uncontrollable2.default)(_HeatmapWithControls2.default, {
    selectedGenomeBrowser: 'onSelectGenomeBrowser',
    selectedOrderingName: 'onSelectOrdering',
    selectedFilters: 'onSelectFilters',
    coexpressionsShown: 'onCoexpressionOptionChange',
    zoom: 'onZoom'
});
//starting values on component creation, managed by uncontrollable later
var heatmapDefaults = function heatmapDefaults(_ref) {
    var orderings = _ref.orderings,
        expressionLevelFilters = _ref.expressionLevelFilters,
        groupingFilters = _ref.groupingFilters,
        heatmapConfig = _ref.heatmapConfig;
    return {
        defaultSelectedGenomeBrowser: 'none',
        defaultSelectedOrderingName: orderings.default.name,
        defaultSelectedFilters: [expressionLevelFilters].concat(_toConsumableArray(groupingFilters)).map(function (filter) {
            return {
                name: filter.name,
                valueNames: filter.values.filter(function (fv) {
                    return !fv.disabled;
                }).map(function (fv) {
                    return fv.name;
                }) // Deep copy from props
            };
        }),
        defaultCoexpressionsShown: 0,
        defaultZoom: false
    };
};

var ChartContainer = function (_React$Component) {
    _inherits(ChartContainer, _React$Component);

    function ChartContainer(props) {
        _classCallCheck(this, ChartContainer);

        var _this = _possibleConstructorReturn(this, (ChartContainer.__proto__ || Object.getPrototypeOf(ChartContainer)).call(this, props));

        _this.state = {
            chartType: 'heatmap'
        };

        _this.handleClick = _this._handleClick.bind(_this);
        return _this;
    }

    _createClass(ChartContainer, [{
        key: '_theOtherChartType',
        value: function _theOtherChartType() {
            return this.state.chartType === 'heatmap' ? 'boxplot' : 'heatmap';
        }
    }, {
        key: '_handleClick',
        value: function _handleClick(e) {
            e.preventDefault();
            this.setState({ chartType: this._theOtherChartType() });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                this.props.chartData.boxplotData && _react2.default.createElement(
                    'a',
                    { href: '#', onClick: this.handleClick },
                    'Switch to ' + this._theOtherChartType() + ' view'
                ),
                _react2.default.createElement(
                    'div',
                    { className: this.state.chartType === 'heatmap' ? '' : 'hidden' },
                    _react2.default.createElement(Heatmap, _extends({
                        ontologyIdsToHighlight: this.props.ontologyIdsToHighlight,
                        onOntologyIdIsUnderFocus: this.props.onOntologyIdIsUnderFocus
                    }, this.props.chartData, heatmapDefaults(this.props.chartData)))
                ),
                this.props.chartData.boxplotData && _react2.default.createElement(
                    'div',
                    { className: this.state.chartType === 'boxplot' ? '' : 'hidden' },
                    _react2.default.createElement(_BoxplotCanvas2.default, this.props.chartData.boxplotData)
                )
            );
        }
    }]);

    return ChartContainer;
}(_react2.default.Component);

ChartContainer.propTypes = {
    chartData: _chartDataPropTypes.chartDataPropTypes.isRequired,
    ontologyIdsToHighlight: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    onOntologyIdIsUnderFocus: _propTypes2.default.func.isRequired
};

var _default = ChartContainer;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Heatmap, 'Heatmap', 'src/manipulate/ChartContainer.js');

    __REACT_HOT_LOADER__.register(heatmapDefaults, 'heatmapDefaults', 'src/manipulate/ChartContainer.js');

    __REACT_HOT_LOADER__.register(ChartContainer, 'ChartContainer', 'src/manipulate/ChartContainer.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/ChartContainer.js');
}();

;