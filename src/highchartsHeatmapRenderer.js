const React = require('react');
const ReactDOM = require('react-dom');

const EventEmitter = require('events');
const HighchartsHeatmapContainer = require('./HighchartsHeatmapContainer.jsx');

/**
 API of this widget
------------------
### Minimal example
{
  params:"geneQuery=zinc finger&species=mus musculus",
  target:"myDomElementId"
}

### Note
changes to this API will be announced to the mailing list atlas-widget@ebi.ac.uk

### Target
@param {string | Object} options.target - a <div> id or a DOM element, as returned by ReactDOM.findDOMNode()

### Query settings
@param {string}          options.params - Alternate way of sourcing data if you do not provide the sourceURL
e.g. 'geneQuery=[{value:"BRCA1"}, {value:"REG1B"}]&species=homo sapiens',
e.g. 'geneQuery=[{value:"PIP",category:"symbol"}]&species=homo sapiens',
e.g. 'geneQuery=zinc finger&species=mus musculus',
e.g. 'experiment=E-MTAB-513'

### Optional recommended alternative query settings
@param {string}          options.sourceURL - Where to source the data from (used by Atlas instead of options.params)
e.g. https://www.ebi.ac.uk/gxa/json/experiments/E-PROT-1
e.g. https://www.ebi.ac.uk/gxa/json/search/baselineResults?query={value:"zinc finger"}&species=homo sapiens
e.g. https://www.ebi.ac.uk/gxa/widgets/heatmap/baselineAnalytics?geneQuery={value:"zinc finger"}&species=homo sapiens
e.g. https://www.ebi.ac.uk/gxa/widgets/heatmap/referenceExperiment?experiment=E-MTAB-513
Note: the URL is otherwise inferred from options.params.
You could select this option and add yourself an integration test that checks what data the backend will serve you.

### Optional connection setup
@param {string}          options.proxyPrefix - proxy prefix for outbound links, optionally set as "http(s?)://" or to proxy URL e.g. "www.myproxy.org?url="
@param {string}         options.atlasHost - Atlas host with protocol and port - where to source the data from, default: "https://www.ebi.ac.uk"

### Optional options
@param {boolean}        options.disableGoogleAnalytics - Disable Google Analytics
@param {function}        options.fail - Callback to run if the AJAX request to the server fails. (jqXHR, textStatus)
@param {boolean}        options.showAnatomogram - optionally hide the anatomogram

### Advanced options
@param {Object}          options.anatomogramDataEventEmitter - emits events to the facets tree to signal the existence of anatomogram
@param {boolean}         options.isDifferential
@param {boolean}         options.isMultiExperiment
@param {boolean}        options.isWidget

### Development only
@param {string}          options.pathToFolderWithBundledResources - use if you're serving the /svg's from an unusual location. Development only.
**/

exports.render = function(options) {
    const atlasHost = options.atlasHost === undefined ? "https://www.ebi.ac.uk" : options.atlasHost
    const atlasPath = "/gxa"
    const proxyPrefix = options.proxyPrefix || "https://"

    const atlasBaseURL =
        (atlasHost.indexOf("http://") === 0 || atlasHost.indexOf("https://") === 0
          ? ""
          : proxyPrefix)
        + atlasHost
        + atlasPath;

    //If using this renderer for a standalone widget, see uk.ac.ebi.atlas.widget.HeatmapWidgetController.java for the source URL/params required
    const sourceURL = options.sourceURL ||
                      atlasBaseURL + "/widgets/heatmap"
                      + (options.isMultiExperiment? "/baselineAnalytics" : "/referenceExperiment")
                      + "?" + options.params;

    const anatomogramEventEmitter = new EventEmitter();
    anatomogramEventEmitter.setMaxListeners(0);

    ReactDOM.render(
        React.createElement(
            HighchartsHeatmapContainer,
            {
                sourceURL: sourceURL,
                atlasBaseURL: atlasBaseURL,
                proxyPrefix: proxyPrefix,
                pathToFolderWithBundledResources: options.pathToFolderWithBundledResources || atlasBaseURL + "/resources/js-bundles/",
                showAnatomogram: options.showAnatomogram === undefined || options.showAnatomogram,
                isDifferential: !!options.isDifferential,
                isMultiExperiment: !!options.isMultiExperiment,
                isWidget: options.isWidget === undefined || options.isWidget,
                disableGoogleAnalytics: !!options.disableGoogleAnalytics,
                fail: options.fail,
                anatomogramEventEmitter:anatomogramEventEmitter,
                anatomogramDataEventEmitter: options.anatomogramDataEventEmitter
            }
        ),
        (typeof options.target === "string") ? document.getElementById(options.target) : options.target
    );
};
