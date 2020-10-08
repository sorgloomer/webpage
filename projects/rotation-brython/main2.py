from browser import document, window
from vmath import vec, quat

class pointmass:
    def __init__(self, m, r):
        self.m = float(m)
        self.r = vec(r)

class RotatingRigidPointCloud:
    def __init__(self, omega=None, angularmoment=None):
        if omega is None:
            omega = vec.xyz()
        if angularmoment is None:
            angularmoment = vec.xyz()
        self.points = [
            pointmass(   1, vec.xyz( 1, 0,  0)),
            pointmass(   1, vec.xyz(-1, 0,  0)),
            pointmass(0.25, vec.xyz( 0, 0,  1)),
            pointmass(0.25, vec.xyz( 0, 0, -1)),
        ]
        self.omega = omega
        self.angularmoment = angularmoment
        self.fi = quat()

    def angularmoment_from_omega(self, omega=None):
        if omega is None:
            omega = self.omega
        angularmoment = sum(p.m * (p.r % (p.r % omega)) for p in self.points)
        self.angularmoment = angularmoment
        return angularmoment

    def _beta_for_point(p):
        omega = self.omega
        r = p.r
        a = omega * (omega * r)
        rt = r - omega * ((r * omega) / (omega * omega))
        v = omega % rt
        print(omega % r, omega % rt)
        # omega =?= v % rt / |rt|**2
        # beta = (1/|r|**2) * ()
        beta = a % p.r
    def x():
        omega = sum(p.v % p.r for p in points)
        # a = omega * (omega * r)
        dOmega = sum(p.dv % p.r + p.v % p.v for p in points)


"""

vi = omega % ri

pi = vi * mi

// ai = omega % (omega % ri)

ai = omega' % ri + omega % ri'
ai = beta % ri + omega % vi
ai = beta % ri + omega % (omega % ri)


"""

rotating_body = RotatingRigidPointCloud(omega=vec.xyz(1, 0, 1))
rotating_body.angularmoment_from_omega()
print(tuple(rotating_body.omega))
print(tuple(rotating_body.angularmoment))


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
