import PropTypes from 'prop-types'

const experimentPropTypes = PropTypes.shape({
  accession: PropTypes.string.isRequired,   // Is it worth to enumerate the experiment types?
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  species: PropTypes.string.isRequired
})

const isMultiExperiment = experiment => !Boolean(experiment)

// From ExperimentType.java:
// RNASEQ_MRNA_BASELINE("rnaseq_mrna_baseline")
// RNASEQ_MRNA_DIFFERENTIAL("rnaseq_mrna_differential")
// MICROARRAY_ANY("microarray parent type")
// MICROARRAY_1COLOUR_MRNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_1colour_mrna_differential")
// MICROARRAY_2COLOUR_MRNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_2colour_mrna_differential")
// MICROARRAY_1COLOUR_MICRORNA_DIFFERENTIAL(MICROARRAY_ANY, "microarray_1colour_microrna_differential")
// PROTEOMICS_BASELINE("proteomics_baseline")
// SINGLE_CELL_RNASEQ_MRNA_BASELINE("scrnaseq_mrna_baseline")
const isDifferential = experiment =>
  !isMultiExperiment(experiment) && experiment.type.toUpperCase().endsWith(`DIFFERENTIAL`)

const isBaseline = experiment =>
  !isMultiExperiment(experiment) && experiment.type.toUpperCase().contains(`BASELINE`)

const isRnaSeqBaseline = experiment =>
  !isMultiExperiment(experiment) && experiment.type.toUpperCase() === `RNASEQ_MRNA_BASELINE`

export {experimentPropTypes, isMultiExperiment, isDifferential, isBaseline, isRnaSeqBaseline}
