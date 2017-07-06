import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import FlatFilter from './FlatFilter.js'
import GroupingFilter from './GroupingFilter.js'

import {filterPropTypes} from '../../../manipulate/chartDataPropTypes.js'

class FiltersModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentTab: this.props.filters[0].name,
            showModal: false
        }

        this.open = this._open.bind(this)
        this.close = this._close.bind(this)
        this.onSelectFilterValue = this._onSelectFilterValue.bind(this)
    }

    _close() {
        this.setState({
            showModal: false
        })
    }

    _open() {
        this.setState({
            showModal: true
        });
    }

    _onSelectFilterValue(filterName, newFilterValues) {
        this.props.onSelectFilters(this.props.selectedFilters.map(previousSelectedFilter =>
            ({
                name: previousSelectedFilter.name,
                valueNames: previousSelectedFilter.name === filterName ?
                    newFilterValues :
                    previousSelectedFilter.valueNames.map(valueName => valueName)
            })
        ))
    }

    _renderFlatFilter(filter) {
        return (
            <FlatFilter key={filter.name}
                        selected={this.props.selectedFilters.find(selectedFilter => selectedFilter.name === filter.name).valueNames}
                        onSelectFilterValue={this.onSelectFilterValue}
                        {...filter}
            />
        )
    }

    _renderGroupingFilter(filter) {
        return (
            <GroupingFilter key={filter.name}
                            selected={this.props.selectedFilters.find(selectedFilter => selectedFilter.name === filter.name).valueNames}
                            onSelectFilterValue={this.onSelectFilterValue}
                            {...filter}
            />
        )
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
                    {this.props.filters.length > 1
                     ? <ul className="nav nav-tabs">
                        {
                            this.props.filters.map(f => (
                                <li key={f.name}
                                    className={f.name==this.state.currentTab ? "active" : ""}>
                                    <a href="#" onClick={()=>{this.setState({currentTab: f.name})}}>
                                        {f.name}
                                    </a>
                                </li>
                            ))
                        }
                        </ul>
                     : <h4 className="modal-title"> Filters </h4>
                    }
                    </Modal.Header>

                    <Modal.Body >
                        {this.props.filters
                            .filter(filter => filter.name==this.state.currentTab)
                            .map(filter => filter.valueGroupings ?
                            this._renderGroupingFilter(filter) :
                            this._renderFlatFilter(filter))}
                    </Modal.Body>

                    <Modal.Footer>
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
    filters: PropTypes.arrayOf(filterPropTypes).isRequired,
    selectedFilters: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        valueNames: PropTypes.arrayOf(PropTypes.string).isRequired
    })).isRequired,

    disabled: PropTypes.bool.isRequired,
    onSelectFilters: PropTypes.func.isRequired
}

export default FiltersModal
