'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _xor = require('lodash/xor');

var _xor2 = _interopRequireDefault(_xor);

require('./Filter.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterOption = function (_React$Component) {
    _inherits(FilterOption, _React$Component);

    function FilterOption() {
        _classCallCheck(this, FilterOption);

        return _possibleConstructorReturn(this, (FilterOption.__proto__ || Object.getPrototypeOf(FilterOption)).apply(this, arguments));
    }

    _createClass(FilterOption, [{
        key: 'toggleAll',
        value: function toggleAll() {
            this.props.onNewSelected((0, _xor2.default)(this.props.values, this.props.selected).length ? this.props.values : []);
        }
    }, {
        key: 'toggleOne',
        value: function toggleOne(valueName) {
            this.props.onNewSelected((0, _xor2.default)(this.props.selected, [valueName]));
        }
    }, {
        key: 'toggleOpen',
        value: function toggleOpen() {
            this.props.onToggleOpen();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var allChecked = this.props.values.every(function (v) {
                return _this2.props.selected.includes(v);
            });
            var allUnchecked = this.props.values.every(function (v) {
                return !_this2.props.selected.includes(v);
            });

            // Indeterminate is only a visual state, logically they are unchecked
            return _react2.default.createElement(
                'div',
                { className: 'filterBody' },
                _react2.default.createElement('input', { type: 'checkbox',
                    value: this.props.name,
                    onChange: function onChange() {
                        return _this2.toggleAll();
                    },
                    checked: allChecked,
                    ref: function ref(checkbox) {
                        checkbox ? checkbox.indeterminate = !allChecked && !allUnchecked : null;
                    }
                }),
                _react2.default.createElement(
                    'div',
                    { className: 'groupName',
                        onClick: function onClick() {
                            return _this2.toggleOpen();
                        },
                        href: '#' },
                    this.props.name,
                    ' ',
                    _react2.default.createElement(_Glyphicon2.default, { style: { fontSize: 'x-small', paddingLeft: '5px' }, glyph: this.props.isOpen ? 'menu-up' : 'menu-down' })
                ),
                this.props.isOpen && _react2.default.createElement(
                    'div',
                    { className: 'options' },
                    this.props.values.map(function (value) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'option', key: value },
                            _react2.default.createElement('input', { type: 'checkbox',
                                value: value,
                                onChange: function onChange() {
                                    return _this2.toggleOne(value);
                                },
                                checked: _this2.props.selected.includes(value) }),
                            _react2.default.createElement(
                                'span',
                                null,
                                ' ',
                                value
                            )
                        );
                    })
                )
            );
        }
    }]);

    return FilterOption;
}(_react2.default.Component);

FilterOption.propTypes = {
    name: _propTypes2.default.string.isRequired,
    values: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    selected: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    isOpen: _propTypes2.default.bool.isRequired,
    onToggleOpen: _propTypes2.default.func.isRequired,
    onNewSelected: _propTypes2.default.func.isRequired
};

var GroupingFilter = function (_React$Component2) {
    _inherits(GroupingFilter, _React$Component2);

    function GroupingFilter(props) {
        _classCallCheck(this, GroupingFilter);

        var _this3 = _possibleConstructorReturn(this, (GroupingFilter.__proto__ || Object.getPrototypeOf(GroupingFilter)).call(this, props));

        _this3.state = {
            groupsUserAskedToKeepOpen: []
        };
        return _this3;
    }

    _createClass(GroupingFilter, [{
        key: '_renderValueGrouping',
        value: function _renderValueGrouping(name, values) {
            var _this4 = this;

            var userWantedOpen = this.state.groupsUserAskedToKeepOpen.includes(name);
            var selectedHere = this.props.selected.filter(function (e) {
                return values.includes(e);
            });
            var selectedNotHere = this.props.selected.filter(function (e) {
                return !values.includes(e);
            });
            // isOpen={userWantedOpen || impliedOpen} is a nifty idea, but the user loses focus and there are potentially
            // too many things going on we could think of using CSS animations (such as a background fading highlight on
            // the affected tissues to signal the interactions between subsystems)
            //const impliedOpen = !(selectedHere.length === 0 || values.every(v => selectedHere.includes(v)))
            return _react2.default.createElement(FilterOption, { key: name,
                name: name,
                values: values,
                selected: selectedHere,
                isOpen: userWantedOpen,
                onToggleOpen: function onToggleOpen() {
                    _this4.setState(function (previousState) {
                        return {
                            groupsUserAskedToKeepOpen: (0, _xor2.default)(previousState.groupsUserAskedToKeepOpen, [name])
                        };
                    });
                },
                onNewSelected: function onNewSelected(selectedInThisOption) {
                    _this4.props.onSelectFilterValue(_this4.props.name, selectedNotHere.concat(selectedInThisOption));
                } });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            return _react2.default.createElement(
                'div',
                { className: 'gxaFilter' },
                _react2.default.createElement(
                    'h5',
                    null,
                    this.props.name
                ),
                _react2.default.createElement(
                    _ButtonGroup2.default,
                    null,
                    _react2.default.createElement(
                        _Button2.default,
                        { bsSize: 'xsmall',
                            onClick: function onClick() {
                                _this5.props.onSelectFilterValue(_this5.props.name, _this5.props.values.map(function (value) {
                                    return value.name;
                                }));
                            },
                            style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                        _react2.default.createElement(_Glyphicon2.default, { glyph: 'plus' }),
                        _react2.default.createElement(
                            'span',
                            { style: { verticalAlign: 'middle' } },
                            ' Choose all'
                        )
                    ),
                    _react2.default.createElement(
                        _Button2.default,
                        { bsSize: 'xsmall',
                            onClick: function onClick() {
                                _this5.props.onSelectFilterValue(_this5.props.name, []);
                            },
                            style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                        _react2.default.createElement(_Glyphicon2.default, { glyph: 'minus' }),
                        _react2.default.createElement(
                            'span',
                            { style: { verticalAlign: 'middle' } },
                            ' Remove all'
                        )
                    )
                ),
                this.props.valueGroupings.map(function (a) {
                    return _this5._renderValueGrouping(a[0], a[1]);
                })
            );
        }
    }]);

    return GroupingFilter;
}(_react2.default.Component);

GroupingFilter.propTypes = {
    name: _propTypes2.default.string.isRequired,
    values: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        disabled: _propTypes2.default.bool.isRequired
    })).isRequired,
    valueGroupings: _propTypes2.default.array, // Indirectly validated as [string, array of strings] in FilterOption
    onSelectFilterValue: _propTypes2.default.func.isRequired
};

var _default = GroupingFilter;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(FilterOption, 'FilterOption', 'src/manipulate/controls/filter/GroupingFilter.js');

    __REACT_HOT_LOADER__.register(GroupingFilter, 'GroupingFilter', 'src/manipulate/controls/filter/GroupingFilter.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/filter/GroupingFilter.js');
}();

;