const fs = require('fs')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')

const DEFAULT_OPTIONS = {
  source: './content',
  target: './public'
}

const data = {
  files: {},
  meta: {
    title: 'test'
  },
  options: DEFAULT_OPTIONS
}

// util functions

const readFile = file => ({
  path: file,
  name: path.basename(file),
  content: fs.readFileSync(file, {encoding: 'utf-8'})
})

// plugins

const readFiles = () => data => ({
  files: glob.sync('./content/**/*.md').map(readFile)
})

const options = (options) => data => {
  options = Object.assign(DEFAULT_OPTIONS, options)
  return {options}
}

const meta = (meta) => data => ({meta})

const yamlFrontMatter = () => data => {
  return {
    files: data.files.map(file => {
      const {data, content} = matter(file.content)
      return Object.assign(file, {
        meta: data,
        content
      })
    })
  }
}

const render = template => data => {
  return {
    files: data.files.map(file => {
      const pageData = Object.assign({}, data, {
        page: {}
      })
      return Object.assign(file, {
        content: template(pageData)
      })
    })
  }
}

const logData = () => data => console.log(JSON.stringify(data, null, 2))

// runner

const runner = () => {
  let plugins = []
  let data = {}

  return {
    use (plugin) {
      plugins.push(plugin)
      return this
    },
    build () {
      plugins.forEach(plugin => {
        data = Object.assign(data, plugin(data))
      })
    }
  }
}

runner()
.use(options({
  testOption: 'test'
}))
.use(meta({
  title: 'Hello World!'
}))
.use(readFiles())
.use(yamlFrontMatter())
.use(render(require('./templates/index.js')))
.use(logData())
.build()
