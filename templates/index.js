const moment = require('moment')

const header = data => `
<!DOCTYPE html>
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

    <title>${isHome(data.page) ? data.meta.title : data.page.meta.title + ' &middot; ' + data.meta.title}</title>

    <!-- TODO canonical link, rss link, language in html and body-->

    <link rel="stylesheet" href="theme.css">
  </head>
  <body>
`

const sidebar = data => `
<div class="sidebar">
  <div class="container">
    <div class="sidebar-about">
      <a href="${data.meta.baseUrl}">
        <h1>
          I <i class="fa fa-heart-o" aria-hidden="true"></i> SOFTWARE
        </h1>
      </a>
      <p class="lead">
        ${data.meta.description}
      </p>
    </div>

    <ul class="sidebar-nav">
      <li><a href="/">Home</a></li>
      ${data.meta.menu.map(({name, url}) => `
        <li><a href="${url}">${name}</a></li>
      `).join('')}
    </ul>

    <p class="footnote">${data.meta.copyright}</p>
  </div>
</div>
`

const footer = data => `
    <script src="calc-results.js"></script>
  </body>
</html>
`

const posts = data => `
<div class="posts">
  ${data.files
    .filter(file => !isHome(file))
    .reduce((list, page) => list + `
      <div class="post">
        <h1 class="post-title">
          <a href="${useFolder(page.path)}">
            ${page.meta.title}
          </a>
        </h1>
        <span class="post-date">${moment(page.meta.date).format('LL')}</span>
        ${page.content}
      </div>
    `, '')
  }
</div>
`

const post = data => `
<div class="post">
  <h1 class="post-title">${data.page.meta.title}</h1>
  <span class="post-date">${moment(data.page.meta.date).format('LL')}</span>
  ${data.page.content}
</div>
`

const isHome = page => page.path === 'index.html'

const useFolder = link => link.replace('index.html', '')

module.exports = data => `
${header(data)}
  ${sidebar(data)}
  <div class="content container">
    ${isHome(data.page)
      ? posts(data)
      : post(data)
    }
  </div>
${footer(data)}
`
