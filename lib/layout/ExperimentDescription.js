'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExperimentDescription = function ExperimentDescription(props) {
    return _react2.default.createElement(
        'div',
        { style: { width: '100%', paddingBottom: '20px' } },
        _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'a',
                { target: '_blank', href: props.outProxy + props.experimentUrl },
                props.description
            )
        )
    );
};

ExperimentDescription.propTypes = {
    outProxy: _propTypes2.default.string.isRequired,
    experimentUrl: _propTypes2.default.string.isRequired,
    description: _propTypes2.default.string.isRequired
};

var _default = ExperimentDescription;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(ExperimentDescription, 'ExperimentDescription', 'src/layout/ExperimentDescription.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/layout/ExperimentDescription.js');
}();

;