"use strict";

module.exports = (proxyPrefix, url) => (
    (proxyPrefix.endsWith("http://") || proxyPrefix.endsWith("https://") )
    ? proxyPrefix+url.replace(/^https?:\/\//, "")
    : proxyPrefix+url
  )
