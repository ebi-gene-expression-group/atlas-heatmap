import React from 'react'
import PropTypes from 'prop-types'

class GeneTooltip extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: !!this.props.data,
      error: false,
      data: this.props.data || {
        synonyms: [],
        goterms: [],
        interproterms: []
      }
    }
  }

  componentDidMount() {
    if(this.state.loaded){
      return
    }
    // TODO Use react-refetch
    //https://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
    const xhr = new XMLHttpRequest()
    xhr.open('GET', this.props.atlasBaseURL+"/json/genename-tooltip?identifier="+this.props.id, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {//request done
        if (xhr.status === 200) {
          var result = JSON.parse(xhr.responseText)
          this.setState({data: result, loaded: true})
          this.props.onAjaxSuccessfulCacheResult && this.props.onAjaxSuccessfulCacheResult(result)
        } else {
          this.setState({error: xhr.status,loaded: true})
        }
      }
    }.bind(this)
    xhr.send()
  }

  _row(name, values) {
    return (
      <div>
        <span className="propertyName">
          {name}
        </span>
        <span className="propertyValues">
          {values}
        </span>
      </div>
    )
  }

  _propertyValueList(values) {
    return values.map(
      (value) => (
        <span className="propertyValue" key={value}>
          {value}
        </span>
        )
    )
  }

  _bracketedList(values) {
    return (
      values.length
      ? [<span key ="(">{"("}</span>]
        .concat(this._propertyValueList(values))
        .concat([<span key =")">{")"}</span>])
      : []
    )
  }

  render() {
    return (
      <div className="gxaGeneTooltip">
        {this._row(this.props.label,
          this._bracketedList(
            [].concat.apply([],
              [this.props.label]
              .concat(this.state.data.synonyms)
              .indexOf(this.props.id)===-1
              ? [this.props.id]
              : []
            , this.state.data.synonyms)
          )
        )}
        {(this.props.designElement)
          ? this._row("Design element:", this._propertyValueList([this.props.designElement]))
          : null}
        {(this.state.data.goterms.length)
          ? this._row("Gene ontology terms:", this._propertyValueList(this.state.data.goterms))
          : null}
        {(this.state.data.interproterms.length)
          ? this._row("Interpro terms:", this._propertyValueList(this.state.data.interproterms))
          :null}
        {this.state.loading? <div>...</div> : null}
        {this.state.error? <div>{"Error: "+this.state.error}</div> : null}

      </div>
    )
  }
}

GeneTooltip.propTypes = {
  atlasBaseURL: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  designElement:PropTypes.string,
  data: PropTypes.shape({
    synonyms: PropTypes.arrayOf(PropTypes.string).isRequired,
    goterms: PropTypes.arrayOf(PropTypes.string).isRequired,
    interproterms: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  onAjaxSuccessfulCacheResult: PropTypes.func
}

export default GeneTooltip
