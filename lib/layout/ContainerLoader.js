'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRefetch = require('react-refetch');

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _Container = require('./Container.js');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loading = function Loading(_ref) {
  var spinnerUrl = _ref.spinnerUrl;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('img', { src: spinnerUrl })
  );
};

var failAndShowMessage = function failAndShowMessage(_ref2) {
  var onFailure = _ref2.onFailure,
      request = _ref2.request,
      message = _ref2.message;

  Boolean(onFailure) && onFailure({
    url: request.url,
    method: request.method,
    message: message
  });

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'p',
      null,
      message
    )
  );
};

var showMessage = function showMessage(message) {
  return failAndShowMessage({
    onFailure: function onFailure() {},
    request: {},
    message: message
  });
};

var ContainerLoader = function ContainerLoader(props) {
  var inProxy = props.inProxy,
      atlasUrl = props.atlasUrl,
      fail = props.fail,
      sourceUrlFetch = props.sourceUrlFetch;


  if (sourceUrlFetch.pending) {

    return _react2.default.createElement(Loading, { spinnerUrl: inProxy + (0, _urijs2.default)('resources/images/loading.gif', atlasUrl).toString() });
  } else if (sourceUrlFetch.rejected) {

    return failAndShowMessage({
      onFailure: fail,
      request: sourceUrlFetch.meta.request,
      message: 'Error: ' + (sourceUrlFetch.reason.message ? sourceUrlFetch.reason.message : 'Unknown cause, please contact arrayexpress-atlas@ebi.ac.uk')
    });
  } else if (sourceUrlFetch.fulfilled) {

    if (sourceUrlFetch.value.error) {
      return failAndShowMessage({
        onFailure: fail,
        request: sourceUrlFetch.meta.request,
        message: '' + sourceUrlFetch.value.error
      });
    } else if (!sourceUrlFetch.value.profiles) {
      return showMessage('Sorry, no results could be found matching your query.');
    } else {
      return _react2.default.createElement(_Container2.default, _extends({}, props, { data: sourceUrlFetch.value }));
    }
  }
};

ContainerLoader.propTypes = {
  inProxy: _propTypes2.default.string.isRequired,
  atlasUrl: _propTypes2.default.string.isRequired,
  sourceUrl: _propTypes2.default.string.isRequired,
  fail: _propTypes2.default.func
};

var _default = (0, _reactRefetch.connect)(function (props) {
  return {
    sourceUrlFetch: props.inProxy + (0, _urijs2.default)(props.sourceUrl, props.atlasUrl).toString()
  };
})(ContainerLoader);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Loading, 'Loading', 'src/layout/ContainerLoader.js');

  __REACT_HOT_LOADER__.register(failAndShowMessage, 'failAndShowMessage', 'src/layout/ContainerLoader.js');

  __REACT_HOT_LOADER__.register(showMessage, 'showMessage', 'src/layout/ContainerLoader.js');

  __REACT_HOT_LOADER__.register(ContainerLoader, 'ContainerLoader', 'src/layout/ContainerLoader.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/layout/ContainerLoader.js');
}();

;