const meta = require('./meta.js')

module.exports = data => `
<html>
  <head>
    ${meta(data)}
  </head>
  <body>
`
