'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = function Footer(props) {
    return _react2.default.createElement(
        'div',
        { style: { clear: 'both', paddingTop: '40px' } },
        _react2.default.createElement(
            'a',
            { href: props.outProxy + props.moreInformationUrl },
            ' See more expression data at Expression Atlas.'
        ),
        _react2.default.createElement('br', null),
        'This expression view is provided by ',
        _react2.default.createElement(
            'a',
            { href: props.outProxy + props.atlasUrl },
            'Expression Atlas'
        ),
        '.',
        _react2.default.createElement('br', null),
        'Please send any queries or feedback to ',
        _react2.default.createElement(
            'a',
            { href: 'mailto:arrayexpress-atlas@ebi.ac.uk' },
            'arrayexpress-atlas@ebi.ac.uk'
        ),
        '.'
    );
};

Footer.propTypes = {
    outProxy: _propTypes2.default.string.isRequired,
    atlasUrl: _propTypes2.default.string.isRequired,
    moreInformationUrl: _propTypes2.default.string.isRequired
};

var _default = Footer;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Footer, 'Footer', 'src/layout/Footer.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/layout/Footer.js');
}();

;