import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'
import URI from 'urijs'

const Loading = ({spinnerUrl}) => <div><img src={spinnerUrl}/></div>

const failAndShowMessage = ({onFailure, request, message}) => {
  Boolean(onFailure) && onFailure({
    url: request.url,
    method: request.method,
    message: message
  })

  return <div><p>{message}</p></div>
}

const showMessage = message => failAndShowMessage({
  onFailure: () => {},
  request: {},
  message
})

const ContainerLoader = ({inProxy, atlasUrl, fail, sourceUrlFetch, render}) => {

  if (sourceUrlFetch.pending) {

    return <Loading spinnerUrl={inProxy + URI(`resources/images/loading.gif`, atlasUrl).toString()} />

  } else if (sourceUrlFetch.rejected) {

    return failAndShowMessage({
      onFailure: fail,
      request: sourceUrlFetch.meta.request,
      message: `Error: ${sourceUrlFetch.reason.message ? sourceUrlFetch.reason.message : `Unknown cause, please contact arrayexpress-atlas@ebi.ac.uk`}`
    })

  } else if (sourceUrlFetch.fulfilled) {

    if (sourceUrlFetch.value.error) {
      return failAndShowMessage({
        onFailure: fail,
        request: sourceUrlFetch.meta.request,
        message: `${sourceUrlFetch.value.error}`
      })
    } else if (!sourceUrlFetch.value.profiles) {
      return showMessage(`Sorry, no results could be found matching your query.`)
    } else {
      return render(sourceUrlFetch.value)
    }
  }
}

ContainerLoader.propTypes = {
    inProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    source: PropTypes.shape({
        endpoint: PropTypes.string.isRequired,
        params: PropTypes.object.isRequired
    }).isRequired,
    render: PropTypes.func.isRequired,
    fail: PropTypes.func
}

export default connect(props => ({
    sourceUrlFetch: {
        headers: {
            //the Atlas webapp is based on Spring; given this header it'll understand the body content to be equivalent to query parameters
            'Content-Type': "application/x-www-form-urlencoded"
        },
        url: props.inProxy + URI(props.source.endpoint, props.atlasUrl),
        method: "POST", //the webapp also supports GET - we do POST in case the parameters get very large
        body: Object.entries(props.source.params).map(p =>`${p[0]}=${typeof p[1] === 'string' ? p[1] : JSON.stringify(p[1])}`).join("&")
    },
}))(ContainerLoader)
