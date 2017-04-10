import React from 'react';
import ReactDOMServer from 'react-dom/server';

import escapedHtmlDecoder from 'he';
const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component));

const YAxisLabel = React.createClass({
    propTypes: {
        config: React.PropTypes.shape({
            atlasUrl: React.PropTypes.string.isRequired,
            outProxy: React.PropTypes.string.isRequired,
            isMultiExperiment: React.PropTypes.bool.isRequired,
            isDifferential: React.PropTypes.bool.isRequired,
            experiment: React.PropTypes.shape({
                accession: React.PropTypes.string.isRequired,
                type: React.PropTypes.string.isRequired,
                relUrl: React.PropTypes.string.isRequired,
                description: React.PropTypes.string.isRequired,
                species: React.PropTypes.string.isRequired
            })
        }).isRequired,
        labelText: React.PropTypes.string.isRequired,
        resourceId: React.PropTypes.string.isRequired,
        extra: React.PropTypes.string
    },

    //TODO Always use resourceId as-is when production Atlas supplies URIs for labels
    render: function() {
        const geneNameWithLink =
            <a href={this.props.config.outProxy +
                        (this.props.resourceId.startsWith("http") ?
                            this.props.resourceId :
                            this.props.config.atlasUrl) +
                        (this.props.config.experiment ? `genes/` : `experiments/`) + this.props.resourceId}>
                {this.props.labelText}
            </a>;
        return (
            this.props.extra ?
                <span>{geneNameWithLink}<em style={{color:"black"}}>{"\t"+this.props.extra}</em></span> :
                <span>{geneNameWithLink}</span>
        );
    }
});

export default config => ({
    xAxisFormatter: value => value.label,
    xAxisStyle: {
        fontSize: config.isDifferential ? '9px': 'smaller',
        cursor: `default`,
        textOverflow: config.experiment ? `none` : `ellipsis`,
        whiteSpace: config.isDifferential ? `normal` : `nowrap`
    },

    yAxisFormatter: value => reactToHtml(
        <YAxisLabel config={config}
                    labelText={value.label}
                    resourceId={value.id}
                    extra={value.info.designElement || ``}
        />
    ),
    yAxisStyle: {
        fontSize: config.isMultiExperiment ? 'smaller' : 'small',
        color: `#148ff3`
    }
});
