import React from 'react';

const Footer = props =>
    <div style={{clear: `both`}}>
        <a href={props.outProxy + props.moreInformationUrl}> See more expression data at Expression Atlas.</a>
        <br/>This expression view is provided by <a href={props.outProxy + props.atlasUrl}>Expression Atlas</a>.
        <br/>Please send any queries or feedback to <a href="mailto:arrayexpress-atlas@ebi.ac.uk">arrayexpress-atlas@ebi.ac.uk</a>.
    </div>;

Footer.propTypes = {
    outProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    moreInformationUrl: React.PropTypes.string.isRequired
};

export default Footer;
