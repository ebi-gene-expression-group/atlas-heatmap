import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import FlatFilter from './FlatFilter.jsx';
import GroupingFilter from './GroupingFilter.jsx';

import {filterPropTypes} from '../../../manipulate/chartDataPropTypes.js';

class FiltersModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: this._filtersSelectionBeforeModalOpen(),
            showModal: false
        };

        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.apply = this._apply.bind(this);
        this.onSelectFilterValue = this._onSelectFilterValue.bind(this);
    }

    _filtersSelectionBeforeModalOpen() {
        // Deep copy to avoid modifying props
        return (
            this.props.selectedFilters.map(selectedFilter =>
                ({
                    name: selectedFilter.name,
                    valueNames: selectedFilter.valueNames.map(valueName => valueName)
                })
            )
        )
    }

    _close() {
        this.setState({
            showModal: false
        });
    }

    _apply() {
        // this.props.propagateChosenFilterSelection(this.state.filtersSelection);
        this.props.onSelectFilters(this.state.selectedFilters);
        this.setState({ showModal: false });
    }

    _open() {
        this.setState({
            showModal: true,
            selectedFilters: this._filtersSelectionBeforeModalOpen()
        });
    }
    
    _onSelectFilterValue(filterName, newFilterValues) {
        this.setState(previousState =>
            ({
                selectedFilters: previousState.selectedFilters.map(previousSelectedFilter =>
                    ({
                        name: previousSelectedFilter.name,
                        valueNames: previousSelectedFilter.name === filterName ?
                            newFilterValues :
                            previousSelectedFilter.valueNames.map(valueName => valueName)
                    })
                )
            })
        );
    }

    _renderFlatFilter(filter) {
        return (
            <FlatFilter key={filter.name}
                        selected={this.state.selectedFilters.find(selectedFilter => selectedFilter.name === filter.name).valueNames}
                        onSelectFilterValue={this.onSelectFilterValue}
                        {...filter}
            />
        );
    }

    _renderGroupingFilter(filter) {
        return (
            <GroupingFilter key={filter.name}
                            selected={this.state.selectedFilters.find(selectedFilter => selectedFilter.name === filter.name).valueNames}
                            onSelectFilterValue={this.onSelectFilterValue}
                            {...filter}
            />
        );
    }

    render() {
        return (
            <div>
                <Button bsSize="small" onClick={this.open} disabled={this.props.disabled}
                        title={this.props.disabled ? `Reset zoom to enable filters` : ``}
                        style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                    <Glyphicon glyph="equalizer"/>
                    <span style={{verticalAlign: `middle`}}> Filters</span>
                </Button>

                <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>Filters</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.filters.map(filter => filter.valueGroupings ?
                            this._renderGroupingFilter(filter) :
                            this._renderFlatFilter(filter))}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.apply}
                                style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                            Apply
                        </Button>

                        <Button onClick={this.close}
                                style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

FiltersModal.propTypes = {
    filters: React.PropTypes.arrayOf(filterPropTypes).isRequired,
    selectedFilters: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        valueNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    })).isRequired,

    disabled: React.PropTypes.bool.isRequired,
    onSelectFilters: React.PropTypes.func.isRequired
};

export default FiltersModal;
