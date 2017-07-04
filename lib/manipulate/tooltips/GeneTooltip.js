'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GeneTooltip = function (_React$Component) {
  _inherits(GeneTooltip, _React$Component);

  function GeneTooltip(props) {
    _classCallCheck(this, GeneTooltip);

    var _this = _possibleConstructorReturn(this, (GeneTooltip.__proto__ || Object.getPrototypeOf(GeneTooltip)).call(this, props));

    _this.state = {
      loaded: !!_this.props.data,
      error: false,
      data: _this.props.data || {
        synonyms: [],
        goterms: [],
        interproterms: []
      }
    };
    return _this;
  }

  _createClass(GeneTooltip, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.loaded) {
        return;
      }
      // TODO Use react-refetch
      //https://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.props.atlasBaseURL + "/json/genename-tooltip?identifier=" + this.props.id, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          //request done
          if (xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            this.setState({ data: result, loaded: true });
            this.props.onAjaxSuccessfulCacheResult && this.props.onAjaxSuccessfulCacheResult(result);
          } else {
            this.setState({ error: xhr.status, loaded: true });
          }
        }
      }.bind(this);
      xhr.send();
    }
  }, {
    key: '_row',
    value: function _row(name, values) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'span',
          { className: 'propertyName' },
          name
        ),
        _react2.default.createElement(
          'span',
          { className: 'propertyValues' },
          values
        )
      );
    }
  }, {
    key: '_propertyValueList',
    value: function _propertyValueList(values) {
      return values.map(function (value) {
        return _react2.default.createElement(
          'span',
          { className: 'propertyValue', key: value },
          value
        );
      });
    }
  }, {
    key: '_bracketedList',
    value: function _bracketedList(values) {
      return values.length ? [_react2.default.createElement(
        'span',
        { key: '(' },
        "("
      )].concat(this._propertyValueList(values)).concat([_react2.default.createElement(
        'span',
        { key: ')' },
        ")"
      )]) : [];
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'gxaGeneTooltip' },
        this._row(this.props.label, this._bracketedList([].concat.apply([], [this.props.label].concat(this.state.data.synonyms).indexOf(this.props.id) === -1 ? [this.props.id] : [], this.state.data.synonyms))),
        this.props.designElement ? this._row("Design element:", this._propertyValueList([this.props.designElement])) : null,
        this.state.data.goterms.length ? this._row("Gene ontology terms:", this._propertyValueList(this.state.data.goterms)) : null,
        this.state.data.interproterms.length ? this._row("Interpro terms:", this._propertyValueList(this.state.data.interproterms)) : null,
        this.state.loading ? _react2.default.createElement(
          'div',
          null,
          '...'
        ) : null,
        this.state.error ? _react2.default.createElement(
          'div',
          null,
          "Error: " + this.state.error
        ) : null
      );
    }
  }]);

  return GeneTooltip;
}(_react2.default.Component);

GeneTooltip.propTypes = {
  atlasBaseURL: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.string.isRequired,
  id: _propTypes2.default.string.isRequired,
  designElement: _propTypes2.default.string,
  data: _propTypes2.default.shape({
    synonyms: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    goterms: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    interproterms: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
  }),
  onAjaxSuccessfulCacheResult: _propTypes2.default.func
};

var _default = GeneTooltip;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(GeneTooltip, 'GeneTooltip', 'src/manipulate/tooltips/GeneTooltip.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/tooltips/GeneTooltip.js');
}();

;