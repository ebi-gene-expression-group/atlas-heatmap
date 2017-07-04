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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenomeBrowsersDropdown = function (_React$Component) {
    _inherits(GenomeBrowsersDropdown, _React$Component);

    function GenomeBrowsersDropdown(props) {
        _classCallCheck(this, GenomeBrowsersDropdown);

        return _possibleConstructorReturn(this, (GenomeBrowsersDropdown.__proto__ || Object.getPrototypeOf(GenomeBrowsersDropdown)).call(this, props));
    }

    _createClass(GenomeBrowsersDropdown, [{
        key: 'handleChange',
        value: function handleChange(eventKey, event) {
            event.preventDefault();
            this.props.onSelect(eventKey);
        }
    }, {
        key: '_genomeBrowserIcon',
        value: function _genomeBrowserIcon(genomeBrowser) {
            switch (genomeBrowser) {
                case 'none':
                    return 'eye-close';
                default:
                    return 'eye-open';
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var genomeBrowsers = [{
                id: 'none',
                label: 'Select genome browser to view tracks'
            }].concat(_toConsumableArray(this.props.genomeBrowsers.map(function (genomeBrowserName) {
                return {
                    id: genomeBrowserName.replace(/\s+/g, '').toLowerCase(),
                    label: genomeBrowserName + ' genome browser'
                };
            })));

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Dropdown2.default,
                    { id: 'genome-browsers-dropdown',
                        onSelect: function onSelect(key, e) {
                            return _this2.handleChange(key, e);
                        },
                        title: 'Choose genome browser' },
                    _react2.default.createElement(
                        _Dropdown2.default.Toggle,
                        { bsSize: 'small',
                            style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                        _react2.default.createElement(_Glyphicon2.default, { glyph: this._genomeBrowserIcon(this.props.selected)
                        }),
                        ' ',
                        genomeBrowsers.find(function (gb) {
                            return _this2.props.selected === gb.id;
                        }).label
                    ),
                    _react2.default.createElement(
                        _Dropdown2.default.Menu,
                        { bsSize: 'small' },
                        genomeBrowsers.map(function (gb) {
                            return _react2.default.createElement(
                                _MenuItem2.default,
                                { style: { listStyleImage: 'none' }, key: gb.id, eventKey: gb.id, href: '#' },
                                gb.label
                            );
                        })
                    )
                )
            );
        }
    }]);

    return GenomeBrowsersDropdown;
}(_react2.default.Component);

GenomeBrowsersDropdown.propTypes = {
    genomeBrowsers: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    selected: _propTypes2.default.string,
    onSelect: _propTypes2.default.func
};

var _default = GenomeBrowsersDropdown;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(GenomeBrowsersDropdown, 'GenomeBrowsersDropdown', 'src/manipulate/controls/GenomeBrowsersDropdown.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/GenomeBrowsersDropdown.js');
}();

;