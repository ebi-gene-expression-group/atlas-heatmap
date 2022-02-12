import React from 'react'
import PropTypes from 'prop-types'

const CalloutAlert = ({error}) =>
  <div className={`row column`}>
    <div className={`callout alert`}>
      <h5>Oops!</h5>
      <p>
        {error.description}
      </p>
      <p>
        You may also try <a href="https://topwallpaperpc.com/how-to-force-refresh-browser-cache-to-load-newer-webpages/">to reload
        bypassing your browser cache</a> to avoid seeing stale data or errors.
      </p>
      <p>
        If the error persists, in order to help us debug the issue, please copy the URL from your browser and the error
        message below and send it to us via <a href={`https://www.ebi.ac.uk/support/gxa`}>the EBI Support & Feedback system</a>:
      </p>
      <code className={`small`}>{`${error.name}: ${error.message}`}</code>
    </div>
  </div>

CalloutAlert.propTypes = {
  error: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  })
}

export default CalloutAlert
