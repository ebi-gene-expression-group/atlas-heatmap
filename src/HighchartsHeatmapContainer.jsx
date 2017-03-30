const React = require(`react`);
const $ = require(`jquery`);

const Anatomogram = require(`anatomogram`);

const HighchartsHeatmap = require(`./manipulate/HeatmapWithControls.jsx`);

const Load = require(`./load/main.js`);
const outwardLink = require(`./util/adjustOutwardLinks.js`);

const ExperimentDescription = React.createClass({
    propTypes: {
      url: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      species: React.PropTypes.string.isRequired
    },

    render () {
        return (
            <div style={{width: `100%`, paddingBottom: `20px`}}>
                <div id="experimentDescription">
                    <a id="goto-experiment" className="gxaThickLink" title="Experiment Page" href={this.props.url}>{this.props.description}</a>
                </div>
                <div id="experimentOrganisms">Organism: <span style={{fontStyle: `italic`}}>{this.props.species}</span></div>
            </div>
        );
    }

});

const Container = React.createClass({

    getDefaultProps () {
        return {
            referenceToAnatomogramContainer: `anatomogramContainer`
        };
    },

    render () {
        const heatmapProps = {
            loadResult: this.props.loadResult
        }; // Overridden: ontologyIdsToHighlight, onOntologyIdIsUnderFocus

        const anatomogramConfig = {
            pathToFolderWithBundledResources: this.props.pathToFolderWithBundledResources,
            anatomogramData: this.props.anatomogramData,
            expressedTissueColour: this.props.loadResult.heatmapConfig.isExperimentPage? `gray` : `red`,
            hoveredTissueColour: this.props.loadResult.heatmapConfig.isExperimentPage? `red` : `purple`,
            atlasBaseURL: this.props.atlasBaseURL,
            idsExpressedInExperiment: this._ontologyIdsForTissuesExpressedInAllRows()
        };

        const Wrapped = Anatomogram.wrapComponent(anatomogramConfig, HighchartsHeatmap, heatmapProps);
        return (
            this._showAnatomogram() ?
                <Wrapped ref={this.props.referenceToAnatomogramContainer}/> :
                <HighchartsHeatmap {...heatmapProps} ontologyIdsToHighlight={[]} onOntologyIdIsUnderFocus={() => {}}/>
        );
    },

    _showAnatomogram () {
        return (
            this.props.showAnatomogram && this.props.anatomogramData && Object.keys(this.props.anatomogramData).length
        );
    },

    _ontologyIdsForTissuesExpressedInAllRows () {
        //TODO be less copypastey
        const _expressedFactors= function(expressedFactorsPerRow){
            const o = expressedFactorsPerRow;
            const vs = Object.keys(o).map(e => o[e]);
            return (
                [].concat.apply([],vs).filter((e, ix, self) => self.indexOf(e) === ix)
            );
        };

        const _expressedFactorsPerRow = profileRows => {
            return (
                profileRows
                    .reduce((result,row) => {
                        result[row.name] =
                            row.expressions
                                .filter(expression => expression.value)
                                .map(expression => expression.svgPathId);
                        return result;
                    },{})
            );
        };

        return _expressedFactors(_expressedFactorsPerRow(this.props.profiles.rows));
    }

});

const ContainerLoader = React.createClass({

    propTypes: {
        pathToFolderWithBundledResources: React.PropTypes.string.isRequired,
        sourceURL: React.PropTypes.string.isRequired,
        atlasBaseURL: React.PropTypes.string.isRequired,
        proxyPrefix: React.PropTypes.string.isRequired,
        showAnatomogram:React.PropTypes.bool.isRequired,
        isDifferential: React.PropTypes.bool.isRequired,
        isMultiExperiment: React.PropTypes.bool.isRequired,
        isWidget: React.PropTypes.bool.isRequired,
        disableGoogleAnalytics: React.PropTypes.bool.isRequired,
        fail: React.PropTypes.func,
        anatomogramDataEventEmitter: React.PropTypes.object
    },

    render () {
        return (
            <div>
                { this._isReferenceExperiment() && this.state.experimentData ?
                    <ExperimentDescription
                      url={this.state.loadResult.heatmapConfig.moreInformationLink}
                      description={this.state.experimentData.description}
                      species={this.state.experimentData.species} />
                    : null
                }
                { this.state.ajaxCompleted ?
                    this.state.error ?
                        <div ref="gxaError">
                            {this.state.error}
                        </div>
                        :
                        <Container {...this.props} {...this.state} />
                    :
                    <div>
                        <img src={this.props.atlasBaseURL + "/resources/images/loading.gif"}/>
                    </div>
                }
                { this.props.isWidget ?
                    <div><p><a href={outwardLink(
                        this.props.proxyPrefix,
                        this.state.ajaxCompleted
                          ? this.state.loadResult.heatmapConfig.moreInformationLink
                          :this.props.atlasBaseURL)
                        }> See more expression data at Expression Atlas.</a>
                        <br/>This expression view is provided by <a href={outwardLink(this.props.proxyPrefix, this.props.atlasBaseURL)}>Expression Atlas</a>.
                        <br/>Please direct any queries or feedback to <a href="mailto:arrayexpress-atlas@ebi.ac.uk">arrayexpress-atlas@ebi.ac.uk</a></p>
                    </div>
                    :
                    null
                }
            </div>
        );
    },

    componentDidUpdate () {
        if (this.props.anatomogramDataEventEmitter) {
            if (this.state.anatomogramData && Object.keys(this.state.anatomogramData).length !== 0) {
                this.props.anatomogramDataEventEmitter.emit(`existAnatomogramData`, true);
            } else {
                this.props.anatomogramDataEventEmitter.emit(`existAnatomogramData`, false);
            }
        }
    },

    getInitialState () {
        return {
            ajaxCompleted: false,
            error: false,
            profiles: {
                rows: [],
                minExpressionLevel: 0,
                maxExpressionLevel: 0
            },
            geneSetProfiles: {},
            anatomogramData: {},
            loadResult: {
                heatmapConfig: {},
                orderings: {
                    "Default" : {
                        columns: [],
                        rows: []
                    }
                }
            }
        }
    },

    _handleAjaxFailure (jqXHR, textStatus, errorThrown) {
        if (this.props.fail) {
            this.props.fail(jqXHR, textStatus, errorThrown);
        } else {
            this.setState({
                ajaxCompleted: true,
                error:
                    textStatus === `parsererror` ?
                        `Could not parse JSON response` :
                        errorThrown
            });
        }
    },

    _onAjaxDone (data, textStatus, jqXHR) {
        if(! this.isMounted()){
            this._handleAjaxFailure(jqXHR, textStatus, `DOM element not mounted!`);
        } else if (data.hasOwnProperty(`error`)) {
            this._handleAjaxFailure(jqXHR, textStatus, data.error);
        } else if (! data.profiles){
          this._handleAjaxFailure(jqXHR, textStatus, `No table data present in the response to query.`);
        } else {
            this.onAjaxSuccessful(data);
        }
    },

    _isExperimentPage () {
        return this.props.sourceURL.indexOf(`/json/experiments/`) > -1;
    },

    _isReferenceExperiment () {
        return !this.props.isMultiExperiment && !this._isExperimentPage();
    },

    onAjaxSuccessful (data) {

        const setupConfig = {
            isExperimentPage: this._isExperimentPage(),
            isMultiExperiment: this.props.isMultiExperiment,
            isReferenceExperiment: this._isReferenceExperiment(),
            isDifferential: this.props.isDifferential,
            atlasBaseURL: this.props.atlasBaseURL,
            proxyPrefix: this.props.proxyPrefix,
            pathToFolderWithBundledResources: this.props.pathToFolderWithBundledResources
        };

        this.setState({
            ajaxCompleted: true,
            columnHeaders: data.columnHeaders,
            profiles: data.profiles,
            anatomogramData: data.anatomogram,
            experimentData: data.experiment,
            loadResult: Load(setupConfig, data)
        });
    },

    componentDidMount () {
        const httpRequest = {
            url: this.props.sourceURL,
            dataType:  `json`,
            method: `GET`
        };

        $.ajax(httpRequest).done(this._onAjaxDone).fail(this._handleAjaxFailure);

        if (!this.props.disableGoogleAnalytics) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            window.ga('create', 'UA-37676851-1', 'auto', 'atlas-highcharts-widget');
            window.ga('atlas-highcharts-widget.send', 'pageview');
        } else {
            window.ga = () => {};
        }
    }
});

module.exports = ContainerLoader;
