import React from 'react';
import URI from 'urijs';

const Footer = function(props) {
    return  (
        <div>
            <a href={props.moreInformationUrl}> See more expression data at Expression Atlas.</a>
            <br/>This expression view is provided by <a href={props.outboundLinksUrl}>Expression Atlas</a>.
            <br/>Please send any queries or feedback to <a href="mailto:arrayexpress-atlas@ebi.ac.uk">arrayexpress-atlas@ebi.ac.uk</a>.
        </div>
    );
};

Footer.propTypes = {
    outboundLinksUrl: React.PropTypes.instanceOf(URI).isRequired,
    moreInformationUrl: React.PropTypes.instanceOf(URI).isRequired
};

export default Footer;
