const React = require( `react`);
const Modal = require(`react-bootstrap/lib/Modal`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);

const PropTypes = require( `../../PropTypes.js`);
const FilterGroup = require(`./FilterGroup.jsx`);
const FlatFilter = require(`./FlatFilter.jsx`);
const GroupedFilter = require(`./GroupedFilter.jsx`);
const deepEquals = require(`lodash/isEqual`);


const SettingsModal = React.createClass({
    propTypes: {
        filters: React.PropTypes.arrayOf(PropTypes.Filter).isRequired,
        disabled: React.PropTypes.bool.isRequired,
        propagateChosenFilterSelection: React.PropTypes.func.isRequired
    },

    _filtersSelectionBeforeModalOpen() {
      return (
        this.props.filters.map((_filter) => ({
          name: _filter.name,
          selected: _filter.selected
        }))
      )
    },

    getInitialState() {
        return {
            filtersSelection: this._filtersSelectionBeforeModalOpen(),
            showModal: false
        };
    },
    _close() {
        this.setState({
            showModal: false
        });
    },

    _apply() {
        this.props.propagateChosenFilterSelection(this.state.filtersSelection);
        this.setState({ showModal: false });
    },

    _open() {
        this.setState({ showModal: true,
        filtersSelection: this._filtersSelectionBeforeModalOpen() });
    },

    // _renderFilter(filter) {
    //     return (
    //         <FilterGroup
    //             key={filter.name}
    //             name={filter.name}
    //             values={filter.values.map((filterValue, i) =>
    //                 ({
    //                     name: filterValue,
    //                     elements: filter.elementsPerValue ? filter.elementsPerValue[i] : null,
    //                     selected: this.props.filtersSelection.find(filterSelection => filterSelection.name === filter.name).values.includes(filterValue)
    //                 })
    //             )}
    //             onChange={this._onFilterChange}
    //         />
    //     )
    // },

    _renderFilter(_filter) {
      const FilterComponent = _filter.valueGroupings ? GroupedFilter : FlatFilter;

      return (
        <FilterComponent
          key = {_filter.name}
          propagateFilterSelection = {
            (selected) => {
              this.setState((previousState)=>({
                filtersSelection:
                  previousState.filtersSelection
                  .map((filterSelection)=>(
                    filterSelection.name == _filter.name
                    ? Object.assign ({}, filterSelection, {selected: selected})
                    : filterSelection
                  ))
              }))
            }
          }
          disabled={this.props.disabled}
          {..._filter}/>
      )
    },

    _onFilterChange(name, values) {
        // TODO Hacky: newFiltersSelection *MUST* preserve the order because HeatmapWithControls.jsx does [0] and slices at specific values
        const newFiltersSelection = this.state.filtersSelection.map(filterSelection =>
            filterSelection.name === name ?
                ({ name, values }) :
                filterSelection
        );

        this.setState({ filtersSelection: newFiltersSelection });
    },

    _filtersCorrespondingToCurrentSelection(){
      return (
        this.props.filters
        .map(_filter => (
          Object.assign({},
          _filter,
          { selected:
             this.state.filtersSelection
             .find((f)=>f.name==_filter.name)
             .selected
           })
        ))
      )
    },

    render() {
      //TODO {this.props.filters.map(this._renderFilter)}
      //is wrong because it has the wrong selected yo yo yo
        return (
            <div>
                <Button bsSize="small" onClick={this._open} disabled={this.props.disabled} title={this.props.disabled ? `Reset zoom to enable filters` : ``}>
                    <Glyphicon glyph="equalizer"/>
                    <span style={{verticalAlign: `middle`}}> Filters</span>
                </Button>

                <Modal show={this.state.showModal} onHide={this._close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Filters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this._filtersCorrespondingToCurrentSelection().map(this._renderFilter)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this._apply}>Apply</Button>
                        <Button onClick={this._close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
});

module.exports = SettingsModal;
