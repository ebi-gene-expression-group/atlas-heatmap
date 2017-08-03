import React from 'react'
import PropTypes from 'prop-types'

const ExperimentDescription = ({outProxy, experimentUrl, description}) =>
    <div className={`row column margin-bottom-large`}>
        <div>
            <a target={`_blank`} href={outProxy + experimentUrl}>{description}</a>
        </div>
    </div>

ExperimentDescription.propTypes = {
    outProxy: PropTypes.string.isRequired,
    experimentUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default ExperimentDescription
