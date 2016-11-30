const React = require(`react`);
const PropTypes = require(`../../PropTypes.js`);
const xor = require(`lodash/xor`);

require('./Components.less');

const FlatFilter = React.createClass({
  propTypes: Object.assign({},PropTypes.FilterProps, {
      propagateFilterSelection: React.PropTypes.func.isRequired,
      disabled:React.PropTypes.bool.isRequired
  }),

  toggleOne(which, evt){
    this.props.propagateFilterSelection(xor(this.props.selected,[which]))
  },

  render() {
    return (
      <div className="gxaFilter">
        <h4>{this.props.name}</h4>
        <div className="filterBody">
          <div className="options">
          {this.props.values.map((value) => (
            <div key={value}>
              <input type="checkbox"
                value={value}
                onChange={(evt)=>this.toggleOne(value, evt)}
                disabled={this.props.selectDisabled}
                checked={this.props.selected.indexOf(value)>-1}/>
              {value}
            </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
})
module.exports = FlatFilter;
