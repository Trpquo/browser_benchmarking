import * as THREE from 'three' 

export default function GLanimateCanvas(settings, container) {
      console.log('Animating on Canvas with WebGL')
  	const { count, random:movement, distance:multiplier, color, blending:opacity } = settings
  	let keyframes = [], dots = [], ctx = null // ctx test needed for Canvas clearance

      const scene = new THREE.Scene(),
	    sceneWidth = dotDiameter*50,
	  sceneHeight = dotDiameter*(10 + Math.ceil(count/50))
      const camera = new THREE.OrthographicCamera(0, sceneWidth, sceneHeight, 0, -1000, 1000)
      camera.position.z = 10
      const renderer = new THREE.WebGLRenderer()
      const gray = 0x666666, white = 0xffffff;
      renderer.setSize(sceneWidth, sceneHeight)
      renderer.setClearColor(white, 1)
      container.appendChild(renderer.domElement)

const geometry = new THREE.CircleGeometry(dotDiameter/2, 32) // minimal number of segments for visual comparability to other animation techniques

for (let i=0; i < count; i++) {
    const col = i % dotsPerRow,
	  row = Math.floor(i / dotsPerRow),
	  x = col * dotDiameter,
	  y = row * dotDiameter
    let dot
    keyframes = keyframesGenerator(movement, multiplier, color, opacity)

const material = new THREE.MeshBasicMaterial({transparent: opacity==="on"}) // simplest material comparable to render of other animation techniques; transparency needs to be explicitly turned on for blending effects
dot = new THREE.Mesh(geometry, material) // new object to represent dot in this frame
dot.userData.basePos = new THREE.Vector2(x,y)
dot.position.set(x,y,0)
dot.userData.targetColor = new THREE.Color(basicColor)
dot.userData.targetOpacity = 1
scene.add(dot)

    dots.push({
	  el: dot,
	  x,
	  y,
	  keyframes
    })
}

function animate(time=0) {
        const t = (time % animation.duration) / animation.duration,
    	  segmentIndex = Math.floor(t * animation.segments),
    	  segmentT = (t * animation.segments) - segmentIndex
    
        if (ctx) { // needed for clearing Canvas' stage
        	ctx.clearRect(0, 0, renderer.width, renderer.height)
        } 
    
        dots.forEach(({el, x, y, keyframes})=> {
    	const start = keyframes[segmentIndex],
    	      end = keyframes[segmentIndex + 1]
    	      // Interpolated offsets
    	      const offsetY = lerp(start.top, end.top, segmentT),
    		    offsetX = lerp(start.left, end.left, segmentT),
    		    r = lerp(start.color.r, end.color.r, segmentT),
    		    g = lerp(start.color.g, end.color.g, segmentT),
    		    b = lerp(start.color.b, end.color.b, segmentT),
    		    a = lerp(start.color.a, end.color.a, segmentT),
    		    offsetColor = {r,g,b,a}

el.position.x = x + offsetX + dotDiameter
el.position.y = sceneHeight - (y + offsetY + dotDiameter)

const mat = el.material
// Ensure colors are THREE.Color
if (!(mat.color instanceof THREE.Color)) {
    mat.color = new THREE.Color(mat.color);
}
if (!(el.userData.targetColor instanceof THREE.Color)) {
    el.userData.targetColor = new THREE.Color(el.userData.targetColor);
}
// Create a temporary color to store lerp result
if (!el.userData.currentColor) {
    el.userData.currentColor = mat.color.clone();
}

if (color==="on" || opacity==="on") {
    // Smoothly interpolate current color towards target color
    el.userData.currentColor.lerp(el.userData.targetColor, 0.02);

    // Update material color to current lerped color
    mat.color.copy(el.userData.currentColor);

    // Smoothly interpolate opacity
    mat.opacity = lerp(mat.opacity, el.userData.targetOpacity, 0.02);

    // When near target, pick new random color and opacity
    if (colorDistance(mat.color, el.userData.targetColor) < 0.02 &&
	Math.abs(mat.opacity - el.userData.targetOpacity) < 0.02) {
	const {r,g,b} = randomRGBA(color,opacity)
	el.userData.targetColor = new THREE.Color(`rgb(${r},${g},${b})`)
	el.userData.targetOpacity = Math.random() * 0.5 + 0.5;
    }	    
}

  	  });
	  renderer.render(scene, camera)
  	  requestAnimationFrame(animate)
      }
      animate()
  }
