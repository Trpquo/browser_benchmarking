function animateCanvas(settings, container, step) {
    console.log("Animating with Canvas API.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings, inch = multiplier/50
    const element = document.createElement("canvas")
    element.setAttribute('height', step*(Math.ceil(settings.increment/50)+5))
    element.setAttribute('width', step*50)
    container.appendChild(element)

    const dots = []
    for (let i=0; i<count; i++) {
	dots.push({
	    cx: step*(i%50) + step/2,
	    cy: step*Math.floor(i/50) + step/2,
	    r: 155 + random(color)*100,
	    g: 155 + random(color)*100,
	    b: 155 + random(color)*100,
	    o: 1 - random(opacity),
	    addHoriz: random(movement)*50*inch*spin(),
	    addVert: random(movement)*50*inch*spin(),
	    addR0: random(color)*3*spin(),
	    addG0: random(color)*3*spin(),
	    addB0: random(color)*3*spin(),
	    addO0: random(opacity)/100*spin(),
	    addR1: random(color)*3*spin(),
	    addG1: random(color)*3*spin(),
	    addB1: random(color)*3*spin(),
	    addO1: random(opacity)/100*spin(),
	})
    }
    function rendering(t, dot) {
	const t_ = t % 2000
	if (t_ < 500) {
	    dot.cx += step/20 + dot.addHoriz
	    dot.r += dot.addR0
	    dot.g += dot.addG0
	    dot.b += dot.addB0
	    dot.o += dot.addO0
	}
	if (t_ > 500 && t_ < 1000) {
	    dot.cy += step/20 + dot.addVert
	    dot.r += dot.addR1
	    dot.g += dot.addG1
	    dot.b += dot.addB1
	    dot.o += dot.addO1
	}
	if (t_ > 1000 && t_ < 1500) {
	    dot.cx -= step/20 + dot.addHoriz
	    dot.r -= dot.addR0
	    dot.g -= dot.addG0
	    dot.b -= dot.addB0
	    dot.o -= dot.addO0
	}
	if (t_ > 1500 && t_ < 2000) {
	    dot.cy -= step/20 + dot.addVert
	    dot.r -= dot.addR1
	    dot.g -= dot.addG1
	    dot.b -= dot.addB1
	    dot.o -= dot.addO1
	}
	return dot
    }
    const c = element.getContext('2d')
    function tick(t) {
	c.clearRect(0, 0, element.width, element.height)
	for (const dotr of dots) {
	    dot = rendering(t, dotr)
	    c.beginPath()
	    c.arc(dot.cx, dot.cy, step/2, 0, 2* Math.PI)
	    c.fillStyle = `rgba(${dot.r},${dot.g},${dot.b},${dot.o})`
	    c.fill()
	}
	requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
    
    return element
}
