# [David's Blog](https://i.love.software) [![Build Status](https://travis-ci.org/davherrmann/davherrmann.github.io.svg?branch=sources)](https://travis-ci.org/davherrmann/davherrmann.github.io)

**TODO some ideas for a better site generation system**


```jsx
import {file} from 'loaders'
import {minifyCss, markdown, minifyHtml} from 'plugins'

// custom css loader
// file('x/y/z.css', minifyCss).path() -> css('x/y/z.css')
// maybe remove the path() call so we can use either path() or content?
const css = path => file(path, minifyCss).path()

// path() indicates that the file should be processed and served as a static file

// TODO
// what about static references in *.md files?
// instead of minifying css as a "file end user", there could be a minify-plugin
//   hooked into file.content()? -> does it work when a file needs to be processed
//   in different ways? e.g. md -> minified html & json for ajax?

const frontmatter = config => file =>

const configuration = {
  title: 'I ♡ SOFTWARE',
  author: 'David Herrmann'
  // TODO make config injectable via command line?
  baseUrl: 'http://192.168.0.101:8080',

}

const runner = configuration => ({
  file: (path, ...plugins) => {...},
  files: (path, ...plugins) => {...}
})

const {file, files} = runner(configuration)

const sampleFile = {
  path: 'css/theme.css',
  name: 'theme.css',
  content: '* {color: black;}'
}

export default render = config => file => `
  <!DOCTYPE html>
  <head>
    <link ref="stylesheet" src="${css('css/theme.css')}"
    <style>${file('css/theme-inline.css', minifyCss()).content}</style>
  </head>
  <body>
    <div class="sidebar">
      <a href="${file('blog', renderPostList(config)).path()}">Blog</a>
    </div>
    <div class="content">
      <h1>Blog</h1>
      <ul>
        ${files('blog/*.md', frontmatter(), markdown(), minifyHtml(), render(config)).map(file => `
            <li class="post">
              <h2><a href="${file.path()}">${file.meta.title}</a></h2>
              ${file.content}
            </li>
          `)}
      </ul>
    </div>
  </body>
`


// maybe we don't even need a structure! we start with a root render(), all
// dependencies and subsequent renders are declared in the root render() or
// its dependencies
export const structure = {
  "/": {
    hasIndex: true,
    children: {
      "about": {

      },
      "blog": {
        hasIndex: true,
        children: {
          "*": {

          }
        }
      }
    }
  }
}
```
