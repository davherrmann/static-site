const minifier = require('html-minifier')

const minifyHtml = () => file => Object.assign({}, file, {
  content: minifier.minify(file.content, { collapseWhitespace: true })
})

module.exports = {
  minifyHtml
}
