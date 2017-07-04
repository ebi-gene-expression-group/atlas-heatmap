import React from 'react'
import PropTypes from 'prop-types'

const Footer = props =>
    <div style={{clear: `both`, paddingTop: `40px`}}>
        <a href={props.outProxy + props.moreInformationUrl}> See more expression data at Expression Atlas.</a>
        <br/>This expression view is provided by <a href={props.outProxy + props.atlasUrl}>Expression Atlas</a>.
        <br/>Please send any queries or feedback to <a href="mailto:arrayexpress-atlas@ebi.ac.uk">arrayexpress-atlas@ebi.ac.uk</a>.
    </div>

Footer.propTypes = {
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    moreInformationUrl: PropTypes.string.isRequired
}

export default Footer
