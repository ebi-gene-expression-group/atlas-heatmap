'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _Disclaimers = require('./Disclaimers.js');

var _Disclaimers2 = _interopRequireDefault(_Disclaimers);

var _Download = require('./Download.js');

var _Download2 = _interopRequireDefault(_Download);

var _chartDataPropTypes = require('../../../manipulate/chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DownloadButton = function (_React$Component) {
    _inherits(DownloadButton, _React$Component);

    function DownloadButton(props) {
        _classCallCheck(this, DownloadButton);

        var _this = _possibleConstructorReturn(this, (DownloadButton.__proto__ || Object.getPrototypeOf(DownloadButton)).call(this, props));

        _this.state = { showModal: false };

        _this.afterDownloadButtonClicked = _this._afterDownloadButtonClicked.bind(_this);
        _this.commenceDownloadAndCloseModal = _this._commenceDownloadAndCloseModal.bind(_this);
        _this.closeModal = _this._closeModal.bind(_this);
        return _this;
    }

    _createClass(DownloadButton, [{
        key: '_closeModal',
        value: function _closeModal() {
            this.setState({ showModal: false });
        }
    }, {
        key: '_disclaimer',
        value: function _disclaimer() {
            return this.props.disclaimer && _Disclaimers2.default[this.props.disclaimer] || { title: null, content: null };
        }
    }, {
        key: '_afterDownloadButtonClicked',
        value: function _afterDownloadButtonClicked() {
            if (!this._disclaimer().title && !this._disclaimer().content) {
                this._commenceDownload();
            } else {
                this.setState({ showModal: true });
            }
        }
    }, {
        key: '_commenceDownload',
        value: function _commenceDownload() {
            (0, _Download2.default)(this.props.download);
            typeof window.ga === 'function' && window.ga('atlas-highcharts-widget.send', 'event', 'HeatmapHighcharts', 'downloadData');
        }
    }, {
        key: '_commenceDownloadAndCloseModal',
        value: function _commenceDownloadAndCloseModal() {
            this._commenceDownload();
            this.closeModal();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'a',
                { onClick: this.afterDownloadButtonClicked },
                _react2.default.createElement(
                    _Button2.default,
                    { bsSize: 'small',
                        style: { textTransform: 'unset', letterSpacing: 'unset', height: 'unset' } },
                    _react2.default.createElement(_Glyphicon2.default, { glyph: 'download-alt' }),
                    ' Download table content'
                ),
                _react2.default.createElement(
                    _Modal2.default,
                    { show: this.state.showModal, onHide: this.closeModal },
                    _react2.default.createElement(
                        _Modal2.default.Header,
                        { closeButton: true },
                        _react2.default.createElement(
                            _Modal2.default.Title,
                            null,
                            this._disclaimer().title
                        )
                    ),
                    _react2.default.createElement(
                        _Modal2.default.Body,
                        null,
                        this._disclaimer().content
                    ),
                    _react2.default.createElement(
                        _Modal2.default.Footer,
                        null,
                        _react2.default.createElement(
                            _Button2.default,
                            { onClick: this._closeModal },
                            'Close'
                        ),
                        _react2.default.createElement(
                            _Button2.default,
                            { bsStyle: 'primary', onClick: this.commenceDownloadAndCloseModal },
                            'Continue downloading'
                        )
                    )
                )
            );
        }
    }]);

    return DownloadButton;
}(_react2.default.Component);

DownloadButton.propTypes = {
    download: _propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        descriptionLines: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
        heatmapData: _chartDataPropTypes.heatmapDataPropTypes
    }),
    disclaimer: _propTypes2.default.string.isRequired
};

var _default = DownloadButton;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(DownloadButton, 'DownloadButton', 'src/manipulate/controls/download-button/DownloadButton.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/download-button/DownloadButton.js');
}();

;