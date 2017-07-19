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

var _Modal = require('react-bootstrap/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _FlatFilter = require('./FlatFilter.js');

var _FlatFilter2 = _interopRequireDefault(_FlatFilter);

var _GroupingFilter = require('./GroupingFilter.js');

var _GroupingFilter2 = _interopRequireDefault(_GroupingFilter);

var _chartDataPropTypes = require('../../../manipulate/chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FiltersModal = function (_React$Component) {
    _inherits(FiltersModal, _React$Component);

    function FiltersModal(props) {
        _classCallCheck(this, FiltersModal);

        var _this = _possibleConstructorReturn(this, (FiltersModal.__proto__ || Object.getPrototypeOf(FiltersModal)).call(this, props));

        _this.state = {
            currentTab: _this.props.filters[0].name,
            showModal: false
        };

        _this.open = _this._open.bind(_this);
        _this.close = _this._close.bind(_this);
        _this.onSelectFilterValue = _this._onSelectFilterValue.bind(_this);
        return _this;
    }

    _createClass(FiltersModal, [{
        key: '_close',
        value: function _close() {
            this.setState({
                showModal: false
            });
        }
    }, {
        key: '_open',
        value: function _open() {
            this.setState({
                showModal: true
            });
        }
    }, {
        key: '_onSelectFilterValue',
        value: function _onSelectFilterValue(filterName, newFilterValues) {
            this.props.onSelectFilters(this.props.selectedFilters.map(function (previousSelectedFilter) {
                return {
                    name: previousSelectedFilter.name,
                    valueNames: previousSelectedFilter.name === filterName ? newFilterValues : previousSelectedFilter.valueNames.map(function (valueName) {
                        return valueName;
                    })
                };
            }));
        }
    }, {
        key: '_renderFlatFilter',
        value: function _renderFlatFilter(filter) {
            return _react2.default.createElement(_FlatFilter2.default, _extends({ key: filter.name,
                selected: this.props.selectedFilters.find(function (selectedFilter) {
                    return selectedFilter.name === filter.name;
                }).valueNames,
                onSelectFilterValue: this.onSelectFilterValue
            }, filter));
        }
    }, {
        key: '_renderGroupingFilter',
        value: function _renderGroupingFilter(filter) {
            return _react2.default.createElement(_GroupingFilter2.default, _extends({ key: filter.name,
                selected: this.props.selectedFilters.find(function (selectedFilter) {
                    return selectedFilter.name === filter.name;
                }).valueNames,
                onSelectFilterValue: this.onSelectFilterValue
            }, filter));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Button2.default,
                    { bsSize: 'small', onClick: this.open, disabled: this.props.disabled,
                        title: this.props.disabled ? 'Reset zoom to enable filters' : '',
                        style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                    _react2.default.createElement(_Glyphicon2.default, { glyph: 'equalizer' }),
                    _react2.default.createElement(
                        'span',
                        { style: { verticalAlign: 'middle' } },
                        ' Filters'
                    )
                ),
                _react2.default.createElement(
                    _Modal2.default,
                    { show: this.state.showModal, onHide: this.close, bsSize: 'large' },
                    _react2.default.createElement(
                        _Modal2.default.Header,
                        { closeButton: true },
                        this.props.filters.length > 1 ? _react2.default.createElement(
                            'ul',
                            { className: 'nav nav-tabs' },
                            this.props.filters.map(function (f) {
                                return _react2.default.createElement(
                                    'li',
                                    { key: f.name,
                                        className: f.name == _this2.state.currentTab ? "active" : "" },
                                    _react2.default.createElement(
                                        'a',
                                        { href: '#', onClick: function onClick() {
                                                _this2.setState({ currentTab: f.name });
                                            } },
                                        f.name
                                    )
                                );
                            })
                        ) : _react2.default.createElement(
                            'h4',
                            { className: 'modal-title' },
                            ' Filters '
                        )
                    ),
                    _react2.default.createElement(
                        _Modal2.default.Body,
                        null,
                        this.props.filters.filter(function (filter) {
                            return filter.name == _this2.state.currentTab;
                        }).map(function (filter) {
                            return filter.valueGroupings ? _this2._renderGroupingFilter(filter) : _this2._renderFlatFilter(filter);
                        })
                    ),
                    _react2.default.createElement(
                        _Modal2.default.Footer,
                        null,
                        _react2.default.createElement(
                            _Button2.default,
                            { onClick: this.close,
                                style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                            'Close'
                        )
                    )
                )
            );
        }
    }]);

    return FiltersModal;
}(_react2.default.Component);

FiltersModal.propTypes = {
    filters: _propTypes2.default.arrayOf(_chartDataPropTypes.filterPropTypes).isRequired,
    selectedFilters: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        valueNames: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
    })).isRequired,

    disabled: _propTypes2.default.bool.isRequired,
    onSelectFilters: _propTypes2.default.func.isRequired
};

var _default = FiltersModal;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(FiltersModal, 'FiltersModal', 'src/manipulate/controls/filter/FiltersModal.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/filter/FiltersModal.js');
}();

;