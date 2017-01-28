const runner = require('./generator')
const {minifyHtml} = require('./plugins')

const configuration = {
  title: 'I ♡ SOFTWARE',
  author: 'David Herrmann',
  // TODO make config injectable via command line?
  baseUrl: 'http://192.168.0.101:8080'
}

const s = runner(configuration)

// TODO possible solution for rendering
const renderPlugin = template => context => Object.assign({}, context, {
  file: Object.assign({}, context.file, {
    content: template(context.file.content)
  })
})

// API would be s.file('index.html', renderPlugin(template), minifyHtml()).path()
const template = context => `
  <!DOCTYPE html>
  <body>
    <h1>Hello World!</h1>
    ${context.file.name}
  </body>
`

// TODO too clumsy (Object.assign, returning the whole file!)
const render = config => file => Object.assign({}, file, {
  content: `
    <!DOCTYPE html>
    <body>
      <h1>Hello World!</h1>
    </body>
  `
})

s.file('index.html', render(configuration), minifyHtml()).path()
