import React from 'react';
import {experimentPropTypes} from '../load/experimentTypeUtils';


const baselineColumnHeadersPropTypes = React.PropTypes.shape({
    assayGroupId: React.PropTypes.string.isRequired,
    factorValue: React.PropTypes.string.isRequired,
    factorValueOntologyTermId: React.PropTypes.string,      // Some factors don’t have an ontology term... yet
    assayGroupSummary: React.PropTypes.shape({              // Present when rows are genes
        replicates: React.PropTypes.number.isRequired,
        properties: React.PropTypes.arrayOf(React.PropTypes.shape({
            propertyName: React.PropTypes.string.isRequired,
            testValue: React.PropTypes.string.isRequired,
            contrastPropertyType: React.PropTypes.oneOf([`FACTOR`, `SAMPLE`]).isRequired
        })).isRequired
    })
});

const assayGroupPropTypes = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    assayAccessions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    replicates: React.PropTypes.number.isRequired
});

const differentialColumnHeadersPropTypes = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    arrayDesignAccession: React.PropTypes.string,           // Present in microarray experiments
    referenceAssayGroup: assayGroupPropTypes.isRequired,
    testAssayGroup: assayGroupPropTypes.isRequired,
    displayName: React.PropTypes.string.isRequired,
    contrastSummary: React.PropTypes.shape({
        properties: React.PropTypes.arrayOf(React.PropTypes.shape({
            propertyName: React.PropTypes.string.isRequired,
            testValue: React.PropTypes.string.isRequired,
            contrastPropertyType: React.PropTypes.oneOf([`FACTOR`, `SAMPLE`]).isRequired,
            referenceValue: React.PropTypes.string.isRequired,
        })).isRequired,
        experimentDescription: React.PropTypes.string.isRequired,
        contrastDescription: React.PropTypes.string.isRequired,
        testReplicates: React.PropTypes.number.isRequired,
        referenceReplicates: React.PropTypes.number.isRequired
    }).isRequired,
    resources: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    })).isRequired
});



const baselineExperimentProfilesRowsPropTypes = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,              // Experiment accession
    experimentType: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,            // Human-friendly exp. name with slice
    expressions: React.PropTypes.arrayOf(React.PropTypes.shape({
        value: React.PropTypes.number,
    })).isRequired,
    uri: React.PropTypes.string.isRequired
});

const baselineGeneProfilesRowsExpressionsPropTypes = React.PropTypes.shape({
    value: React.PropTypes.number,
    quartiles: React.PropTypes.shape({
        min: React.PropTypes.number.isRequired,
        lower: React.PropTypes.number.isRequired,
        median: React.PropTypes.number.isRequired,
        upper: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired
    })
});

const baselineGeneProfilesRowsPropTypes = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,              // Gene ID
    name: React.PropTypes.string.isRequired,            // Gene name
    expressions: React.PropTypes.arrayOf(baselineGeneProfilesRowsExpressionsPropTypes).isRequired,
    uri: React.PropTypes.string.isRequired
});


const baselineProfilesPropTypes = React.PropTypes.shape({
    searchResultTotal: React.PropTypes.string.isRequired,
    rows: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
        baselineExperimentProfilesRowsPropTypes,
        baselineGeneProfilesRowsPropTypes
    ]))
});

const differentialProfilesPropTypes = React.PropTypes.shape({
    maxDownLevel: React.PropTypes.number,
    maxUpLevel: React.PropTypes.number,
    minDownLevel: React.PropTypes.number,
    minUpLevel: React.PropTypes.number,
    rows: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        designElement: React.PropTypes.string.isRequired,       // Present but empty in RNA-seq differential exps
        expressions: React.PropTypes.arrayOf(React.PropTypes.shape({
            contrastName: React.PropTypes.string.isRequired,
            color: React.PropTypes.string,
            foldChange: React.PropTypes.number,
            pValue: React.PropTypes.number,
            tStat: React.PropTypes.number
        })).isRequired
    })).isRequired,
    searchResultTotal: React.PropTypes.number
});



const dataPropTypes = React.PropTypes.shape({
    config: React.PropTypes.shape({
        geneQuery: React.PropTypes.string.isRequired,
        conditionQuery: React.PropTypes.string.isRequired,
        species: React.PropTypes.string.isRequired,
        genomeBrowsers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        columnType: React.PropTypes.string.isRequired,
        disclaimer: React.PropTypes.string.isRequired
    }).isRequired,

    columnHeaders: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
        baselineColumnHeadersPropTypes,
        differentialColumnHeadersPropTypes
    ])).isRequired,

    columnGroupings: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        memberName: React.PropTypes.string.isRequired,
        groups: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
        }))
    })).isRequired,

    profiles: React.PropTypes.oneOfType([
        baselineProfilesPropTypes,
        differentialProfilesPropTypes
    ]).isRequired,

    anatomogramData: React.PropTypes.shape({
        allSvgPathIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        species: React.PropTypes.string.isRequired
    }),

    coexpressions: React.PropTypes.arrayOf(React.PropTypes.shape({  // Only present in baseline, single result
        geneName: React.PropTypes.string.isRequired,
        geneId: React.PropTypes.string.isRequired,
        jsonProfiles: baselineProfilesPropTypes
    })),

    experiment: experimentPropTypes

});

export default dataPropTypes;
