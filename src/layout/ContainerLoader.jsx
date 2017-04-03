import React from 'react';
import { connect, PromiseState } from 'react-refetch';
import URI from 'urijs';

import Container from './Container.jsx';

class ContainerLoader extends React.Component {

    render () {
        const {inProxy, atlasUrl, fail, sourceUrlFetch} = this.props;

        if (sourceUrlFetch.pending) {
            return (
                <div>
                    <img src={inProxy + URI(`resources/images/loading.gif`).absoluteTo(atlasUrl)}/>
                </div>
            );
        } else if (sourceUrlFetch.rejected) {

            const error = {
                url: sourceUrlFetch.meta.request.url,
                method: sourceUrlFetch.meta.request.method,
                message: sourceUrlFetch.reason.message
            };
            if (fail) {
                fail(error);
            }
            return <div><p>Error: {error.message}</p></div>;

        } else if (sourceUrlFetch.fulfilled) {
            return (
              <Container {...this.props} data={sourceUrlFetch.value} />
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
