function JSanimateCanvas(settings, container) {
    console.log('Animating on Canvas with JavaScript')
    const { count, random:movement, distance:multiplier, color, blending:opacity } = settings
    let keyframes = []
    let dots = []
  const element = document.createElement("canvas")
  element.setAttribute('width', dotDiameter*50)
  element.setAttribute('height', dotDiameter*(10 + Math.ceil(count/50)))
  container.appendChild(element)

for (let i=0; i < count; i++) {
    const col = i % dotsPerRow,
	  row = Math.floor(i / dotsPerRow),
	  x = col * dotDiameter,
	  y = row * dotDiameter
    let dot
    keyframes = keyframesGenerator(movement, multiplier, color, opacity)
    dots.push({
	  el: dot,
	  x,
	  y,
	  keyframes
    })
}

function drawDot(cx, cy, color, r=dotDiameter/2) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2*Math.PI)
    ctx.fillStyle = colorStr(color)
    ctx.fill()
    ctx.closePath()
}

const ctx  = element.getContext('2d')
function animate(time=0) {
    const t = (time % animation.duration) / animation.duration,
	  segmentIndex = Math.floor(t * animation.segments),
	  segmentT = (t * animation.segments) - segmentIndex

    if (element.getContext("2d")) { // needed for clearing Canvas' stage
    	ctx.clearRect(0, 0, element.width, element.height)
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
      drawDot(x + offsetX, y + offsetY, offsetColor)
	  });
	  requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
}
