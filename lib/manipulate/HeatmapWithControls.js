'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenomeBrowsersDropdown = require('./controls/GenomeBrowsersDropdown.js');

var _GenomeBrowsersDropdown2 = _interopRequireDefault(_GenomeBrowsersDropdown);

var _OrderingsDropdown = require('./controls/OrderingsDropdown.js');

var _OrderingsDropdown2 = _interopRequireDefault(_OrderingsDropdown);

var _FiltersModal = require('./controls/filter/FiltersModal.js');

var _FiltersModal2 = _interopRequireDefault(_FiltersModal);

var _DownloadButton = require('./controls/download-button/DownloadButton.js');

var _DownloadButton2 = _interopRequireDefault(_DownloadButton);

var _HeatmapCanvas = require('../show/HeatmapCanvas.js');

var _HeatmapCanvas2 = _interopRequireDefault(_HeatmapCanvas);

var _heatmapCellTooltipFormatter = require('./formatters/heatmapCellTooltipFormatter.js');

var _heatmapCellTooltipFormatter2 = _interopRequireDefault(_heatmapCellTooltipFormatter);

var _axesFormatters2 = require('./formatters/axesFormatters.js');

var _axesFormatters3 = _interopRequireDefault(_axesFormatters2);

var _Main = require('./heatmap-legend/Main.js');

var _CoexpressionOption = require('./coexpression/CoexpressionOption.js');

var _CoexpressionOption2 = _interopRequireDefault(_CoexpressionOption);

var _Events = require('./Events.js');

var _Events2 = _interopRequireDefault(_Events);

var _Manipulators = require('./Manipulators.js');

var _chartDataPropTypes = require('../manipulate/chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeatmapWithControls = function (_React$Component) {
    _inherits(HeatmapWithControls, _React$Component);

    function HeatmapWithControls(props) {
        _classCallCheck(this, HeatmapWithControls);

        return _possibleConstructorReturn(this, (HeatmapWithControls.__proto__ || Object.getPrototypeOf(HeatmapWithControls)).call(this, props));
    }

    _createClass(HeatmapWithControls, [{
        key: '_getSelectedExpressionLevelFilters',
        value: function _getSelectedExpressionLevelFilters() {
            var _this2 = this;

            return this.props.selectedFilters.find(function (selectedFilter) {
                return selectedFilter.name === _this2.props.expressionLevelFilters.name;
            }).valueNames;
        }
    }, {
        key: '_getSelectedOrdering',
        value: function _getSelectedOrdering() {
            var _this3 = this;

            var selectedOrderingKey = Object.keys(this.props.orderings).find(function (orderingKey) {
                return _this3.props.orderings[orderingKey].name === _this3.props.selectedOrderingName;
            });
            return this.props.orderings[selectedOrderingKey];
        }
    }, {
        key: '_heatmapDataToPresent',
        value: function _heatmapDataToPresent() {
            var _this4 = this;

            return (0, _Manipulators.manipulate)({
                //this.state.selectedHeatmapFilters
                //.find(selectedFilter => selectedFilter.name === this.props.chartData.expressionLevelFilters.name)
                //.valueNames
                keepSeries: function keepSeries(series) {
                    return _this4.props.selectedFilters[0].valueNames.includes(series.info.name);
                },
                keepRow: this.props.heatmapConfig.coexpressionsAvailable ? function (rowHeader) {
                    return _this4._rowHeadersThatCoexpressionSliderSaysWeCanInclude().includes(rowHeader.label);
                } : function () {
                    return true;
                },
                keepColumn: this.props.groupingFilters.length > 0 ? function (columnHeader) {
                    return _this4._columnHeadersThatColumnGroupingFiltersSayWeCanInclude().includes(columnHeader.label);
                } : function () {
                    return true;
                },
                ordering: this._getSelectedOrdering(),
                allowEmptyColumns: Boolean(this.props.heatmapConfig.experiment)
            }, this.props.heatmapData);
        }
    }, {
        key: '_rowHeadersThatCoexpressionSliderSaysWeCanInclude',
        value: function _rowHeadersThatCoexpressionSliderSaysWeCanInclude() {
            // to keep up with the quirky function names
            return this.props.heatmapData.yAxisCategories.slice(0, this.props.coexpressionsShown + 1).map(function (yAxisCategory) {
                return yAxisCategory.label;
            });
        }
    }, {
        key: '_columnHeadersThatColumnGroupingFiltersSayWeCanInclude',
        value: function _columnHeadersThatColumnGroupingFiltersSayWeCanInclude() {
            // In experiment heatmaps no Anatomical Systems filter are available, but they are built nonetheless and every
            // grouping filter is selected by default, so all columns are included
            var groupingFilterNames = this.props.groupingFilters.filter(function (filter) {
                return filter.valueGroupings.length > 0;
            }).map(function (groupingFilter) {
                return groupingFilter.name;
            });

            return this.props.selectedFilters.filter(function (selectedFilter) {
                return groupingFilterNames.includes(selectedFilter.name);
            }).reduce(function (acc, selectedGroupingFilter) {
                return [].concat(_toConsumableArray(acc), _toConsumableArray(selectedGroupingFilter.valueNames));
            }, []);
        }
    }, {
        key: '_renderOrderings',
        value: function _renderOrderings(heatmapDataToPresent) {
            var _this5 = this;

            return this.props.heatmapConfig.isMultiExperiment ? _react2.default.createElement(
                'div',
                { style: { display: 'inline-block', padding: '5px' } },
                _react2.default.createElement(_OrderingsDropdown2.default, {
                    orderings: Object.keys(this.props.orderings).map(function (orderingKey) {
                        return _this5.props.orderings[orderingKey].name;
                    }),
                    selected: this.props.selectedOrderingName,
                    onSelect: this.props.onSelectOrdering,
                    zoom: this.props.zoom,
                    hasLessThanTwoRows: heatmapDataToPresent.yAxisCategories.length < 2
                })
            ) : null;
        }
    }, {
        key: '_renderFilters',
        value: function _renderFilters() {
            return this.props.heatmapConfig.isMultiExperiment ? _react2.default.createElement(
                'div',
                { style: { display: 'inline-block', padding: '5px' } },
                _react2.default.createElement(_FiltersModal2.default, { filters: [this.props.expressionLevelFilters].concat(_toConsumableArray(this.props.groupingFilters)),
                    selectedFilters: this.props.selectedFilters,
                    onSelectFilters: this.props.onSelectFilters,
                    disabled: this.props.zoom
                })
            ) : null;
        }
    }, {
        key: '_renderDownloadButton',
        value: function _renderDownloadButton(heatmapDataToPresent) {
            var downloadOptions = {
                download: {
                    name: this.props.heatmapConfig.shortDescription || "download",
                    descriptionLines: [this.props.heatmapConfig.description].concat(_toConsumableArray(this.props.selectedOrderingName ? ['Ordering: ' + this.props.selectedOrderingName] : []), _toConsumableArray(this.props.heatmapConfig.coexpressionsAvailable ? ['Including ' + this.props.coexpressionsShown + ' genes with similar expression pattern'] : [])),
                    heatmapData: heatmapDataToPresent
                },
                disclaimer: this.props.heatmapConfig.disclaimer
            };

            return _react2.default.createElement(
                'div',
                { style: { display: 'inline-block', padding: '5px' } },
                _react2.default.createElement(_DownloadButton2.default, downloadOptions)
            );
        }
    }, {
        key: '_renderGenomeBrowserSelect',
        value: function _renderGenomeBrowserSelect() {
            return this.props.heatmapConfig.genomeBrowsers.length ? _react2.default.createElement(
                'div',
                { style: { display: 'inline-block', padding: '5px' } },
                _react2.default.createElement(_GenomeBrowsersDropdown2.default, { genomeBrowsers: this.props.heatmapConfig.genomeBrowsers,
                    selected: this.props.selectedGenomeBrowser,
                    onSelect: this.props.onSelectGenomeBrowser })
            ) : null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var heatmapDataToPresent = this._heatmapDataToPresent();

            var _axesFormatters = (0, _axesFormatters3.default)(this.props.heatmapConfig),
                yAxisStyle = _axesFormatters.yAxisStyle,
                yAxisFormatter = _axesFormatters.yAxisFormatter,
                xAxisStyle = _axesFormatters.xAxisStyle,
                xAxisFormatter = _axesFormatters.xAxisFormatter;

            var heatmapProps = {
                heatmapData: heatmapDataToPresent,
                colourAxis: this.props.colourAxis,
                cellTooltipFormatter: (0, _heatmapCellTooltipFormatter2.default)(this.props.heatmapConfig),
                yAxisStyle: yAxisStyle,
                yAxisFormatter: yAxisFormatter,
                xAxisStyle: xAxisStyle,
                xAxisFormatter: xAxisFormatter,
                onZoom: this.props.onZoom,
                ontologyIdsToHighlight: this.props.ontologyIdsToHighlight,
                events: (0, _Events2.default)({
                    heatmapData: heatmapDataToPresent,
                    onSelectOntologyIds: this.props.onOntologyIdIsUnderFocus,
                    genomeBrowser: this.props.selectedGenomeBrowser,
                    experimentAccession: this.props.heatmapConfig.experiment && this.props.heatmapConfig.experiment.accession,
                    accessKey: this.props.heatmapConfig.experiment && this.props.heatmapConfig.experiment.accessKey,
                    atlasUrl: this.props.heatmapConfig.atlasUrl
                })
            };

            var infoMessages = this.props.selectedGenomeBrowser === 'none' ? ['hoo'] : ['Click on a cell to open the selected genome browser with attached tracks if available'];
            var info = infoMessages.map(function (item) {
                return _react2.default.createElement(
                    'p',
                    { key: item, style: { clear: 'both', float: 'right', fontSize: 'small', margin: '0' } },
                    item
                );
            });

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        { style: { float: 'left', lineHeight: '2.5rem', padding: '0.5rem 0' } },
                        this.props.heatmapConfig.introductoryMessage
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: { float: 'right', padding: '0.5rem 0' } },
                        this._renderGenomeBrowserSelect(),
                        this._renderOrderings(heatmapDataToPresent),
                        this._renderFilters(),
                        this._renderDownloadButton(heatmapDataToPresent)
                    ),
                    _react2.default.createElement(
                        'p',
                        { style: { clear: 'both', float: 'right', fontSize: 'small', margin: '0',
                                visibility: this.props.selectedGenomeBrowser === 'none' ? 'hidden' : ' visible' } },
                        'Click on a cell to open the selected genome browser with attached tracks if available'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { style: { clear: 'both' } },
                    heatmapProps.heatmapData.yAxisCategories < 1 ? _react2.default.createElement(
                        'div',
                        { style: { padding: '50px 0' } },
                        'No data match your filtering criteria or your original query. Please, change your query or your filters and try again.'
                    ) : this.props.heatmapConfig.isMultiExperiment ? _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(_HeatmapCanvas2.default, heatmapProps),
                        _react2.default.createElement(_Main.DataSeriesLegend, {
                            dataSeries: this.props.heatmapData.dataSeries,
                            selectedExpressionLevelFilters: this._getSelectedExpressionLevelFilters()
                        })
                    ) : _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(_Main.GradientLegend, {
                            heatmapConfig: this.props.heatmapConfig,
                            colourAxis: this.props.colourAxis
                        }),
                        _react2.default.createElement(_HeatmapCanvas2.default, heatmapProps)
                    ),
                    this.props.heatmapConfig.coexpressionsAvailable && !this.props.heatmapConfig.isWidget ? _react2.default.createElement(_CoexpressionOption2.default, { geneName: this.props.heatmapData.yAxisCategories[0].label,
                        numCoexpressionsVisible: this.props.coexpressionsShown,
                        numCoexpressionsAvailable: this.props.heatmapData.yAxisCategories.length - 1,
                        showCoexpressionsCallback: function showCoexpressionsCallback(e) {
                            return _this6.props.onCoexpressionOptionChange(e);
                        }
                    }) : null
                )
            );
        }
    }]);

    return HeatmapWithControls;
}(_react2.default.Component);

HeatmapWithControls.propTypes = {
    heatmapConfig: _chartDataPropTypes.heatmapConfigPropTypes.isRequired,
    heatmapData: _chartDataPropTypes.heatmapDataPropTypes.isRequired,
    colourAxis: _chartDataPropTypes.colourAxisPropTypes, // Only available in experiment heatmap

    orderings: _chartDataPropTypes.orderingsPropTypesValidator,
    selectedOrderingName: _propTypes2.default.string.isRequired,
    onSelectOrdering: _propTypes2.default.func.isRequired,

    expressionLevelFilters: _chartDataPropTypes.filterPropTypes.isRequired,
    groupingFilters: _propTypes2.default.arrayOf(_chartDataPropTypes.filterPropTypes).isRequired,
    selectedFilters: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        valueNames: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
    })).isRequired,
    onSelectFilters: _propTypes2.default.func.isRequired,

    selectedGenomeBrowser: _propTypes2.default.string,
    onSelectGenomeBrowser: _propTypes2.default.func,

    legendItems: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        key: _propTypes2.default.string.isRequired,
        name: _propTypes2.default.string.isRequired,
        colour: _propTypes2.default.string.isRequired,
        on: _propTypes2.default.bool.isRequired
    })),

    dataSeriesLegendProps: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        key: _propTypes2.default.string.isRequired,
        name: _propTypes2.default.string.isRequired,
        colour: _propTypes2.default.string.isRequired,
        on: _propTypes2.default.bool.isRequired
    })),

    gradientLegendProps: _chartDataPropTypes.colourAxisPropTypes,

    coexpressionsShown: _propTypes2.default.number,
    onCoexpressionOptionChange: _propTypes2.default.func,

    zoom: _propTypes2.default.bool.isRequired,
    onZoom: _propTypes2.default.func,
    ontologyIdsToHighlight: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    onOntologyIdIsUnderFocus: _propTypes2.default.func.isRequired
};

var _default = HeatmapWithControls;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(HeatmapWithControls, 'HeatmapWithControls', 'src/manipulate/HeatmapWithControls.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/HeatmapWithControls.js');
}();

;