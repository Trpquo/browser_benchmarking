import * as THREE from 'three' 

function GLanimateCanvas(settings, container, step) {
    console.log("Animating with three.js.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings, inch = multiplier/50

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100)
    camera.position.z = 20
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Keyframe times (seconds)
    const times = [0, .5, 1, 1.5, 2]
    // Keyframe positions (matching your CSS keyframes)
    const positions = [
	0, 0, 0,
	1, 0, 0,
	1, 1, 0,
	0, 1, 0,
	0, 0, 0
    ]

    // Create dots array
    const dots = [] 
    const mixers = [] 

    console.log(step, settings)

    for (let i = 0;  i < count;  i++) {
	// Sphere geometry and material for dots
	const geometry = new THREE.SphereGeometry(.2, step, step) 
	const material = new THREE.MeshBasicMaterial({color: 0x666666}) 
	const dot = new THREE.Mesh(geometry, material) 
	dot.position.x = step*(i%50)
	dot.position.y = step*Math.floor(i/50)
	console.log(dot)

	// Slightly offset starting position per dot (optional)
	scene.add(dot) 
	dots.push(dot) 

	// Create a VectorKeyframeTrack for this dot's position
	const positionTrack = new THREE.VectorKeyframeTrack('.position', times, positions) 

	// Create an AnimationClip and AnimationMixer
	const clip = new THREE.AnimationClip('moveAlongSquare', -1, [positionTrack]) 
	const mixer = new THREE.AnimationMixer(dot) 
	const action = mixer.clipAction(clip) 
	action.play() 
	mixers.push(mixer) 
    }

    // Animation loop
    const clock = new THREE.Clock() 

    function animate() {
	requestAnimationFrame(animate) 
	let delta = clock.getDelta() 

	mixers.forEach(mixer => mixer.update(delta)) 

	renderer.render(scene, camera) 
    }

    animate() 
}

export default GLanimateCanvas
