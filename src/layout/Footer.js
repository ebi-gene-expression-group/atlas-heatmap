import React from 'react'
import PropTypes from 'prop-types'

const Footer = props =>
  <div style={{marginBottom: `2rem`, clear: `both`, width: `100%`}}>
    This page is a summary of the data held in <a href={props.outProxy + props.atlasUrl}>Expression Atlas</a> for this gene; 
    click <a href={props.outProxy + props.moreInformationUrl}>here</a> for the full record.
    <br/>Please send any queries or feedback to <a href="mailto:arrayexpress-atlas@ebi.ac.uk">arrayexpress-atlas@ebi.ac.uk</a>.
  </div>

Footer.propTypes = {
  outProxy: PropTypes.string.isRequired,
  atlasUrl: PropTypes.string.isRequired,
  moreInformationUrl: PropTypes.string.isRequired
}

export default Footer
