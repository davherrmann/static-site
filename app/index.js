function component () {
  const element = document.createElement('div');
  element.innerHTML = 'Hello Static Site'
  return element;
}

document.body.appendChild(component());
setTimeout(() => {
  import('./lazy1')
  .then(module => {
    console.log(module)
    module.run()
  })
},
2000)
