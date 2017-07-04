'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

require('rc-slider/assets/index.css');

require('./CoexpressionOption.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CoexpressionOption = function (_React$Component) {
    _inherits(CoexpressionOption, _React$Component);

    function CoexpressionOption() {
        _classCallCheck(this, CoexpressionOption);

        return _possibleConstructorReturn(this, (CoexpressionOption.__proto__ || Object.getPrototypeOf(CoexpressionOption)).apply(this, arguments));
    }

    _createClass(CoexpressionOption, [{
        key: '_showOfferToDisplay',
        value: function _showOfferToDisplay() {
            var _this2 = this;

            return _react2.default.createElement(
                _Button2.default,
                { bsSize: 'xsmall', onClick: function onClick() {
                        return _this2.props.showCoexpressionsCallback(10);
                    } },
                _react2.default.createElement(_Glyphicon2.default, { glyph: 'th' }),
                _react2.default.createElement(
                    'span',
                    { style: { verticalAlign: 'middle' } },
                    ' Add similarly expressed genes'
                )
            );
        }
    }, {
        key: '_showSlider',
        value: function _showSlider() {
            var marks = {
                0: 'off',
                10: '10'
            };
            marks[this.props.numCoexpressionsAvailable] = this.props.numCoexpressionsAvailable;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'p',
                    null,
                    'Display genes with similar expression to ' + this.props.geneName + ':'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'gxaSlider' },
                    _react2.default.createElement(_rcSlider2.default, { min: 0,
                        max: this.props.numCoexpressionsAvailable,
                        onAfterChange: this.props.showCoexpressionsCallback,
                        marks: marks, included: false, defaultValue: this.props.numCoexpressionsVisible })
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'gxaDisplayCoexpressionOffer' },
                this.props.numCoexpressionsAvailable ? this.props.numCoexpressionsVisible ? this._showSlider() : this._showOfferToDisplay() : _react2.default.createElement(
                    'span',
                    null,
                    'No genes with similar expression to ' + this.props.geneName + ' available for display'
                )
            );
        }
    }]);

    return CoexpressionOption;
}(_react2.default.Component);

CoexpressionOption.propTypes = {
    geneName: _propTypes2.default.string.isRequired,
    numCoexpressionsVisible: _propTypes2.default.number.isRequired,
    numCoexpressionsAvailable: _propTypes2.default.number.isRequired,
    showCoexpressionsCallback: _propTypes2.default.func.isRequired
};

var _default = CoexpressionOption;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(CoexpressionOption, 'CoexpressionOption', 'src/manipulate/coexpression/CoexpressionOption.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/coexpression/CoexpressionOption.js');
}();

;