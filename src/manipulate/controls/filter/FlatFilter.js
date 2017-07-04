import React from 'react'
import PropTypes from 'prop-types'
import xor from 'lodash/xor'

import './Filter.css'

class FlatFilter extends React.Component {
    _toggleFilterValue(filterValueName) {
        this.props.onSelectFilterValue(this.props.name, xor(this.props.selected, [filterValueName]))
    }

    render() {
        return (
            <div className="gxaFilter">
                <h5>{this.props.name}</h5>
                <div className="filterBody">
                    <div>
                        {this.props.values.map(value => (
                            <div key={value.name}>
                                <input type="checkbox"
                                       value={value.name}
                                       onChange={() => this._toggleFilterValue(value.name)}
                                       disabled={value.disabled}
                                       checked={this.props.selected.includes(value.name)}
                                />
                                <span style={{color: value.disabled ? `grey` : ``}}>{value.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

FlatFilter.propTypes = {
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired
    })).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectFilterValue: PropTypes.func.isRequired
}

export default FlatFilter

