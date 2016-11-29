const React = require(`react`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const PropTypes = require(`../../PropTypes.js`);
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
    debugger;
    //TODO call onNewSelected either with all or with nothing
  },
  toggleOne(which, evt){
    debugger;
    //TODO call onNewSelected with selected and this one element added/excluded
  },
  toggleOpen(evt){
    debugger;
    //TODO call onToggleOpen
  },
  render(){
    return (
      <div className="gxaHeatmapModalSelectionMenu">
        <input type="checkbox"
          value={this.props.name}
          onChange={this.toggleAll}
          disabled={this.props.selectDisabled}
          checked={this.props.values.every((v) => this.props.selected.indexOf(v)>-1)}/>
        <a className="groupName"
           onClick={this.toggleOpen}
           href="#">
           {this.props.name}
           <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={this.props.isOpen? "menu-up" : "menu-down"}/>
        </a>
        {this.props.isOpen &&
          <div className="options">
          {this.props.values.map((value) => (
              <input type="checkbox"
                value={value}
                onChange={(evt)=>this.props.toggleOne(value, evt)}
                disabled={this.props.selectDisabled}
                checked={this.props.selected.indexOf(value)>-1}/>
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
    const userWantsOpen = this.state.groupsUserAskedToKeepOpen.indexOf(name)>-1
    const selectedHere = this.props.selected.filter((e)=>values.indexOf(e)>-1)
    const selectedNotHere = this.props.selected.filter((e)=>values.indexOf(e)==-1)
    const impliedOpen = !(selectedHere.length == 0 || values.every((v) => selectedHere.indexOf(v)>-1))
    return (
      <FilterOption key={name}
        name={name}
        values={values}
        selected={selectedHere}
        isOpen={userWantsOpen || impliedOpen}
        selectDisabled={this.props.disabled}
        closeDisabled={impliedOpen}
        onToggleOpen={()=>{
          userWantsOpen
          ? this.state.groupsUserAskedToKeepOpen.filter((_f)=>(_f.name!=_filter.name))
          : this.state.groupsUserAskedToKeepOpen.concat([_filter.name])
        }}
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
        {
          this.props.valueGroupings.map((a)=>this.renderValueGrouping(a[0], a[1]))
        }
      </div>
    )
  }
})
module.exports = GroupedFilter;
