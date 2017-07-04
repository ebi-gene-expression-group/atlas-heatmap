'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUnits = exports.isRnaSeqBaseline = exports.isBaseline = exports.isDifferential = exports.isMultiExperiment = exports.experimentPropTypes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var experimentPropTypes = _propTypes2.default.shape({
    accession: _propTypes2.default.string.isRequired, // Is it worth to enumerate the experiment types?
    type: _propTypes2.default.string.isRequired,
    relUrl: _propTypes2.default.string.isRequired,
    description: _propTypes2.default.string.isRequired,
    species: _propTypes2.default.string.isRequired,
    accessKey: _propTypes2.default.string.isRequired
});

var isMultiExperiment = function isMultiExperiment(experiment) {
    return !Boolean(experiment);
};

// From ExperimentType.java:
// RNASEQ_MRNA_BASELINE("rnaseq_mrna_baseline")
// RNASEQ_MRNA_DIFFERENTIAL("rnaseq_mrna_differential")
// MICROARRAY_ANY("microarray parent type")
// MICROARRAY_1COLOUR_MRNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_1colour_mrna_differential")
// MICROARRAY_2COLOUR_MRNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_2colour_mrna_differential")
// MICROARRAY_1COLOUR_MICRORNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_1colour_microrna_differential")
// PROTEOMICS_BASELINE("proteomics_baseline")
// SINGLE_CELL_RNASEQ_MRNA_BASELINE("scrnaseq_mrna_baseline")
var isDifferential = function isDifferential(experiment) {
    return !isMultiExperiment(experiment) && experiment.type.toUpperCase().endsWith('DIFFERENTIAL');
};

var isBaseline = function isBaseline(experiment) {
    return !isMultiExperiment(experiment) && experiment.type.toUpperCase().endsWith('BASELINE');
};

var isRnaSeqBaseline = function isRnaSeqBaseline(experiment) {
    return !isMultiExperiment(experiment) && experiment.type.toUpperCase() === 'RNASEQ_MRNA_BASELINE';
};

var getUnits = function getUnits(experiment) {
    if (isDifferential(experiment)) {
        return 'Log2-fold change'; // What we use for point.value, we don't use it for display. See Formatters.jsx.
    } else if (isRnaSeqBaseline(experiment)) {
        return experiment.description.toUpperCase().includes('FANTOM') ? 'TPM' : 'FPKM';
    } else {
        return '';
    }
};

exports.experimentPropTypes = experimentPropTypes;
exports.isMultiExperiment = isMultiExperiment;
exports.isDifferential = isDifferential;
exports.isBaseline = isBaseline;
exports.isRnaSeqBaseline = isRnaSeqBaseline;
exports.getUnits = getUnits;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(experimentPropTypes, 'experimentPropTypes', 'src/load/experimentTypeUtils.js');

    __REACT_HOT_LOADER__.register(isMultiExperiment, 'isMultiExperiment', 'src/load/experimentTypeUtils.js');

    __REACT_HOT_LOADER__.register(isDifferential, 'isDifferential', 'src/load/experimentTypeUtils.js');

    __REACT_HOT_LOADER__.register(isBaseline, 'isBaseline', 'src/load/experimentTypeUtils.js');

    __REACT_HOT_LOADER__.register(isRnaSeqBaseline, 'isRnaSeqBaseline', 'src/load/experimentTypeUtils.js');

    __REACT_HOT_LOADER__.register(getUnits, 'getUnits', 'src/load/experimentTypeUtils.js');
}();

;