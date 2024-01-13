import * as CANNON from 'cannon-es'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import CannonDebugRenderer from './utils/cannonDebugRenderer'
import CannonUtils from './utils/cannonUtils'

const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const light1 = new THREE.SpotLight(0xffffff, 150)
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight(0xffffff, 150)
light2.position.set(-5, 5, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = 9
//camera.position.z = 4

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.screenSpacePanning = true
controls.target.y = 2



const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.NaiveBroadphase() //
//world.solver
//world.allowSleep = true

const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial({wireframe: false})

const SCALE = 0.3

const cubeGeometry = new THREE.BoxGeometry(SCALE, SCALE, SCALE)
const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
cubeMesh.position.x = -4 * SCALE
cubeMesh.position.y = 5
cubeMesh.castShadow = true
scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5 * SCALE, 0.5 * SCALE, 0.5 * SCALE))
const cubeBody = new CANNON.Body({ mass: 1 })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
world.addBody(cubeBody)

const sphereGeometry = new THREE.SphereGeometry(SCALE)
const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
sphereMesh.position.x = -2 * SCALE
sphereMesh.position.y = 6
sphereMesh.castShadow = true
scene.add(sphereMesh)
const sphereShape = new CANNON.Sphere(SCALE)
const sphereBody = new CANNON.Body({ mass: 1 })
sphereBody.addShape(sphereShape)
sphereBody.position.x = sphereMesh.position.x
sphereBody.position.y = sphereMesh.position.y
sphereBody.position.z = sphereMesh.position.z
world.addBody(sphereBody)

const cylinderGeometry = new THREE.CylinderGeometry(SCALE, SCALE, SCALE * 2, 16)
const cylinderMesh = new THREE.Mesh(cylinderGeometry, normalMaterial)
cylinderMesh.position.x = 0
cylinderMesh.position.y = 3
cylinderMesh.castShadow = true
scene.add(cylinderMesh)
const cylinderShape = new CANNON.Cylinder(SCALE, SCALE, SCALE * 2, 16)
const cylinderBody = new CANNON.Body({ mass: 1 })
//const cylinderQuaternion = new CANNON.Quaternion()
//cylinderQuaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
cylinderBody.addShape(cylinderShape) //, new CANNON.Vec3(), cylinderQuaternion)
cylinderBody.position.x = cylinderMesh.position.x
cylinderBody.position.y = cylinderMesh.position.y
cylinderBody.position.z = cylinderMesh.position.z
world.addBody(cylinderBody)

const icosahedronGeometry = new THREE.IcosahedronGeometry(SCALE, 0)
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
icosahedronMesh.position.x = 2 * SCALE
icosahedronMesh.position.y = 3
icosahedronMesh.castShadow = true
scene.add(icosahedronMesh)
const icosahedronShape = CannonUtils.CreateConvexPolyhedron(icosahedronMesh.geometry)
const icosahedronBody = new CANNON.Body({ mass: 1 })
icosahedronBody.addShape(icosahedronShape)
icosahedronBody.position.x = icosahedronMesh.position.x
icosahedronBody.position.y = icosahedronMesh.position.y
icosahedronBody.position.z = icosahedronMesh.position.z
world.addBody(icosahedronBody)

const torusKnotGeometry = new THREE.TorusKnotGeometry(SCALE, SCALE * 0.3)
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial)
torusKnotMesh.position.x = 4 * SCALE
torusKnotMesh.position.y = 4
torusKnotMesh.castShadow = true
scene.add(torusKnotMesh)
const torusKnotShape = CannonUtils.CreateTrimesh(torusKnotMesh.geometry)
const torusKnotBody = new CANNON.Body({ mass: 1 })
torusKnotBody.addShape(torusKnotShape)
torusKnotBody.position.x = torusKnotMesh.position.x
torusKnotBody.position.y = torusKnotMesh.position.y
torusKnotBody.position.z = torusKnotMesh.position.z
world.addBody(torusKnotBody)

let monkeyMesh: THREE.Object3D
let monkeyBody: CANNON.Body
let monkeyLoaded = false
const objLoader = new OBJLoader()
objLoader.load(
    'models/monkey.obj',
    (object) => {
        scene.add(object)
        monkeyMesh = object.children[0];
        (monkeyMesh as THREE.Mesh).geometry.scale(SCALE, SCALE, SCALE);
        (monkeyMesh as THREE.Mesh).material = normalMaterial;
        monkeyMesh.position.x = -2 * SCALE
        monkeyMesh.position.y = 20
        const monkeyShape = CannonUtils.CreateTrimesh((monkeyMesh as THREE.Mesh).geometry)
        monkeyBody = new CANNON.Body({ mass: 1 })
        monkeyBody.addShape(monkeyShape)
        monkeyBody.position.x = monkeyMesh.position.x
        monkeyBody.position.y = monkeyMesh.position.y
        monkeyBody.position.z = monkeyMesh.position.z
        world.addBody(monkeyBody)
        monkeyLoaded = true
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('An error happened')
    }
)

const planeGeometry = new THREE.PlaneGeometry(50, 50)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

window.addEventListener('deviceorientation', handleOrientation, false);
function handleOrientation(event: DeviceOrientationEvent) {
    const x = event.alpha ? event.alpha / 36 : 0
    const y = event.beta ? event.beta / 18 : 0
    const z = event.gamma ? event.gamma / 9 : 0

    world.gravity.x = z
//  world.gravity.y = y
    world.gravity.z = x

    light1.color.setRGB(x/20 + 0.5, 0, z/20 + 0.5)
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
physicsFolder.open()

const clock = new THREE.Clock()

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

function addBounds() {
    const MARKERS = false;
    const raycaster = new THREE.Raycaster();
    const corners = [
        new THREE.Vector2(-1,0),
        new THREE.Vector2(0,1),
        new THREE.Vector2(0,-1),
        new THREE.Vector2(1,0),
    ];

    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    planeMesh.updateMatrixWorld();

    corners.forEach((corner) => {
        raycaster.setFromCamera(corner.multiplyScalar(0.9), camera);
        const hit = raycaster.intersectObject(planeMesh);
        if (hit.length) {
            if (MARKERS) {
                const marker = new THREE.Mesh( new THREE.IcosahedronGeometry(0.25), normalMaterial);
                marker.position.copy(hit[0].point);
                scene.add(marker);
            }

            const plane = new THREE.Mesh( new THREE.PlaneGeometry(50,50), phongMaterial);
            plane.position.copy(hit[0].point);
            plane.lookAt(planeMesh.position);
            scene.add(plane);
            plane.updateMatrixWorld();

            const planeShape = new CANNON.Plane()
            const planeBody = new CANNON.Body({ mass: 0 })
            planeBody.addShape(planeShape);
            planeBody.quaternion.set(plane.quaternion.x, plane.quaternion.y, plane.quaternion.z, plane.quaternion.w);
            planeBody.position.set(plane.position.x, plane.position.y, plane.position.z);
            world.addBody(planeBody)
        }
    })
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    let delta = clock.getDelta()
    if (delta > 0.1) delta = 0.1
    world.step(delta)
    cannonDebugRenderer.update()

    // Copy coordinates from Cannon.js to Three.js
    cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )
    sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
    sphereMesh.quaternion.set(
        sphereBody.quaternion.x,
        sphereBody.quaternion.y,
        sphereBody.quaternion.z,
        sphereBody.quaternion.w
    )
    cylinderMesh.position.set(
        cylinderBody.position.x,
        cylinderBody.position.y,
        cylinderBody.position.z
    )
    cylinderMesh.quaternion.set(
        cylinderBody.quaternion.x,
        cylinderBody.quaternion.y,
        cylinderBody.quaternion.z,
        cylinderBody.quaternion.w
    )
    icosahedronMesh.position.set(
        icosahedronBody.position.x,
        icosahedronBody.position.y,
        icosahedronBody.position.z
    )
    icosahedronMesh.quaternion.set(
        icosahedronBody.quaternion.x,
        icosahedronBody.quaternion.y,
        icosahedronBody.quaternion.z,
        icosahedronBody.quaternion.w
    )
    torusKnotMesh.position.set(
        torusKnotBody.position.x,
        torusKnotBody.position.y,
        torusKnotBody.position.z
    )
    torusKnotMesh.quaternion.set(
        torusKnotBody.quaternion.x,
        torusKnotBody.quaternion.y,
        torusKnotBody.quaternion.z,
        torusKnotBody.quaternion.w
    )
    if (monkeyLoaded) {
        monkeyMesh.position.set(monkeyBody.position.x, monkeyBody.position.y, monkeyBody.position.z)
        monkeyMesh.quaternion.set(
            monkeyBody.quaternion.x,
            monkeyBody.quaternion.y,
            monkeyBody.quaternion.z,
            monkeyBody.quaternion.w
        )
    }

    render()

/*
    if (Math.random()*100 < 1) {
        const x = Math.random()*20 - 10
        const z = Math.random()*20 - 10
        world.gravity.x = x;
        world.gravity.y = y;
        world.gravity.z = z;
        light1.color.setRGB(x/20 + 0.5, x/20 + 0.5, z/20 + 0.5);
    }
*/
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

addBounds()

animate()
