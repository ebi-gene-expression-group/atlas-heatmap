const React = require(`react`);
const Button = require( `react-bootstrap/lib/Button`);
const FormattersFactory = require(`./Formatters.jsx`);
const TooltipsFactory = require(`./tooltips/main.jsx`);
const PropTypes = require(`../PropTypes.js`);
const Show = require(`../show/main.jsx`);
const _ = require(`lodash`);

module.exports = React.createClass({
    displayName: `Heatmap with settings`,

    propTypes: {
        loadResult: PropTypes.LoadResult,
        googleAnalyticsCallback: React.PropTypes.func.isRequired,
        ontologyIdsToHighlight: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        onOntologyIdIsUnderFocus: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            ordering: `Default`,
            filtersSelection: this._filtersInitially(),
            coexpressionsShown: 0,
            zoom: false
        };
    },
    _getFilterSelection(name) {
      return (this.state.filtersSelection.find((f)=>f.name==name) || {selected: []}).selected
    },

    _onUserZoom(zoomedIn) {
        this.setState({ zoom: zoomedIn })
    },

    _heatmapDataToPresent() {
        return require(`./Manipulators.js`).manipulate(
            {
                keepSeries: (series) => this._getFilterSelection(this._expressionLevelInSelectedBucketFilter().name).includes(series.info.name),
                keepRow: (row) => !row.info.index || row.info.index <= this.state.coexpressionsShown,
                keepColumn: (columnHeader) => (
                  this._columnHeadersThatColumnGroupingFiltersSayWeCanInclude().length == 0 ||
                  this._columnHeadersThatColumnGroupingFiltersSayWeCanInclude().includes(columnHeader.label)
                ),
                ordering: this.props.loadResult.orderings[this.state.ordering],
                allowEmptyColumns:
                    this.props.loadResult.heatmapConfig.isExperimentPage &&
                    (_.isEqual(this._filtersInitially(), this._filtersCurrently())),
            },
            this.props.loadResult.heatmapData
        )
    },

    _columnHeadersThatColumnGroupingFiltersSayWeCanInclude() {
      return (
        this._columnBelongsToGroupingFilterPerGrouping()
        .map((groupingFilter) => groupingFilter.name)
        .map((name) => this._getFilterSelection(name))
        .reduce((l,r) => l.concat(r), [])
      )
    },

    _labels() {
        return (
            this.props.loadResult.heatmapData.dataSeries.map(e => ({
                colour: e.info.colour,
                name: e.info.name
            }))
        );
    },

    _orderings() {
        return {
            available: Object.keys(this.props.loadResult.orderings),
            selected: this.state.ordering,
            onSelect: orderingChosen => {
                this.setState({ ordering: orderingChosen })
            }
      }
    },

    __filters__() {
        return [this._expressionLevelInSelectedBucketFilter()].concat(this._columnBelongsToGroupingFilterPerGrouping())
    },

    _filtersInitially(){
      return this.__filters__().map((filter) => ({
        name: filter.name,
        selected: filter.values
      }))
    },

    _filtersCurrently(){
      return this.__filters__().map((_filter)=>(
        Object.assign({},
        _filter,
        {selected: this._getFilterSelection(_filter.name)}
      )))
    },

    _expressionLevelInSelectedBucketFilter() {
        return (
            {
                name: `Expression Value${this.props.loadResult.heatmapConfig.isExperimentPage ? ` – relative` : ``}`,
                values: this.props.loadResult.heatmapData.dataSeries.map(e => e.info.name),
            }
        )
    },
    _columnBelongsToGroupingFilterPerGrouping() {
      const groupingTriplets = _.flattenDeep(this.props.loadResult.heatmapData.xAxisCategories.reduce((acc, columnHeader) => {
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
          }
      ,[]));

      const groupingNames = _.uniq(groupingTriplets.map(groupingTriplet => groupingTriplet.name));

      return groupingNames.map(groupingName => {
        const columnLabels = _.uniq(groupingTriplets
            .filter(groupingTriplet => groupingTriplet.name === groupingName)
            .map(groupingTriplet => groupingTriplet.columnLabel));

        return {
            name: groupingName,
            values: columnLabels,
            valueGroupings:
              _.uniq(
                groupingTriplets
                .map(groupingTriplet => groupingTriplet.groupingLabel)
              )
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
    },

    _onFilterChange(newFiltersSelection) {
        this.setState({ filtersSelection: newFiltersSelection });
    },

    _legend() { //See properties required for HeatmapLegendBox
      return (
        this.props.loadResult.heatmapConfig.isExperimentPage
        ? null
        : this.props.loadResult.heatmapData.dataSeries
            .map((e, ix) =>
              ({
                key: e.info.name,
                name: e.info.name,
                colour: e.info.colour,
                on: this._getFilterSelection(this._expressionLevelInSelectedBucketFilter().name).includes(e.info.name)
              })
            )
      );
    },

    _coexpressionOption() {
        return (
            this.props.loadResult.heatmapConfig.coexpressions &&
            {
                geneName: this.props.loadResult.heatmapConfig.coexpressions.coexpressedGene,
                numCoexpressionsVisible: this.state.coexpressionsShown,
                numCoexpressionsAvailable: this.props.loadResult.heatmapConfig.coexpressions.numCoexpressionsAvailable,
                showCoexpressionsCallback: e => {this.setState({ coexpressionsShown: e })}
            }
        );
    },

    render() {
        const heatmapDataToPresent = this._heatmapDataToPresent();
        return (
            Show(
                heatmapDataToPresent,
                this._orderings(),
                this._filtersCurrently(),
                this._onFilterChange,
                this.state.zoom,
                this._onUserZoom,
                this.props.loadResult.colorAxis||undefined,
                FormattersFactory(this.props.loadResult.heatmapConfig),
                TooltipsFactory(this.props.loadResult.heatmapConfig, heatmapDataToPresent.xAxisCategories,heatmapDataToPresent.yAxisCategories),
                this._legend(),
                this._coexpressionOption(),
                this.props
            )
        );
    }
});
