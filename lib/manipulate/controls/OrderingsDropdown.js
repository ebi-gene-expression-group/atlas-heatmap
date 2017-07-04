'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Dropdown = require('react-bootstrap/lib/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _MenuItem = require('react-bootstrap/lib/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrderingsDropdown = function (_React$Component) {
    _inherits(OrderingsDropdown, _React$Component);

    function OrderingsDropdown() {
        _classCallCheck(this, OrderingsDropdown);

        return _possibleConstructorReturn(this, (OrderingsDropdown.__proto__ || Object.getPrototypeOf(OrderingsDropdown)).apply(this, arguments));
    }

    _createClass(OrderingsDropdown, [{
        key: 'handleChange',
        value: function handleChange(eventKey, event) {
            event.preventDefault();
            this.props.onSelect(event.target.text);
        }
    }, {
        key: '_orderingIcon',
        value: function _orderingIcon(ordering) {
            switch (ordering) {
                case 'Alphabetical order':
                    return 'sort-by-alphabet';
                case 'Gene expression rank':
                    return 'sort-by-attributes-alt';
                case 'By experiment type':
                    return 'sort-by-order';
                default:
                    return 'sort-by-order';
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Dropdown2.default,
                    { id: 'orderings-dropdown',
                        onSelect: function onSelect(key, e) {
                            return _this2.handleChange(key, e);
                        },
                        title: this.props.zoom ? 'Reset zoom to enable sorting options' : '',
                        disabled: this.props.zoom || this.props.hasLessThanTwoRows },
                    _react2.default.createElement(
                        _Dropdown2.default.Toggle,
                        { bsSize: 'small',
                            style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                        _react2.default.createElement(_Glyphicon2.default, { glyph: this._orderingIcon(this.props.selected) }),
                        ' ',
                        this.props.selected
                    ),
                    _react2.default.createElement(
                        _Dropdown2.default.Menu,
                        { bsSize: 'small' },
                        this.props.orderings.map(function (orderingName) {
                            return _react2.default.createElement(
                                _MenuItem2.default,
                                { style: { listStyleImage: 'none' }, key: orderingName, href: '#' },
                                orderingName
                            );
                        })
                    )
                )
            );
        }
    }]);

    return OrderingsDropdown;
}(_react2.default.Component);

OrderingsDropdown.propTypes = {
    orderings: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    selected: _propTypes2.default.string.isRequired,
    onSelect: _propTypes2.default.func.isRequired,
    zoom: _propTypes2.default.bool.isRequired,
    hasLessThanTwoRows: _propTypes2.default.bool.isRequired
};

var _default = OrderingsDropdown;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(OrderingsDropdown, 'OrderingsDropdown', 'src/manipulate/controls/OrderingsDropdown.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/OrderingsDropdown.js');
}();

;