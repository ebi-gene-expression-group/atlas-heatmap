import React from 'react';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import xor from 'lodash/xor';
import './Filter.less';

class FilterOption extends React.Component {
    toggleAll(){
        this.props.onNewSelected(xor(this.props.values,this.props.selected).length ? this.props.values : [])
    }

    toggleOne(valueName){
        this.props.onNewSelected(xor(this.props.selected, [valueName]));
    }

    toggleOpen(){
        this.props.onToggleOpen()
    }

    render(){
        const allChecked = this.props.values.every(v => this.props.selected.includes(v));
        const allUnchecked = this.props.values.every(v => !this.props.selected.includes(v));

        // Indeterminate is only a visual state, logically they are unchecked
        return (
            <div className="filterBody">
                <input type="checkbox"
                       value={this.props.name}
                       onChange={() => this.toggleAll()}
                       checked={allChecked}
                       ref={checkbox => {checkbox ? checkbox.indeterminate = !allChecked && !allUnchecked : null}}
                />

                <div className="groupName"
                     onClick={() => this.toggleOpen()}
                     href="#">
                    {this.props.name} {<Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={this.props.isOpen ? `menu-up` : `menu-down`}/>}
                </div>

                {this.props.isOpen &&
                <div className="options">
                    {this.props.values.map(value => (
                        <div className="option" key={value}>
                          <input type="checkbox"
                                 value={value}
                                 onChange={() => this.toggleOne(value)}
                                 checked={this.props.selected.includes(value)}/>
                          <span> {value}</span>
                        </div>
                    ))}
                </div>
                }
            </div>
        )
    }
}

FilterOption.propTypes = {
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onToggleOpen: React.PropTypes.func.isRequired,
    onNewSelected: React.PropTypes.func.isRequired
};


class GroupingFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupsUserAskedToKeepOpen: []
        }
    }

    _renderValueGrouping(name, values) {
        const userWantedOpen = this.state.groupsUserAskedToKeepOpen.includes(name);
        const selectedHere = this.props.selected.filter(e => values.includes(e));
        const selectedNotHere = this.props.selected.filter(e => !values.includes(e));
        // isOpen={userWantedOpen || impliedOpen} is a nifty idea, but the user loses focus and there are potentially
        // too many things going on; we could think of using CSS animations (such as a background fading highlight on
        // the affected tissues to signal the interactions between subsystems)
        //const impliedOpen = !(selectedHere.length === 0 || values.every(v => selectedHere.includes(v)));
        return (
            <FilterOption key={name}
                          name={name}
                          values={values}
                          selected={selectedHere}
                          isOpen={userWantedOpen}
                          onToggleOpen={() => {
                              this.setState(previousState =>
                                  ({
                                      groupsUserAskedToKeepOpen: xor(previousState.groupsUserAskedToKeepOpen, [name])
                                  })
                              )
                          }}
                          onNewSelected={selectedInThisOption => {
                              this.props.onSelectFilterValue(this.props.name, selectedNotHere.concat(selectedInThisOption))
                          }}/>
        )
    }

    render() {
        return (
            <div className="gxaFilter">
                <h5>{this.props.name}</h5>

                <ButtonGroup>
                    <Button bsSize="xsmall"
                            onClick={() => {this.props.onSelectFilterValue(this.props.name, this.props.values.map(value => value.name))}}
                            style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph="plus"/>
                        <span style={{verticalAlign: `middle`}}> Choose all</span>
                    </Button>

                    <Button bsSize="xsmall"
                            onClick={() => {this.props.onSelectFilterValue(this.props.name, [])}}
                            style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph="minus"/>
                        <span style={{verticalAlign: `middle`}}> Remove all</span>
                    </Button>
                </ButtonGroup>

                {this.props.valueGroupings.map(a => this._renderValueGrouping(a[0], a[1]))}
            </div>
        )
    }
}

GroupingFilter.propTypes = {
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool.isRequired
    })).isRequired,
    valueGroupings: React.PropTypes.array,  // Indirectly validated as [string, array of strings] in FilterOption
    onSelectFilterValue: React.PropTypes.func.isRequired
};

export default GroupingFilter;
