import HighchartsHeatmapRenderer from './HighchartsHeatmapRenderer.jsx';

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
@param {string}          options.atlasHost - Atlas host with protocol and port - where to source the data from, default: "https://www.ebi.ac.uk"

### Optional options
@param {boolean}         options.disableGoogleAnalytics - Disable Google Analytics
@param {function}        options.fail - Callback to run if the AJAX request to the server fails. (jqXHR, textStatus)
@param {boolean}         options.showAnatomogram - optionally hide the anatomogram

### Advanced options
@param {Object}          options.anatomogramDataEventEmitter - emits events to the facets tree to signal the existence of anatomogram
@param {boolean}         options.isDifferential
@param {boolean}         options.isMultiExperiment
@param {boolean}         options.isWidget - set to true if you're hosting the widget outside Expression Atlas pages

### Development only
@param {string}          options.pathToFolderWithBundledResources - use if you're serving the /svg's from an unusual location. Development only.
**/

export default function(options, newOptions) {
    if (newOptions) {
        HighchartsHeatmapRenderer(newOptions);
    }

    const atlasHost = options.atlasHost === undefined ? `https://www.ebi.ac.uk"` : options.atlasHost;
    const atlasPath = "/gxa";
    const atlasUrl = atlasHost + atlasPath;

    let queryUrlSegment = options.sourceURL ?
        options.sourceURL.slice(options.atlasHost.length) : null;
    queryUrlSegment = queryUrlSegment && queryUrlSegment.startsWith(`/`) ? queryUrlSegment.slice(1) : queryUrlSegment;

    const experiment = options.params.startsWith(`experiment=`) ?
        options.params.slice(`experiment=`.length) : null;

    const transformedOptions = {
        target: options.target,
        disableGoogleAnalytics: options.disableGoogleAnalytics,
        fail: options.fail,
        showAnatomogram: options.showAnatomogram,
        isWidget: options.isWidget,
        atlasUrl: atlasUrl,
        inProxy: options.proxyPrefix,
        experiment: experiment ? experiment : null,
        query: queryUrlSegment ? queryUrlSegment : null
    };

    HighchartsHeatmapRenderer(transformedOptions);
};
