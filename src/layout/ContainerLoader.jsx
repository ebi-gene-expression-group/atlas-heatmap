import React from 'react';
import { connect, PromiseState } from 'react-refetch';
import URI from 'urijs';

import Container from './Container.jsx';

const Loading = ({spinnerUrl}) => <div><img src={spinnerUrl}/></div>;

const failAndShowMessage = ({onFailure, request, message}) => {
  Boolean(onFailure) && onFailure({
    url: request.url,
    method: request.method,
    message: message
  });

  return <div><p>{message}</p></div>;
};

const showMessage = message => failAndShowMessage({
  onFailure: () => {},
  request: {},
  message
});

const ContainerLoader = (props) => {
  const {inProxy, atlasUrl, fail, sourceUrlFetch} = props;

  if (sourceUrlFetch.pending) {

    return <Loading spinnerUrl={inProxy + URI(`resources/images/loading.gif`, atlasUrl).toString()} />;

  } else if (sourceUrlFetch.rejected) {

    return failAndShowMessage({
      onFailure: fail,
      request: sourceUrlFetch.meta.request,
      message: `Error: ${sourceUrlFetch.reason.message}`
    });

  } else if (sourceUrlFetch.fulfilled) {

    if (sourceUrlFetch.value.error) {
      console.log(`inner error`);
      return failAndShowMessage({
        onFailure: fail,
        request: sourceUrlFetch.meta.request,
        message: `Error: ${sourceUrlFetch.reason.message}`
      });
    }

    if (!sourceUrlFetch.value.profiles) {
      return showMessage(`Sorry, no results could be found matching your query.`);
    }

    return <Container {...props} data={sourceUrlFetch.value} />;
  }
};

ContainerLoader.propTypes = {
    inProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    fail: React.PropTypes.func
};

export default connect(props => ({
    sourceUrlFetch: props.inProxy + URI(props.sourceUrl).absoluteTo(props.atlasUrl),
}))(ContainerLoader)
