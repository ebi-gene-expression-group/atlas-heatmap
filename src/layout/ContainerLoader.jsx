import React from 'react';
import { connect, PromiseState } from 'react-refetch';
import URI from 'urijs';

import Container from './Container.jsx';

const Loading = ({spinnerUrl}) => (
  <div>
      <img src={spinnerUrl}/>
  </div>
)

const failAndShowMessage = ({onFailure, request, message}) => {
  !!onFailure && onFailure({
    url: request.url,
    method: request.method,
    message: message
  })

  return (
     <div><p>Error: {message}</p></div>
  )
}

const ContainerLoader = (props) => {
  const {inProxy, atlasUrl, fail, sourceUrlFetch} = props
  if (sourceUrlFetch.pending) {
    return(
       <Loading spinnerUrl={inProxy + URI(`resources/images/loading.gif`).absoluteTo(atlasUrl)} />
     )
  } else if (sourceUrlFetch.rejected) {
    return failAndShowMessage({
      onFailure: fail,
      request: sourceUrlFetch.meta.request,
      message: sourceUrlFetch.reason.message
    })
  } else if (sourceUrlFetch.fulfilled) {
    if(sourceUrlFetch.value.error){
      return failAndShowMessage({
        onFailure: fail,
        request: sourceUrlFetch.meta.request,
        message: sourceUrlFetch.value.error
      })
    } else {
      return (
        <Container {...props} data={sourceUrlFetch.value} />
      )
    }
  }
}

ContainerLoader.propTypes = {
    inProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    fail: React.PropTypes.func
};

export default connect(props => ({
    sourceUrlFetch: props.inProxy + URI(props.sourceUrl).absoluteTo(props.atlasUrl),
}))(ContainerLoader)
