const header = data => `
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=aljv5RGPao">
    <link rel="icon" type="image/png" href="/favicon-32x32.png?v=aljv5RGPao" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-16x16.png?v=aljv5RGPao" sizes="16x16">
    <link rel="manifest" href="/manifest.json?v=aljv5RGPao">
    <link rel="mask-icon" href="/safari-pinned-tab.svg?v=aljv5RGPao" color="#49045f">
    <link rel="shortcut icon" href="/favicon.ico?v=aljv5RGPao">
    <meta name="apple-mobile-web-app-title" content="I ♡ SOFTWARE">
    <meta name="application-name" content="I ♡ SOFTWARE">
    <meta name="theme-color" content="#49045f">

    <base href="${data.meta.baseUrl}">

    <title>${isHome(data.page) ? data.title : data.page.title}</title>

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

const useFolder = link => link.replace('index.html', '')

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
