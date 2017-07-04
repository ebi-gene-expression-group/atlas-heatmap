'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _experimentTypeUtils = require('../load/experimentTypeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baselineColumnHeadersPropTypes = _propTypes2.default.shape({
    assayGroupId: _propTypes2.default.string.isRequired,
    factorValue: _propTypes2.default.string.isRequired,
    factorValueOntologyTermId: _propTypes2.default.string, // Some factors don’t have an ontology term... yet
    assayGroupSummary: _propTypes2.default.shape({ // Present when rows are genes
        replicates: _propTypes2.default.number.isRequired,
        properties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            propertyName: _propTypes2.default.string.isRequired,
            testValue: _propTypes2.default.string.isRequired,
            contrastPropertyType: _propTypes2.default.oneOf(['FACTOR', 'SAMPLE']).isRequired
        })).isRequired
    })
});

var assayGroupPropTypes = _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    assayAccessions: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    replicates: _propTypes2.default.number.isRequired
});

var differentialColumnHeadersPropTypes = _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    arrayDesignAccession: _propTypes2.default.string, // Present in microarray experiments
    referenceAssayGroup: assayGroupPropTypes.isRequired,
    testAssayGroup: assayGroupPropTypes.isRequired,
    displayName: _propTypes2.default.string.isRequired,
    contrastSummary: _propTypes2.default.shape({
        properties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            propertyName: _propTypes2.default.string.isRequired,
            testValue: _propTypes2.default.string.isRequired,
            contrastPropertyType: _propTypes2.default.oneOf(['FACTOR', 'SAMPLE']).isRequired,
            referenceValue: _propTypes2.default.string.isRequired
        })).isRequired,
        experimentDescription: _propTypes2.default.string.isRequired,
        contrastDescription: _propTypes2.default.string.isRequired,
        testReplicates: _propTypes2.default.number.isRequired,
        referenceReplicates: _propTypes2.default.number.isRequired
    }).isRequired,
    resources: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        type: _propTypes2.default.string.isRequired,
        name: _propTypes2.default.string.isRequired
    })).isRequired
});

var baselineExperimentProfilesRowsPropTypes = _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired, // Experiment accession
    experimentType: _propTypes2.default.string.isRequired,
    name: _propTypes2.default.string.isRequired, // Human-friendly exp. name with slice
    expressions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        value: _propTypes2.default.number
    })).isRequired,
    uri: _propTypes2.default.string.isRequired
});

var baselineGeneProfilesRowsExpressionsPropTypes = _propTypes2.default.shape({
    value: _propTypes2.default.number,
    quartiles: _propTypes2.default.shape({
        min: _propTypes2.default.number.isRequired,
        lower: _propTypes2.default.number.isRequired,
        median: _propTypes2.default.number.isRequired,
        upper: _propTypes2.default.number.isRequired,
        max: _propTypes2.default.number.isRequired
    })
});

var baselineGeneProfilesRowsPropTypes = _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired, // Gene ID
    name: _propTypes2.default.string.isRequired, // Gene name
    expressions: _propTypes2.default.arrayOf(baselineGeneProfilesRowsExpressionsPropTypes).isRequired,
    uri: _propTypes2.default.string.isRequired
});

var baselineProfilesPropTypes = _propTypes2.default.shape({
    searchResultTotal: _propTypes2.default.string.isRequired,
    rows: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([baselineExperimentProfilesRowsPropTypes, baselineGeneProfilesRowsPropTypes]))
});

var differentialProfilesPropTypes = _propTypes2.default.shape({
    maxDownLevel: _propTypes2.default.number,
    maxUpLevel: _propTypes2.default.number,
    minDownLevel: _propTypes2.default.number,
    minUpLevel: _propTypes2.default.number,
    rows: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        id: _propTypes2.default.string.isRequired,
        name: _propTypes2.default.string.isRequired,
        designElement: _propTypes2.default.string.isRequired, // Present but empty in RNA-seq differential exps
        expressions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            contrastName: _propTypes2.default.string.isRequired,
            color: _propTypes2.default.string,
            foldChange: _propTypes2.default.number,
            pValue: _propTypes2.default.number,
            tStat: _propTypes2.default.number
        })).isRequired
    })).isRequired,
    searchResultTotal: _propTypes2.default.number
});

var dataPropTypes = _propTypes2.default.shape({
    config: _propTypes2.default.shape({
        geneQuery: _propTypes2.default.string.isRequired,
        conditionQuery: _propTypes2.default.string.isRequired,
        species: _propTypes2.default.string.isRequired,
        genomeBrowsers: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
        columnType: _propTypes2.default.string.isRequired,
        disclaimer: _propTypes2.default.string.isRequired
    }).isRequired,

    columnHeaders: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([baselineColumnHeadersPropTypes, differentialColumnHeadersPropTypes])).isRequired,

    columnGroupings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        memberName: _propTypes2.default.string.isRequired,
        groups: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            id: _propTypes2.default.string.isRequired,
            name: _propTypes2.default.string.isRequired,
            values: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
        }))
    })).isRequired,

    profiles: _propTypes2.default.oneOfType([baselineProfilesPropTypes, differentialProfilesPropTypes]).isRequired,

    anatomogramData: _propTypes2.default.shape({
        allSvgPathIds: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
        species: _propTypes2.default.string.isRequired
    }),

    coexpressions: _propTypes2.default.arrayOf(_propTypes2.default.shape({ // Only present in baseline, single result
        geneName: _propTypes2.default.string.isRequired,
        geneId: _propTypes2.default.string.isRequired,
        jsonProfiles: baselineProfilesPropTypes
    })),

    experiment: _experimentTypeUtils.experimentPropTypes

});

var _default = dataPropTypes;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(baselineColumnHeadersPropTypes, 'baselineColumnHeadersPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(assayGroupPropTypes, 'assayGroupPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(differentialColumnHeadersPropTypes, 'differentialColumnHeadersPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineExperimentProfilesRowsPropTypes, 'baselineExperimentProfilesRowsPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineGeneProfilesRowsExpressionsPropTypes, 'baselineGeneProfilesRowsExpressionsPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineGeneProfilesRowsPropTypes, 'baselineGeneProfilesRowsPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineProfilesPropTypes, 'baselineProfilesPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(differentialProfilesPropTypes, 'differentialProfilesPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(dataPropTypes, 'dataPropTypes', 'src/layout/jsonPayloadPropTypes.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/layout/jsonPayloadPropTypes.js');
}();

;