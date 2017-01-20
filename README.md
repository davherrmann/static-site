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

const configuration = {
  title: "I ♡ SOFTWARE",
  baseUrl
}

export default render = config => `
  <!DOCTYPE html>
  <head>
    <link ref="stylesheet" src="${css('css/theme.css')}"
    <style>${file('css/theme-inline.css', minifyCss).content}</style>
  </head>
  <body>
    <h1>Blog</h1>
    <ul>
      ${files('blog/*.md', markdown, minifyHtml).map(file => `
          <li class="post">
            <h2><a href="${file.path()}">${file.meta.title}</a></h2>
            ${file.content}
          </li>
        `)}
    </ul>
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
