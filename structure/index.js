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

module.exports = data => `
${header(data)}
  <h1>${data.title}</h1>
  <div id="content">
    ${data.isHome
      ? posts(data)
      : post(data)
    }
  </div>
${footer(data)}
`
