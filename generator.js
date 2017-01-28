class File {
  constructor (runner, path, plugins, content = '') {
    this.runner = runner
    this._path = path
    this.plugins = plugins
    this.content = content
  }

  path () {
    this.runner.write(this)
  }
}

class Runner {
  constructor (config) {
    this.config = config
  }

  file (path, ...plugins) {
    return new File(this, path, plugins)
  }

  write (file) {
    file.plugins.forEach(plugin => {
      file = plugin(file)
    })
    console.log(file.content)
  }
}

const runner = config => new Runner(config)

module.exports = runner
