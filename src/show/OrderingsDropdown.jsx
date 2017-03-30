const React = require( `react`);
const Dropdown = require(`react-bootstrap/lib/Dropdown`);
const MenuItem = require(`react-bootstrap/lib/MenuItem`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
// const PropTypes = require( `../PropTypes.js`);

const OrderingsDropdown = React.createClass({
    propTypes: {
        // orderings: PropTypes.Orderings,
        disabled: React.PropTypes.bool.isRequired
    },

    handleChange(eventKey, event) {
        this.props.orderings.onSelect(event.target.text);
        event.preventDefault();
    },

    _orderingIcon(ordering) {
        switch (ordering) {
            case `Alphabetical order`:
                return `sort-by-alphabet`;
            case `Gene expression rank`:
                return `sort-by-attributes-alt`;
            case `Default`:
                return `sort-by-order`;
            default:
                return `sort-by-order`;
        }
    },

    render() {
        return (
            <span>
                <Dropdown id="orderings-dropdown" onSelect={this.handleChange} title={this.props.disabled ? `Reset zoom to enable sorting options` : ``}>
                    <Dropdown.Toggle bsSize="small" disabled={this.props.disabled}
                                     style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph={this._orderingIcon(this.props.orderings.selected)} /> {this.props.orderings.selected}
                    </Dropdown.Toggle>
                    <Dropdown.Menu bsSize="small">
                        {this.props.orderings.available.map(orderingName =>
                            (
                                <MenuItem style={{listStyleImage: `none`}} key={orderingName} href="#">{orderingName}</MenuItem>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        )
    }
});

module.exports = OrderingsDropdown;