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
  name: `All`,
  disabled: false
}
const CATEGORY_NONE = {
  name:`None`,
  disabled: false
}

const columnsWithGroupings = ({xAxisCategories, dataSeries, columnGroupings}) => (
  xAxisCategories
    .map((e,ix) => ({
      value: e.label,
      categories:
        [].concat.apply([CATEGORY_ALL.name],
          dataSeries
            .filter(ds => ds.data.some(v => v.x === ix))
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
      [CATEGORY_NONE]
    ),
  categoryCheckboxes: [].concat.apply([],
    dataSeries
      .map(ds => ({
        name: ds.info.name,
        disabled: !ds.data.length
      }))
      .reverse()
  ),
  data: columnsWithGroupings({xAxisCategories, dataSeries, columnGroupings}),
})

export default main
