import _ from 'lodash'

/*
- what I have by column:
- [{
    expression: ["Low", "Medium"],
    groups: {
        "Anatomical systems": ["nervous system"],
        "Organs": ["brain"]
    }
}
}]

To display I need:
- List of groups
- List of categories
- List of groupings per group
- Each grouping in a group also has a category ()
*/

/*
allValues: ["neocortex", "cerebellum", "liver"]
filters: [{
    name: "Anatomical systems",
    memberName: "Anatomical system", //I do not remember what this is for :)
    categories: [
        {"name": "All"},
        {"name": "High", disabled: true},
        {"name": "Medium"},
        {"name": "Low"},
        {"name": "Below cutoff"}
    ],
    groupings: [
        {
        "name": "Brain",
        "categories": ["All", "High"],
        "values": ["neocortex", "cerebellum"]
    }
    ]
}]
*/

//old
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
}

//old, new function goes here
const getColumnGroupingFilters = xAxisCategories => {
    const groupingTriplets = _.flattenDeep(xAxisCategories.reduce((acc, columnHeader) => {
            const _groupingTriplets = columnHeader.info.groupings.map(grouping =>
                grouping.values.map(groupingValue =>
                    ({
                        name: grouping.name,
                        groupingLabel: groupingValue.label,
                        columnLabel: columnHeader.label
                    })
                )
            )
            acc.push(_groupingTriplets)

            return acc
        },
        []
    ))

    const groupingNames = _.uniq(groupingTriplets.map(groupingTriplet => groupingTriplet.name))

    return groupingNames.map(groupingName => {
            const columnLabels = _.uniq(groupingTriplets
                .filter(groupingTriplet => groupingTriplet.name === groupingName)
                .map(groupingTriplet => groupingTriplet.columnLabel));

            const groupingLabels =
              _.uniq(groupingTriplets
                  .filter(groupingTriplet => groupingTriplet.name === groupingName)
                  .map(groupingTriplet => groupingTriplet.groupingLabel)
              )
              .sort();

            const groupingLabelsWithUnmappedLast =
              groupingLabels.filter(l => l !== `Unmapped`).concat(groupingLabels.find(l => l === `Unmapped`) || []);

            return {
                name: groupingName,
                values: columnLabels.map(label =>
                    ({
                        name: label,
                        disabled: false     // Guaranteed because values are extracted from xAxisCategories
                    })
                ),
                valueGroupings: groupingLabelsWithUnmappedLast
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
            }
        }
    )
}

export default getColumnGroupingFilters
