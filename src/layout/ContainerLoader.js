import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'
import URI from 'urijs'

import Container from './Container.js'

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

const ContainerLoader = (props) => {
  const {inProxy, atlasUrl, fail, sourceUrlFetch} = props

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
      return <Container {...props} data={sourceUrlFetch.value} />
    }
  }
}

ContainerLoader.propTypes = {
    inProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    fail: PropTypes.func
}

export default connect(props => ({
    sourceUrlFetch: props.inProxy + URI(props.sourceUrl, props.atlasUrl).toString(),
}))(ContainerLoader)
