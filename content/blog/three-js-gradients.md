---
date: "2017-01-10T15:34:32+01:00"
title: "Working with gradients in three.js"
draft: false
---

Testing some embedded code:

```javascript
const a = {x: 1}
const b = Object.assign(a, {y: 2})
display(a, b)
```

```javascript
canvas(({context, width, height}) => {
  context.beginPath();
  context.arc(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.3,
    0,
    Math.PI * 2,
    true
  )
  context.fillStyle = '#49045f';
  context.fill();
})
```

```javascript
three(({scene, render}) => {
  const geometry = new THREE.CubeGeometry(200, 200, 200)
  const material = new THREE.MeshNormalMaterial()

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  render(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
  })
})
```
