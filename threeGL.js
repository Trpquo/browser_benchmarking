import * as THREE from 'three' 

function GLanimateCanvas(settings, container, step) {
    console.log("Animating with three.js.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings, inch = multiplier/50

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000)
    camera.position.z = 10
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

 // Grid settings
  const dotsPerRow = 50;
  const dotDiameterPx = window.innerWidth * 0.02;  // 2% of screen width in pixels
  const dotRadius = dotDiameterPx / 2;
  const gapPx = 0  // spacing between dots equals dot diameter

  // Number of rows that fit on screen by height
    const dotsRows = Math.floor(window.innerHeight / (dotDiameterPx + gapPx));

  // Array to hold all dots
  const dots = [];

  // Geometry and material reused for all dots
  const geometry = new THREE.CircleGeometry(dotRadius, 16);
  const material = new THREE.MeshBasicMaterial({color: 0x888888});

  // Create grid of dots with base positions on pixel coordinates
  for(let row = 0; row < dotsRows; row++) {
    for(let col = 0; col < dotsPerRow; col++) {
      const dot = new THREE.Mesh(geometry, material);

      // Base position with offset inside the canvas (pixel coords)
      const baseX = col * (dotDiameterPx + gapPx) + dotRadius;
      const baseY = row * (dotDiameterPx + gapPx) + dotRadius;

      dot.userData.basePos = new THREE.Vector2(baseX, baseY);

      // Set initial position
      dot.position.set(baseX, baseY, 0);

      scene.add(dot);
      dots.push(dot);
    }
  }

  // Keyframe offsets for the square path, pixels (side = dotDiameterPx)
  const keyframes = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(dotDiameterPx, 0),
    new THREE.Vector2(dotDiameterPx, dotDiameterPx),
    new THREE.Vector2(0, dotDiameterPx),
    new THREE.Vector2(0, 0)
  ];

  // Animation variables
  const duration = 4000; // ms for full loop

  // Linear interpolation helper
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Animation update loop
  function updateDotsAnimation(time) {
    const t = (time % duration) / duration;
    const segments = keyframes.length - 1;
    const segmentIndex = Math.floor(t * segments);
    const segmentT = (t * segments) - segmentIndex;

    dots.forEach(dot => {
      const base = dot.userData.basePos;
      const start = keyframes[segmentIndex];
      const end = keyframes[segmentIndex + 1];
      const offsetX = lerp(start.x, end.x, segmentT);
      const offsetY = lerp(start.y, end.y, segmentT);
      dot.position.x = base.x + offsetX;
      dot.position.y = base.y + offsetY;
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
