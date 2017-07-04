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

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

require('./TooltipStateManager.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                This class is a wrapper around react-tooltip that lets us have one big tooltip.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                The tooltip gets hidden when you hover off, and changes content when you change what you hover on.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Used to work with major hacks.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                After Alfonso rewrote it it has fewer hacks but doesn't work when you change hover between labels instead of on/off
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                The problems come from needing the frozen property which we won't soon - no column labels.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Currently unused and broken :(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                It will still be good for showing the gene tooltip which is a fine piece of work and high utility.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                TODO restore
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TooltipStateManager = function (_React$Component) {
    _inherits(TooltipStateManager, _React$Component);

    function TooltipStateManager(props) {
        _classCallCheck(this, TooltipStateManager);

        var _this = _possibleConstructorReturn(this, (TooltipStateManager.__proto__ || Object.getPrototypeOf(TooltipStateManager)).call(this, props));

        _this.state = {
            showTooltip: false,
            onHoverElementType: '',
            onHoverElementIndex: 0,
            tooltipFrozen: false
        };

        _this.onHover = _this._onHover.bind(_this);
        _this.onClick = _this._onClick.bind(_this);
        _this.getTooltipContent = _this._getTooltipContent.bind(_this);
        _this.dismissTooltip = _this._dismissTooltip.bind(_this);
        return _this;
    }

    _createClass(TooltipStateManager, [{
        key: '_dismissTooltip',
        value: function _dismissTooltip() {
            this.setState({ tooltipFrozen: false, showTooltip: false });
        }
    }, {
        key: '_onClick',
        value: function _onClick(elementType, elementIndex) {
            if (this.props.enableFreeze) {
                this.setState(function (previousState) {
                    var sameSelection = previousState.onHoverElementType === elementType && previousState.onHoverElementIndex === elementIndex;

                    return sameSelection ? { tooltipFrozen: !previousState.tooltipFrozen } : {
                        tooltipFrozen: true,
                        onHoverElementType: elementType,
                        onHoverElementIndex: elementIndex
                    };
                });
            }
        }
    }, {
        key: '_onHover',
        value: function _onHover(showTooltip, elementType, elementIndex) {
            if (!this.state.tooltipFrozen) {
                this.setState({
                    showTooltip: showTooltip,
                    onHoverElementType: elementType,
                    onHoverElementIndex: elementIndex
                });
            }
        }
    }, {
        key: '_getTooltipContent',
        value: function _getTooltipContent() {
            if (!this.state.showTooltip) {
                return null;
            }

            switch (this.state.onHoverElementType) {
                case 'xAxisLabel':
                    this.props.onHoverColumn(this.state.onHoverElementIndex);
                    return this.props.tooltips.column(this.state.onHoverElementIndex);
                case 'yAxisLabel':
                    this.props.onHoverRow(this.state.onHoverElementIndex);
                    return this.props.tooltips.row(this.state.onHoverElementIndex);
                // We let Highcharts manage the point formatter for now since we're not disappointed.
                // case `point`: ...
                default:
                    return null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var ManagedComponent = this.props.managedComponent;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { 'data-tip': true, 'data-for': 'gxaGlobalTooltipOverManagedComponent',
                        className: this.state.tooltipFrozen ? 'gxaFadeBackgroundForOpenTooltip' : '' },
                    _react2.default.createElement(ManagedComponent, _extends({}, this.props.managedComponentProps, {
                        onHover: this.onHover,
                        onClick: this.onClick
                    }))
                ),
                _react2.default.createElement(_reactTooltip2.default, { id: 'gxaGlobalTooltipOverManagedComponent',
                    type: 'light',
                    frozen: this.state.tooltipFrozen,
                    onClickOutside: this.props.enableFreeze ? this.dismissTooltip : undefined,
                    getContent: this.getTooltipContent,
                    place: 'bottom'
                })
            );
        }
    }]);

    return TooltipStateManager;
}(_react2.default.Component);

TooltipStateManager.props = {
    managedComponent: _propTypes2.default.any.isRequired,
    managedComponentProps: _propTypes2.default.object.isRequired,
    onHoverRow: _propTypes2.default.func.isRequired,
    onHoverColumn: _propTypes2.default.func.isRequired,
    onHoverPoint: _propTypes2.default.func.isRequired,
    tooltips: _propTypes2.default.shape({
        row: _propTypes2.default.func,
        column: _propTypes2.default.func,
        point: _propTypes2.default.func
    }).isRequired,
    enableFreeze: _propTypes2.default.bool.isRequired
};

var _default = TooltipStateManager;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(TooltipStateManager, 'TooltipStateManager', 'src/manipulate/tooltips/TooltipStateManager.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/tooltips/TooltipStateManager.js');
}();

;