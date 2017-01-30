let container = null

const whichAnimationEvent = () => {
  var el = document.createElement('fakeelement')
  var animations = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }

  for (let a in animations) {
    if (el.style[a] !== undefined) {
      return animations[a]
    }
  }
}

function init () {
  const heart = document.querySelector('.sidebar-about .icon')

  /* Listen for a transition! */
  var animationEvent = whichAnimationEvent()
  animationEvent && heart.addEventListener(animationEvent, () => {
    Array
    .from(document.querySelectorAll('code.lang-javascript'))
    .forEach(element => {
      container = createContainer(element.parentNode)
      eval(element.textContent)
    })
  })
}

const heart = document.querySelector('.sidebar-about .icon')

if (heart) {
  init()
} else {
  document.addEventListener('onload', init)
}

function createElementFrom (string) {
  const div = document.createElement('div')
  div.innerHTML = string
  return div.firstChild
}

function createContainer (element) {
  const div = document.createElement('div')
  div.innerHTML = '<div class="result-container"></div>'
  return element.parentNode.insertBefore(div.firstChild, element.nextSibling)
}

function loadScript (url, callback) {
  const head = document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url

  script.onreadystatechange = callback
  script.onload = callback

  head.appendChild(script)
}

function startLoop (callback) {
  const renderFrame = () => {
    window.requestAnimationFrame(renderFrame)
    callback()
  }
  renderFrame()
}

function three (init) {
  const currentContainer = container
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.min.js', () => {
    const width = currentContainer.offsetWidth
    const height = 300

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000)
    camera.position.z = 500
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setSize(width, height)

    currentContainer.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const width = currentContainer.offsetWidth
      const height = 300

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', onWindowResize, false)

    const render = (updateFn) => {
      startLoop(() => {
        updateFn()
        renderer.render(scene, camera)
      })
    }

    const renderOnce = () => {
      renderer.render(scene, camera)
    }

    init({
      scene,
      renderer,
      camera,
      render,
      renderOnce
    })
  })
}

function canvas (renderFn) {
  const currentContainer = container
  const pixelRatio = window.devicePixelRatio
  const canvas = container.appendChild(document.createElement('canvas'))
  const context = canvas.getContext('2d')

  const resizeAndRender = () => {
    const width = currentContainer.offsetWidth
    const height = 300

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    renderFn({
      context,
      width: canvas.width,
      height: canvas.height
    })
  }

  window.addEventListener('resize', resizeAndRender, false)

  resizeAndRender()
}

function display (...objects) {
  objects.forEach(o => {
    const prettyObject = JSON.stringify(o)
    const element = createElementFrom(`<pre><code>${prettyObject}</code><i class="fa fa-check-circle-o" aria-hidden="true"></i></pre>`)
    container.appendChild(element)
  })
}

window.three = three
window.canvas = canvas
window.display = display
