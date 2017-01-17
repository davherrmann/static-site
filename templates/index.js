const header = data => `
<html>
  <head>
    <meta charset="utf-8">

    <link rel="stylesheet" href="theme.css">
  </head>
  <body>
`

const footer = data => `
  </body>
</html>
`

const posts = data => `
<ul class="posts">
  ${data.files
    .filter(file => !isHome(file))
    .reduce((list, page) => list + `
      <li><a href="${useFolder(page.path)}">${useFolder(page.path)}</a></li>
    `, '')
  }
</ul>
`

const post = data => `
<div class="post">
  ${data.page.content}
</div>
`

const isHome = page => page.path === 'index.html'

const useFolder = link => link.replace('/index.html', '')

module.exports = data => `
${header(data)}
  <h1>${data.meta.title}</h1>
  <div id="content">
    ${isHome(data.page)
      ? posts(data)
      : post(data)
    }
  </div>
${footer(data)}
`
