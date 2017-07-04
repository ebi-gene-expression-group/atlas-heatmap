import React from 'react'
import PropTypes from 'prop-types'

const ExperimentDescription = props =>
    <div style={{width: `100%`, paddingBottom: `20px`}}>
        <div>
            <a target="_blank" href={props.outProxy + props.experimentUrl}>{props.description}</a>
        </div>
    </div>

ExperimentDescription.propTypes = {
    outProxy: PropTypes.string.isRequired,
    experimentUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default ExperimentDescription
