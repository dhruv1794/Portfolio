import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/textures/matcaps/7.png');
const matCapTextureDonut = textureLoader.load('/textures/matcaps/3.png');

/**
 * Fonts
 * 
 */

const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font)=>{
    //font loaded as font

    const textGeometry =  new TextGeometry(
        'Dhruvinity',
        {
            font: font,
            size: 0.5, // height
            height: 0.2, //depth
            curveSegments:3, // lower to reduce triangles
            bevelEnabled:true,
            bevelThickness:0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments:5 // lower to reduce triangles
        }
    )
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02)  * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    // )    
    textGeometry.center(); // above and this are same
    const material = new THREE.MeshMatcapMaterial();
    // textMaterial.wireframe = true;
    material.matcap = matCapTexture;
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3,-.2,20,45);
    const donutMaterial = new THREE.MeshMatcapMaterial();
    donutMaterial.matcap = matCapTextureDonut;
    for(let i = 0; i< 300; i++) {
        const donut = new THREE.Mesh(donutGeometry,donutMaterial);
        donut.position.x = ( Math.random() - 0.5) * 10 
        donut.position.y = ( Math.random() - 0.5) * 10 
        donut.position.z = ( Math.random() - 0.5) * 10
        donut.rotation.x = Math.random() * Math.PI;
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);
        scene.add(donut);
    }
})

/**
 * 
 * Axis Helper
 */

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Object
 */


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()