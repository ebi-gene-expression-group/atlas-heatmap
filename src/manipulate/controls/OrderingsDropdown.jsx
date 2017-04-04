import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class OrderingsDropdown extends React.Component{

    handleChange(eventKey, event) {
        event.preventDefault();
        this.props.onSelect(event.target.text);
    }

    _orderingIcon(ordering) {
        switch (ordering) {
            case `Alphabetical order`:
                return `sort-by-alphabet`;
            case `Gene expression rank`:
                return `sort-by-attributes-alt`;
            case `By experiment type`:
                return `sort-by-order`;
            default:
                return `sort-by-order`;
        }
    }

    render() {
        return (
            <div>
                <Dropdown id="orderings-dropdown"
                          onSelect={(key, e) => this.handleChange(key, e)}
                          title={this.props.zoom ? `Reset zoom to enable sorting options` : ``}
                          disabled={this.props.zoom || this.props.hasLessThanTwoRows}>

                    <Dropdown.Toggle bsSize="small"
                                     style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph={this._orderingIcon(this.props.selected)} /> {this.props.selected}
                    </Dropdown.Toggle>

                    <Dropdown.Menu bsSize="small">
                        {this.props.orderings.map(orderingName =>
                            <MenuItem style={{listStyleImage: `none`}} key={orderingName} href="#">
                                {orderingName}
                            </MenuItem>
                        )}
                    </Dropdown.Menu>

                </Dropdown>
            </div>
        )
    }

}

OrderingsDropdown.propTypes = {
    orderings: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    zoom: React.PropTypes.bool.isRequired,
    hasLessThanTwoRows: React.PropTypes.bool.isRequired
};

export default OrderingsDropdown;