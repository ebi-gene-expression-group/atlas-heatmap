import React from 'react'
import PropTypes from 'prop-types'
import {experimentPropTypes} from '../load/experimentTypeUtils'


const baselineColumnHeadersPropTypes = PropTypes.shape({
    assayGroupId: PropTypes.string.isRequired,
    factorValue: PropTypes.string.isRequired,
    factorValueOntologyTermId: PropTypes.string,      // Some factors don’t have an ontology term... yet
    assayGroupSummary: PropTypes.shape({              // Present when rows are genes
        replicates: PropTypes.number.isRequired,
        properties: PropTypes.arrayOf(PropTypes.shape({
            propertyName: PropTypes.string.isRequired,
            testValue: PropTypes.string.isRequired,
            contrastPropertyType: PropTypes.oneOf([`FACTOR`, `SAMPLE`]).isRequired
        })).isRequired
    })
})

const assayGroupPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    assayAccessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    replicates: PropTypes.number.isRequired
})

const differentialColumnHeadersPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    arrayDesignAccession: PropTypes.string,           // Present in microarray experiments
    referenceAssayGroup: assayGroupPropTypes.isRequired,
    testAssayGroup: assayGroupPropTypes.isRequired,
    displayName: PropTypes.string.isRequired,
    contrastSummary: PropTypes.shape({
        properties: PropTypes.arrayOf(PropTypes.shape({
            propertyName: PropTypes.string.isRequired,
            testValue: PropTypes.string.isRequired,
            contrastPropertyType: PropTypes.oneOf([`FACTOR`, `SAMPLE`]).isRequired,
            referenceValue: PropTypes.string.isRequired,
        })).isRequired,
        experimentDescription: PropTypes.string.isRequired,
        contrastDescription: PropTypes.string.isRequired,
        testReplicates: PropTypes.number.isRequired,
        referenceReplicates: PropTypes.number.isRequired
    }).isRequired,
    resources: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired
    })).isRequired
})



const baselineExperimentProfilesRowsPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,              // Experiment accession
    experimentType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,            // Human-friendly exp. name with slice
    expressions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number,
    })).isRequired,
    uri: PropTypes.string.isRequired
})

const baselineGeneProfilesRowsExpressionsPropTypes = PropTypes.shape({
    value: PropTypes.number,
    quartiles: PropTypes.shape({
        min: PropTypes.number.isRequired,
        lower: PropTypes.number.isRequired,
        median: PropTypes.number.isRequired,
        upper: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired
    })
})

const baselineGeneProfilesRowsPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,              // Gene ID
    name: PropTypes.string.isRequired,            // Gene name
    expressions: PropTypes.arrayOf(baselineGeneProfilesRowsExpressionsPropTypes).isRequired,
    uri: PropTypes.string.isRequired
})


const baselineProfilesPropTypes = PropTypes.shape({
    searchResultTotal: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.oneOfType([
        baselineExperimentProfilesRowsPropTypes,
        baselineGeneProfilesRowsPropTypes
    ]))
})

const differentialProfilesPropTypes = PropTypes.shape({
    maxDownLevel: PropTypes.number,
    maxUpLevel: PropTypes.number,
    minDownLevel: PropTypes.number,
    minUpLevel: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        designElement: PropTypes.string.isRequired,       // Present but empty in RNA-seq differential exps
        expressions: PropTypes.arrayOf(PropTypes.shape({
            contrastName: PropTypes.string.isRequired,
            color: PropTypes.string,
            foldChange: PropTypes.number,
            pValue: PropTypes.number,
            tStat: PropTypes.number
        })).isRequired
    })).isRequired,
    searchResultTotal: PropTypes.number
})



const dataPropTypes = PropTypes.shape({
    config: PropTypes.shape({
        geneQuery: PropTypes.string.isRequired,
        conditionQuery: PropTypes.string.isRequired,
        species: PropTypes.string.isRequired,
        genomeBrowsers: PropTypes.arrayOf(PropTypes.string).isRequired,
        columnType: PropTypes.string.isRequired,
        disclaimer: PropTypes.string.isRequired
    }).isRequired,

    columnHeaders: PropTypes.arrayOf(PropTypes.oneOfType([
        baselineColumnHeadersPropTypes,
        differentialColumnHeadersPropTypes
    ])).isRequired,

    columnGroupings: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        memberName: PropTypes.string.isRequired,
        groups: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string).isRequired
        }))
    })).isRequired,

    profiles: PropTypes.oneOfType([
        baselineProfilesPropTypes,
        differentialProfilesPropTypes
    ]).isRequired,

    anatomogramData: PropTypes.shape({
        allSvgPathIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        species: PropTypes.string.isRequired
    }),

    coexpressions: PropTypes.arrayOf(PropTypes.shape({  // Only present in baseline, single result
        geneName: PropTypes.string.isRequired,
        geneId: PropTypes.string.isRequired,
        jsonProfiles: baselineProfilesPropTypes
    })),

    experiment: experimentPropTypes

})

export default dataPropTypes
