const React = require(`react`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const PropTypes = require(`../../PropTypes.js`);
const xor = require(`lodash/xor`);
require('./Components.less');


const FilterOption = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    selectDisabled: React.PropTypes.bool.isRequired,
    closeDisabled: React.PropTypes.bool.isRequired,
    onToggleOpen: React.PropTypes.func.isRequired,
    onNewSelected: React.PropTypes.func.isRequired
  },

  toggleAll(evt){
    this.props.onNewSelected(
      xor(this.props.values,this.props.selected).length
      ? this.props.values
      : []
    )
  },

  toggleOne(which, evt){
    this.props.onNewSelected(xor(this.props.selected,[which]))
  },

  toggleOpen(evt){
    this.props.onToggleOpen()
  },

  render(){
    return (
      <div className="filterBody">
        <input type="checkbox"
          value={this.props.name}
          onChange={this.toggleAll}
          disabled={this.props.selectDisabled}
          checked={this.props.values.every((v) => this.props.selected.indexOf(v)>-1)}/>
        <div className="groupName"
           onClick={this.props.closeDisabled?()=>{}: this.toggleOpen}
           href="#">
           {this.props.name}
           {!this.props.closeDisabled &&
             <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={this.props.isOpen? "menu-up" : "menu-down"}/>
           }
        </div>
        {this.props.isOpen &&
          <div className="options">
          {this.props.values.map((value) => (
            <span className="option" key={value}>
              <input type="checkbox"
                value={value}
                onChange={(evt)=>this.toggleOne(value, evt)}
                disabled={this.props.selectDisabled}
                checked={this.props.selected.indexOf(value)>-1}/>
                <span> {value}</span>
            </span>
          ))}
          </div>
        }
      </div>
    )
  }
})


const GroupedFilter = React.createClass({
  propTypes: Object.assign({},PropTypes.FilterProps, {
      propagateFilterSelection: React.PropTypes.func.isRequired,
      disabled:React.PropTypes.bool.isRequired
  }),

  getInitialState(){
    return {
      groupsUserAskedToKeepOpen: []
    }
  },

  renderValueGrouping(name, values){
    const userWantedOpen = this.state.groupsUserAskedToKeepOpen.indexOf(name)>-1
    const selectedHere = this.props.selected.filter((e)=>values.indexOf(e)>-1)
    const selectedNotHere = this.props.selected.filter((e)=>values.indexOf(e)==-1)
    const impliedOpen = !(selectedHere.length == 0 || values.every((v) => selectedHere.indexOf(v)>-1))
    return (
      <FilterOption key={name}
        name={name}
        values={values}
        selected={selectedHere}
        isOpen={userWantedOpen || impliedOpen}
        selectDisabled={this.props.disabled}
        closeDisabled={impliedOpen}
        onToggleOpen={()=>{this.setState((previousState)=>({groupsUserAskedToKeepOpen: xor(previousState.groupsUserAskedToKeepOpen, [name])}))}}
        onNewSelected={(selectedInThisOption)=>{
          this.props.propagateFilterSelection(
            selectedNotHere
            .concat(selectedInThisOption)
          )
        }}/>
    )
  },

  render() {
    return (
      <div className="gxaFilter">
        <h4>{this.props.name}</h4>
        <Button bsSize="xsmall" onClick={() => {
            this.props.propagateFilterSelection(this.props.values)
          }}>
          <Glyphicon glyph="plus"/>
          <span style={{verticalAlign: `middle`}}> Choose all</span>
        </Button>
        <Button bsSize="xsmall" onClick={() => {
          this.props.propagateFilterSelection([])
          }}>
          <Glyphicon glyph="minus"/>
          <span style={{verticalAlign: `middle`}}> Remove all</span>
        </Button>
        {
          this.props.valueGroupings.map((a)=>this.renderValueGrouping(a[0], a[1]))
        }
      </div>
    )
  }
})
module.exports = GroupedFilter;
