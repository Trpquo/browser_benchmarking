function JSanimateElements(name, settings, container) {
    console.log('Animating with pure JavaScript.')
    const { count, random:movement, distance:multiplier, color, blending:opacity } = settings
    let keyframes = []
    let dots = []
    let ctx = null // needed for Canvas clearance

for (let i=0; i < count; i++) {
        const col = i % dotsPerRow,
    	  row = Math.floor(i / dotsPerRow),
    	  x = col * dotDiameter,
    	  y = row * dotDiameter
        let dot
        keyframes = keyframesGenerator(movement, multiplier, color, opacity)

if (settings.mode.indexOf('HTML') === 0) {
    dot = document.createElement(name)
    dot.style.position = "absolute"
    dot.style.left = x + "px"
    dot.style.top = y + "px"
} else if (settings.mode.indexOf('SVG') === 0) {
    dot = document.createElementNS('http://www.w3.org/2000/svg', name)
    dot.setAttribute('cx', x)
    dot.setAttribute('cy', y)
} else {
    console.warn("Fatal error: Selected JS animation option is not available!")
    return
}
container.appendChild(dot)

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

    if (renderer && ctx) { // needed for clearing Canvas' stage
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
// Update CSS top and left properties | SVG cy and cx attributes
if (settings.mode.indexOf('HTML') === 0) {
	el.style.left = x + offsetX + "px"
	el.style.top = y + offsetY + "px"
	el.style.backgroundColor = colorStr(offsetColor)
} else if (settings.mode.indexOf('SVG') === 0) {
	el.setAttribute('cx', x + offsetX)
	el.setAttribute('cy', y + offsetY)
	el.style.fill = colorStr(offsetColor)
}
	  });
	  requestAnimationFrame(animate)
    }
    animate()
}
