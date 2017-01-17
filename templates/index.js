const header = require('../templates/header.js')
const footer = require('../templates/footer.js')

const posts = data => `
<div class="posts">
  ${JSON.stringify(data.files
    .filter(file => !isHome(file))
    .reduce((list, page) => list.concat([page.path]), [])
  )}
</div>
`

const post = data => `
<div class="post">
  ${data.page.content}
</div>
`

const isHome = page => page.path === './index.html'

module.exports = data => `
${header(data)}
  <h1>${data.title}</h1>
  <div id="content">
    ${isHome(data.page)
      ? posts(data)
      : post(data)
    }
  </div>
${footer(data)}
`
