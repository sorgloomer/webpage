from browser import document, window

THREE = window.THREE

camera = THREE.PerspectiveCamera.new(75, 1, 0.01, 10)
camera.position.z = 2
scene = THREE.Scene.new()
geometry = THREE.CubeGeometry.new(0.25, 0.1, 1)
material = THREE.MeshBasicMaterial.new({"color": "#ff0000", "wireframe": True})
mesh = THREE.Mesh.new(geometry, material)
scene.add(mesh)

renderer = THREE.WebGLRenderer.new()
renderer.setSize(600, 600)

document <= renderer.domElement
renderer.render(scene, camera)

def loop(i=None):
    window.requestAnimationFrame(loop)
    animate()

def animate():
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02
    renderer.render(scene, camera)

loop()
