const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')
const marked = require('marked')

const DEFAULT_OPTIONS = {
  source: './content',
  target: './public'
}

// util functions

const readFile = data => file => ({
  path: path.relative(data.options.source, file),
  name: path.basename(file),
  content: fs.readFileSync(file, {encoding: 'utf-8'})
})

// plugins

const readFiles = () => data => ({
  files: glob.sync('./content/**/*.md').map(readFile(data))
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

const markdown = () => data => {
  return {
    files: data.files.map(file => {
      return Object.assign(file, {
        path: file.path.replace(/md$/, 'html'),
        name: file.name.replace(/md$/, 'html'),
        content: marked(file.content)
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
      path: 'index.html',
      name: 'index.html',
      content: ''
    }])
  }
}

const clearTargetDirectory = () => data => fse.emptyDirSync(data.options.target)

const writeFiles = () => data => {
  data.files.forEach(file => {
    const targetPath = path.join(data.options.target, file.path)
    fse.mkdirsSync(path.dirname(targetPath))
    fs.writeFileSync(targetPath, file.content)
  })
}

const folderInsteadOfHtmlExtension = () => data => {
  return {
    files: data.files.map(file => file.name === 'index.html'
      ? file
      : Object.assign(file, {
        path: file.path.replace(/\.html$/, '/index.html'),
        name: 'index.html'
      }))
  }
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
.use(markdown())
.use(folderInsteadOfHtmlExtension())
.use(render(require('./templates/index.js')))
.use(clearTargetDirectory())
.use(writeFiles())
.use(logData())
.build()
