import React from 'react';
import xor from 'lodash/xor';

import './Filter.less';

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
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool.isRequired
    })).isRequired,
    selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onSelectFilterValue: React.PropTypes.func.isRequired
};

export default FlatFilter;

