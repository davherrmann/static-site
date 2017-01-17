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
        page: file
      })
      return Object.assign(file, {
        content: template(pageData)
      })
    })
  }
}

const logData = () => data => console.log(JSON.stringify(data, null, 2))

const createIndexFile = () => data => {
  return {
    files: data.files.concat([{
      path: './index.html',
      name: 'index.html',
      content: ''
    }])
  }
}

const writeFiles = () => data => {
  data.files.forEach(file => {
    const targetPath = path.join(data.options.target, path.relative(data.options.source, file.path))
    fs.writeFileSync(targetPath, file.content)
  })
}

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
.use(createIndexFile())
.use(yamlFrontMatter())
.use(render(require('./templates/index.js')))
.use(writeFiles())
.use(logData())
.build()
