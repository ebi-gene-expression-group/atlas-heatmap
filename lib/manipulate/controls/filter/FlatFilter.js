'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _xor = require('lodash/xor');

var _xor2 = _interopRequireDefault(_xor);

require('./Filter.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlatFilter = function (_React$Component) {
    _inherits(FlatFilter, _React$Component);

    function FlatFilter() {
        _classCallCheck(this, FlatFilter);

        return _possibleConstructorReturn(this, (FlatFilter.__proto__ || Object.getPrototypeOf(FlatFilter)).apply(this, arguments));
    }

    _createClass(FlatFilter, [{
        key: '_toggleFilterValue',
        value: function _toggleFilterValue(filterValueName) {
            this.props.onSelectFilterValue(this.props.name, (0, _xor2.default)(this.props.selected, [filterValueName]));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'gxaFilter' },
                _react2.default.createElement(
                    'h5',
                    null,
                    this.props.name
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'filterBody' },
                    _react2.default.createElement(
                        'div',
                        null,
                        this.props.values.map(function (value) {
                            return _react2.default.createElement(
                                'div',
                                { key: value.name },
                                _react2.default.createElement('input', { type: 'checkbox',
                                    value: value.name,
                                    onChange: function onChange() {
                                        return _this2._toggleFilterValue(value.name);
                                    },
                                    disabled: value.disabled,
                                    checked: _this2.props.selected.includes(value.name)
                                }),
                                _react2.default.createElement(
                                    'span',
                                    { style: { color: value.disabled ? 'grey' : '' } },
                                    value.name
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);

    return FlatFilter;
}(_react2.default.Component);

FlatFilter.propTypes = {
    name: _propTypes2.default.string.isRequired,
    values: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        disabled: _propTypes2.default.bool.isRequired
    })).isRequired,
    selected: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    onSelectFilterValue: _propTypes2.default.func.isRequired
};

var _default = FlatFilter;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(FlatFilter, 'FlatFilter', 'src/manipulate/controls/filter/FlatFilter.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/filter/FlatFilter.js');
}();

;