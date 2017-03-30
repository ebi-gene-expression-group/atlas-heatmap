import {isBaseline, getUnits} from './experimentTypeUtils.js';

const getDataSeries = profiles =>
    profiles.rows[0].expressions.map(
        expression => expression.quartiles ?
            [ expression.quartiles.min,
              expression.quartiles.lower,
              expression.quartiles.median,
              expression.quartiles.upper,
              expression.quartiles.max ] :
            []
    );

const getXAxisCategories = columnHeaders =>
    columnHeaders.map(header => header.factorValue);

const getTitle = profiles =>
    profiles.rows[0].name + ` – ` + profiles.rows[0].id;

export default (profiles, columnHeaders, experiment) =>
    isBaseline(experiment) && profiles.rows.length === 1 ?
        ({
            dataSeries: getDataSeries(profiles),
            xAxisCategories: getXAxisCategories(columnHeaders),
            title: getTitle(profiles),
            unit: getUnits(experiment)
        }) :
    null;
