import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'
import URI from 'urijs'

import Container from './Container'
import CalloutAlert from './CalloutAlert'

const Loading = ({spinnerUrl}) => <div><img alt={`Loading...`} src={spinnerUrl}/></div>

const failAndShowMessage = ({onFailure, request, message}) => {
  Boolean(onFailure) && onFailure({
    url: request.url,
    method: request.method,
    message: message
  })
  return <CalloutAlert
    error={
      {
        description: `There was a problem contacting the Expression Atlas server. Please try again in a few seconds. `,
        name:`Error`,
        message: message
      }
    }
  />
}

const showMessage = message => failAndShowMessage({
  onFailure: () => {},
  request: {},
  message
})

const ContainerLoader = (props) => {
  const {inProxy, atlasUrl, fail, sourceUrlFetch} = props

  if (sourceUrlFetch.pending) {
    return <Loading spinnerUrl={inProxy + URI(`resources/images/loading.gif`, atlasUrl).toString()} />
  } else if (sourceUrlFetch.value === null) {
    // sourceUrlFetch.value===null covers the case in which the promise is rejected and also when the JSON payload is
    // empty; the latter can happen when the web app fails to respond within the EBI time window of 30 seconds
    return failAndShowMessage({
      onFailure: fail,
      request: sourceUrlFetch.meta.request,
      // It’s interesting to note that on an empty response Firefox reports the promise as rejected but Chrome does not
      message: sourceUrlFetch.rejected ? sourceUrlFetch.reason.message : `request to ${sourceUrlFetch.meta.request.url} failed`
    })
  } else if (sourceUrlFetch.fulfilled) {
    if (sourceUrlFetch.value.error) {
      return failAndShowMessage({
        onFailure: fail,
        request: sourceUrlFetch.meta.request,
        message: sourceUrlFetch.value.error
      })
    } else if (!sourceUrlFetch.value.profiles) {
      return showMessage(`Sorry, no results could be found matching your query.`)
    } else {
      return <Container {...props} data={sourceUrlFetch.value} />
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
  fail: PropTypes.func
}

export default connect(props => ({
  sourceUrlFetch: {
    headers: {
      //the Atlas webapp is based on Spring; given this header it'll understand the body content to be equivalent to query parameters
      'Content-Type': `application/x-www-form-urlencoded`
    },
    url: props.inProxy + URI(props.source.endpoint, props.atlasUrl),
    method: `POST`, //the webapp also supports GET - we do POST in case the parameters get very large
    body: Object.entries(props.source.params).map(p =>`${p[0]}=${typeof p[1] === `string` ? p[1] : JSON.stringify(p[1])}`).join(`&`)
  },
}))(ContainerLoader)
