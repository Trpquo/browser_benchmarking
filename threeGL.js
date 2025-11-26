import * as THREE from 'three' 

function GLanimateCanvas(settings, container, step) {
    console.log("Animating with three.js.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings, inch = multiplier/50

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000)
    camera.position.z = 10
    const renderer = new THREE.WebGLRenderer()
    const gray = 0x666666, white = 0xffffff;
    renderer.setSize(window.innerWidth, window.innerHeight - 200)
    renderer.setClearColor(white, 1)
    container.appendChild(renderer.domElement)

    // Grid settings
    const dotsPerRow = 50;
    const dotDiameterPx = window.innerWidth * 0.02;  // 2% of screen width in pixels
    const dotRadius = dotDiameterPx / 2;
    const gapPx = 0  // distance between dots equals dot diameter
    const distance = dotRadius + gapPx // distance between dot centers

    // Number of rows that fit on screen by height
    const dotsRows = Math.floor(window.innerHeight / (dotDiameterPx + gapPx));

    // Geometry and material reused for all dots
    const geometry = new THREE.CircleGeometry(dotRadius, 16);

    // Utility for random color RGB hex
    function randomColor() {
	const r = Math.round(Math.random() * 150 + 105);
	const g = Math.round(Math.random() * 150 + 105);
	const b = Math.round(Math.random() * 150 + 105);
	return (r << 16) | (g << 8) | b;
    }
    // Convert hex color to THREE.Color instance
    function hexToColor(hex) {
	const color = new THREE.Color();
	color.setHex(hex);
	return color;
    }
    // Array to hold all dots
    const dots = []
    let keyframes = []

    // Create grid of dots with base positions on pixel coordinates
    for(let i = 0; i < count; i++) {
	const row = Math.floor(i / dotsPerRow);
	const col = i % dotsPerRow;

	// Initail random color & opacity
	const material = new THREE.MeshBasicMaterial({transparent: true})
	material.color = color==="on" ? hexToColor(randomColor()) : gray
	material.opacity = opacity==="on" ? Math.random() * 0.7 + 0.3 : 1

	const dot = new THREE.Mesh(geometry, material);

	// Base pixel coordinates; start top-left at (0,0)
	// Position each dot with offsets to form grid
	const baseX = col * (dotRadius + distance) + dotRadius;
	const baseY = window.innerHeight - (row * (dotRadius + distance) + 2*dotRadius);

	dot.userData.basePos = new THREE.Vector2(baseX, baseY);
	dot.position.set(baseX, baseY, 0);

	// Keyframe offsets for the square path, pixels (side = dotDiameterPx)
	keyframes = [
	    new THREE.Vector2(0, distance),
	    new THREE.Vector2(distance + random(movement)*distance*multiplier, distance - random(movement)*distance*multiplier),
	    new THREE.Vector2(distance + random(movement)*distance*multiplier, 0 - random(movement)*distance*multiplier),
	    new THREE.Vector2(0 + random(movement)*distance*multiplier, 0 - random(movement)*distance*multiplier),
	    new THREE.Vector2(0, distance)
	];

	dot.keyframes = keyframes

	if (color==="on") {
	    dot.userData.targetColor = hexToColor(randomColor())
	} else {dot.userData.targetColor = gray}

	if (opacity==="on") {
	    dot.userData.targetOpacity = Math.random() * .7  + .3
	} else {dot.userData.targetOpacity = 1}

	scene.add(dot);
	dots.push(dot);
    }


    // Animation variables
    const duration = 2000; // ms for full loop

    // Linear interpolation helper
    function lerp(a, b, t) {
	return a + (b - a) * t;
    }

    // color distance calculator
    function colorDistance(c1, c2) {
	const dr = c1.r - c2.r
	const dg = c1.g - c2.g
	const db = c1.b - c2.b
	return Math.sqrt(dr*dr + dg*dg + db*db)
    }

    // Animation update loop
    function updateDotsAnimation(time) {
	const t = (time % duration) / duration;
	const segments = 4;
	const segmentIndex = Math.floor(t * segments);
	const segmentT = (t * segments) - segmentIndex;

	dots.forEach(dot => {
	    // animate position on square path
	    const base = dot.userData.basePos;
	    const start = dot.keyframes[segmentIndex];
	    const end = dot.keyframes[segmentIndex + 1];
	    
	    const offsetX = lerp(start.x, end.x, segmentT);
	    const offsetY = lerp(start.y, end.y, segmentT);

	    dot.position.x = base.x + offsetX;
	    dot.position.y = base.y + offsetY;

	    // animate color and opacity
	    const mat = dot.material

	    // Ensure colors are THREE.Color
	    if (!(mat.color instanceof THREE.Color)) {
		mat.color = new THREE.Color(mat.color);
	    }
	    if (!(dot.userData.targetColor instanceof THREE.Color)) {
		dot.userData.targetColor = new THREE.Color(dot.userData.targetColor);
	    }

	    // Create a temporary color to store lerp result
	    if (!dot.userData.currentColor) {
		dot.userData.currentColor = mat.color.clone();
	    }

	    if (color==="on" || opacity==="on") {
		// Smoothly interpolate current color towards target color
		dot.userData.currentColor.lerp(dot.userData.targetColor, 0.01);

		// Update material color to current lerped color
		mat.color.copy(dot.userData.currentColor);

		// Smoothly interpolate opacity
		mat.opacity = lerp(mat.opacity, dot.userData.targetOpacity, 0.02);

		// When near target, pick new random color and opacity
		if (colorDistance(mat.color, dot.userData.targetColor) < 0.01 &&
		    Math.abs(mat.opacity - dot.userData.targetOpacity) < 0.01) {
		    dot.userData.targetColor = new THREE.Color(randomColor());
		    dot.userData.targetOpacity = Math.random() * 0.5 + 0.5;
		}	    
	    }
	});
    }

    const clock = new THREE.Clock();

    function animate() {
	requestAnimationFrame(animate);
	const elapsed = clock.getElapsedTime() * 1000; // ms
	updateDotsAnimation(elapsed);
	renderer.render(scene, camera);
    }

    animate();
}

export default GLanimateCanvas
