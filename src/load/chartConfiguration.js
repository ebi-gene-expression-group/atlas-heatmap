import {isMultiExperiment, isBaseline, isDifferential} from './experimentTypeUtils.js';

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.substr(1);

// Message on top of the chart: “Showing 3 experiments:”, “Showing 12 genes of 432 found:”, “Showing 32 genes:”...
const introductoryMessage = (experiment, profiles) => {
    const shownRows = profiles.rows.length;
    const totalRows = profiles.searchResultTotal;

    const what = (experiment ? `gene` : `experiment`) + (totalRows > 1 ? `s` : ``);

    return `Showing ${shownRows} ` + (totalRows === shownRows ? what + `:` : `of ${totalRows} ${what} found:`);
};

// _x_ and _y_ are placeholders to be replaced when clicking on a heatmap cell (see HeatmapCanvas.jsx)
// TODO User URI.js to build URL (?)
const genomeBrowserPath = (experiment, atlasUrl) => {
    const trackFileUrl = `${atlasUrl}/experiments/${experiment.accession}/tracks/${experiment.accession}._x_`;

    const contigViewBottom =
        `contigviewbottom=url:${trackFileUrl}.genes.${isDifferential ? `log2foldchange` : `expressions`}.bedGraph`;

    const tiling = isDifferential(experiment) ? `=tiling,url:${trackFileUrl}.genes.pval.bedGraph=pvalue;` : ``;

    return `/Location/View?g=_y_;${contigViewBottom}${tiling};format=BEDGRAPH`;
};

const queryDescription = (geneQuery, conditionQuery, species) => {
    // Since Atlas uses URLEncoder in SemanticQuery.java
    const plusDecode = str => decodeURIComponent(str.replace(/\+/g, `%20`));

    const decodedGeneQuery = plusDecode(geneQuery);
    const decodedConditionQuery = plusDecode(conditionQuery);
    const decodedSpecies = plusDecode(species);

    return `Query results for: ${decodedGeneQuery}` +
        (decodedConditionQuery ? `, in conditions ${decodedConditionQuery}` : ``) +
        (decodedSpecies ?
            `, in species ${decodedSpecies[0].toUpperCase() + decodedSpecies.slice(1).toLowerCase()}` :
            ``);
};

const getChartConfiguration = (data, inProxy, outProxy, atlasUrl, isWidget) => {
    const {experiment, profiles} = data;
    const {geneQuery, conditionQuery, species, disclaimer, columnType, resources} = data.config;

    const chartTextDecorations = {
        introductoryMessage: introductoryMessage(experiment, profiles),
        xAxisLegendName: capitalizeFirstLetter(columnType) || `Experimental condition`,
        yAxisLegendName: isMultiExperiment(experiment) ? `Experiment` : `Gene name`
    };

    const description =
        isMultiExperiment(experiment) ?
            queryDescription(geneQuery, conditionQuery, species) :
            // description can be empty, see ExperimentsCacheLoader.java or BaselineExperimentsBuilder.java
            experiment.description || experiment.accession;

    const shortDescription =
        isMultiExperiment(experiment) ?
            `expression_atlas-${species.replace(/ +/, `_`)}` :
            experiment.accession;

    const genomeBrowserTemplate =
        isMultiExperiment(experiment) ?
            `` :
            resources.genome_browser[0] + genomeBrowserPath(experiment, atlasUrl);

    return Object.freeze({
        inProxy,
        outProxy,
        atlasUrl,
        experiment,
        isWidget,
        description,
        shortDescription,
        disclaimer,
        genomeBrowserTemplate,
        ...chartTextDecorations,
        coexpressionsAvailable: Boolean(data.coexpressions),
        isMultiExperiment: isMultiExperiment(experiment),
        isBaseline: isBaseline(experiment),
        isDifferential: isDifferential(experiment)
    });
};

export default getChartConfiguration;
