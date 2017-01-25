const React = require( `react`);
const Modal = require(`react-bootstrap/lib/Modal`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);

const PropTypes = require( `../../PropTypes.js`);
const FlatFilter = require(`./FlatFilter.jsx`);
const GroupedFilter = require(`./GroupedFilter.jsx`);


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
        return (
            <div>
                <Button bsSize="small" onClick={this._open} disabled={this.props.disabled} title={this.props.disabled ? `Reset zoom to enable filters` : ``}
                        style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                    <Glyphicon glyph="equalizer"/>
                    <span style={{verticalAlign: `middle`}}> Filters</span>
                </Button>

                <Modal show={this.state.showModal} onHide={this._close} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>Filters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {
                        this._filtersCorrespondingToCurrentSelection()
                        .map(this._renderFilter)
                      }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this._apply}
                                style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Apply</Button>
                        <Button onClick={this._close}
                                style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
});

module.exports = SettingsModal;
