const fs = require('fs')
const fse = require('fs-extra')
const glob = require('glob')
const moment = require('moment')
const path = require('path')
const {createFile, createLink} = require('ritter')
const {plugins: {render, markdown, minifyCss, minifyHtml, yamlFrontMatter}} = require('ritter')

const doc = createFile({
  baseUrl: 'http://127.0.0.1:8080/',
  copyright: '© David Herrmann',
  description: 'code by David Herrmann',
  menu: [
    {name: 'Blog', url: 'blog/'}
  ],
  source: './site',
  title: 'I ♡ SOFTWARE'
})

const dependencies = []

const link = createLink(dependencies)

const header = ({configuration, file}) => `
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
    <meta name="apple-mobile-web-app-title" content="${configuration.title}">
    <meta name="application-name" content="${configuration.title}">
    <meta name="theme-color" content="#49045f">

    <base href="${configuration.baseUrl}">

    <title>
      ${file.meta.title
        ? file.meta.title + ' &middot; ' + configuration.title
        : configuration.title}
    </title>

    <!-- TODO canonical link, rss link, language in html and body-->

    <link rel="stylesheet" href="${link(doc('css/fonts.css', minifyCss()))}">
    <link rel="stylesheet" href="${link(doc('css/theme.css', minifyCss()))}">
  </head>
  <body>
`

const sidebar = ({configuration, file}) => `
<div class="sidebar">
  <div class="container">
    <div class="sidebar-about">
      <a href="${configuration.baseUrl}">
        <h1>
          I <i class="fa fa-heart-o" aria-hidden="true"></i> SOFTWARE
        </h1>
      </a>
      <p class="lead">
        ${configuration.description}
      </p>
    </div>

    <ul class="sidebar-nav">
      <li><a href="/">Home</a></li>
      ${configuration.menu.map(({name, url}) => `
        <li><a href="${url}">${name}</a></li>
      `).join('')}
    </ul>

    <p class="footnote">${configuration.copyright}</p>
  </div>
</div>
`

const footer = context => `
    <script src="calc-results.js"></script>
  </body>
</html>
`

const frame = context => `
  ${header(context)}
  ${sidebar(context)}

  <div class="content container">
    ${context.file.content}
  </div>

  ${footer(context)}
`

const blogFiles = configuration => glob.sync('blog/*.md', {cwd: configuration.source})

const posts = ({configuration}) => `
  <div class="posts">
    ${blogFiles(configuration).map(path => doc(path, yamlFrontMatter(), markdown(), render(({file}) => `
      <div class="post">
        <h1 class="post-title">
          <a href="${link(doc(file.path, render(file.content), render(frame), minifyHtml()))}">
            ${file.meta.title}
          </a>
        </h1>
        <span class="post-date">${moment(file.meta.date).format('LL')}</span>
        ${file.content}
      </div>
    `), minifyHtml()).content).join('')}
  </div>
`

const homeFile = doc('index.html', render(context => `
  ${header(context)}
  ${sidebar(context)}

  <div class="content container">
    ${posts(context)}
  </div>

  ${footer(context)}
`), minifyHtml())

link(homeFile)
console.log(dependencies.map(file => file.path))

const writeTargetFile = file => {
  const targetPath = path.join('generated', file.path)
  fse.mkdirsSync(path.dirname(targetPath))
  fs.writeFileSync(targetPath, file.content)
}

dependencies.forEach(writeTargetFile)
