'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reactToHtml = function reactToHtml(component) {
    return _he2.default.decode(_server2.default.renderToStaticMarkup(component));
};

var YAxisLabel = function YAxisLabel(props) {
    var geneNameWithLink = _react2.default.createElement(
        'a',
        { href: props.config.outProxy + props.url },
        props.labelText
    );

    return props.extra ? _react2.default.createElement(
        'span',
        null,
        geneNameWithLink,
        _react2.default.createElement(
            'em',
            { style: { color: "black" } },
            '\t' + props.extra
        )
    ) : _react2.default.createElement(
        'span',
        null,
        geneNameWithLink
    );
};

YAxisLabel.propTypes = {
    config: _propTypes2.default.shape({
        atlasUrl: _propTypes2.default.string.isRequired,
        outProxy: _propTypes2.default.string.isRequired,
        isMultiExperiment: _propTypes2.default.bool.isRequired,
        isDifferential: _propTypes2.default.bool.isRequired,
        experiment: _propTypes2.default.shape({
            accession: _propTypes2.default.string.isRequired,
            type: _propTypes2.default.string.isRequired,
            relUrl: _propTypes2.default.string.isRequired,
            description: _propTypes2.default.string.isRequired,
            species: _propTypes2.default.string.isRequired
        })
    }).isRequired,
    labelText: _propTypes2.default.string.isRequired,
    resourceId: _propTypes2.default.string.isRequired,
    url: _propTypes2.default.string.isRequired,
    extra: _propTypes2.default.string
};

var _default = function _default(config) {
    return {
        xAxisFormatter: function xAxisFormatter(value) {
            return value.label;
        },
        xAxisStyle: {
            fontSize: config.isDifferential ? '9px' : 'smaller',
            cursor: 'default',
            textOverflow: config.experiment ? 'none' : 'ellipsis',
            whiteSpace: config.isDifferential ? 'normal' : 'nowrap'
        },

        yAxisFormatter: function yAxisFormatter(value) {
            return reactToHtml(_react2.default.createElement(YAxisLabel, { config: config,
                labelText: value.label,
                resourceId: value.id,
                url: value.info.url,
                extra: value.info.designElement || ''
            }));
        },
        yAxisStyle: {
            fontSize: config.isMultiExperiment ? 'smaller' : 'small',
            color: '#148ff3'
        }
    };
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(reactToHtml, 'reactToHtml', 'src/manipulate/formatters/axesFormatters.js');

    __REACT_HOT_LOADER__.register(YAxisLabel, 'YAxisLabel', 'src/manipulate/formatters/axesFormatters.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/formatters/axesFormatters.js');
}();

;