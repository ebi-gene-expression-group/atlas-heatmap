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















// For each column grouping get the groups that contain a specific ID, or the group Unmapped if it has no groups
const getGroupsThatContainId = ({columnGroupings, id}) =>
    columnGroupings.map(grouping => {
        const values =
            grouping.groups
                .filter(group => group.values.includes(id))
                .map(group => ({
                    label: group.name,
                    id: group.id
                }))

        return {
            name: grouping.name,
            memberName: grouping.memberName,
            values: values.length ? values : [{label: `Unmapped`, id: ``}]
        }
    })

const CATEGORY_ALL = {
    name: "All",
    disabled: false
}
const CATEGORY_NONE = {
    name:"None",
    disabled: false
}

const columnsWithGroupings = ({xAxisCategories, dataSeries, columnGroupings}) => (
    xAxisCategories
    .map((e,ix) => ({
        value: e.label,
        categories:
            [].concat.apply([CATEGORY_ALL.name],
                dataSeries
                .filter(ds => ds.data.some(v => v.x == ix))
                .map(ds => ds.info.name)
            )
        ,
        groupings:
            getGroupsThatContainId({columnGroupings, id: e.id})
    }))
)

//columnGroupsPropTypes
const main = ({heatmapData: {xAxisCategories, dataSeries}, columnGroupings}) => ({
    //this could be inferred but is convenient to pass through
    groupingNames: columnGroupings.map(e => e.name),
    //This can't be inferred from the data later, because there might not be any columns with some category
    //(Happens when there's an empty data series)
    categories:
        [].concat(
            [CATEGORY_ALL],
            [].concat.apply([],
                dataSeries
                .map(ds => ({
                    name: ds.info.name,
                    disabled: !ds.data.length
                }))
                .reverse()
            ),
            [CATEGORY_NONE]
        ),
    data: columnsWithGroupings({xAxisCategories, dataSeries,columnGroupings}),
})

export default main
