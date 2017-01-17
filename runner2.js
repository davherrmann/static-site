const fs = require('fs')
const path = require('path')
const marked = require('marked')

const options = {
  source: './content',
  target: './public',
  template: './template/index.js',
  data: {
    title: 'Hello World!'
  }
}

const fileFrom = (folder, name) => {
  const fullPath = path.join(folder, name)
  const content = fs.readFileSync(fullPath, {encoding: 'utf-8'})

  return {folder, name, fullPath, content}
}

const writeJSON = file => {
  const fullPath = path.join(options.target, file.name.replace(/.md$/, '.json'))
  const content = JSON.stringify({
    md: marked(file.content)
  })
  fs.writeFileSync(fullPath, content)
}

const writeHTML = file => {
  const fullPath = path.join(options.target, file.name.replace(/.md$/, '.html'))
  const content = require(options.template)(options.data)
  fs.writeFileSync(fullPath, content)
}

const writers = [writeJSON, writeHTML]

fs.readdirSync(options.source)
.filter(name => name.endsWith('.md'))
.map(name => fileFrom(options.source, name))
.forEach(file => writers.forEach(writer => writer(file)))
