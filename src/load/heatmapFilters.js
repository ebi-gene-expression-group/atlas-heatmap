import _ from 'lodash';

const getExpressionLevelFilters = (experiment, dataSeries) => {
    return (
        {
            name: `Expression value` + (experiment ? ` – relative` : ``),
            values: dataSeries.map(series =>
                ({
                    name: series.info.name,
                    disabled: series.data.length === 0
                })
            )
        }
    )
};

const getColumnGroupingFilters = xAxisCategories => {
    const groupingTriplets = _.flattenDeep(xAxisCategories.reduce((acc, columnHeader) => {
            const groupingTriplets = columnHeader.info.groupings.map(grouping =>
                grouping.values.map(groupingValue =>
                    ({
                        name: grouping.name,
                        groupingLabel: groupingValue.label,
                        columnLabel: columnHeader.label
                    })
                )
            );
            acc.push(groupingTriplets);

            return acc;
        },
        []
    ));

    const groupingNames = _.uniq(groupingTriplets.map(groupingTriplet => groupingTriplet.name));

    return groupingNames.map(groupingName => {
            const columnLabels = _.uniq(groupingTriplets
                .filter(groupingTriplet => groupingTriplet.name === groupingName)
                .map(groupingTriplet => groupingTriplet.columnLabel));

            return {
                name: groupingName,
                values: columnLabels.map(label =>
                    ({
                        name: label,
                        disabled: false     // Guaranteed because values are extracted from xAxisCategories
                    })
                ),
                valueGroupings:
                    _.uniq(groupingTriplets.map(groupingTriplet => groupingTriplet.groupingLabel))
                        .sort()
                        .map(groupingLabel => [
                            groupingLabel,
                            _.sortedUniq(
                                groupingTriplets
                                    .filter(groupingTriplet =>
                                        groupingTriplet.name === groupingName && groupingTriplet.groupingLabel === groupingLabel
                                    )
                                    .map(groupingTriplet => groupingTriplet.columnLabel)
                            )
                        ])
            };
        }
    );
};

export {getExpressionLevelFilters, getColumnGroupingFilters};
