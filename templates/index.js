const header = require('../templates/header.js')
const footer = require('../templates/footer.js')

const posts = data => `
<div class="posts">
  ${JSON.stringify(data.pages)}
</div>
`

const post = data => `
<div class="post">
  ${JSON.stringify(data.page)}
</div>
`

const isHome = data => data.page.path === 'index.html'

module.exports = data => `
${header(data)}
  <h1>${data.title}</h1>
  <div id="content">
    ${isHome(data)
      ? posts(data)
      : post(data)
    }
  </div>
${footer(data)}
`
