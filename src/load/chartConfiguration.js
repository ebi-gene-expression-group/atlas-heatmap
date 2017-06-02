import {isMultiExperiment, isBaseline, isDifferential} from './experimentTypeUtils.js';
import {capitalizeFirstLetter, numberWithCommas} from '../utils';

// Message on top of the chart: “Showing 3 experiments:”, “Showing 12 genes of 432 found:”, “Showing 32 genes:”...
const introductoryMessage = (experiment, profiles) => {
    const shownRows = profiles.rows.length;
    const totalRows = profiles.searchResultTotal;

    const what = (experiment ? `gene` : `experiment`) + (totalRows > 1 ? `s` : ``);

    return `Showing ${numberWithCommas(shownRows)} ` + (totalRows === shownRows ? what + `:` : `of ${numberWithCommas(totalRows)} ${what} found:`);
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

    return Object.freeze({
        inProxy,
        outProxy,
        atlasUrl,
        experiment,
        isWidget,
        description,
        shortDescription,
        disclaimer,
        ...chartTextDecorations,
        genomeBrowsers: data.config.genomeBrowsers.length ? [`No genome browser selected`, ...data.config.genomeBrowsers.map(name => `${name} genome browser`)] : [],
        coexpressionsAvailable: Boolean(data.coexpressions),
        isMultiExperiment: isMultiExperiment(experiment),
        isBaseline: isBaseline(experiment),
        isDifferential: isDifferential(experiment)
    });
};

export default getChartConfiguration;
