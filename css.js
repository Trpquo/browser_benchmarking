function CSSanimateElements(name, settings, container) {
    console.log('Animating with pure CSS.')
    console.log(settings)
    const { count, random:movement, distance:multiplier, color, blending:opacity } = settings
    let keyframes = []
    let dots = []

for (let i=0; i < count; i++) {
    const col = i % dotsPerRow,
	  row = Math.floor(i / dotsPerRow),
	  x = col * dotDiameter,
	  y = row * dotDiameter
    let dot
    if (name === "span") {
	dot = document.createElement(name)
    }
    else if (name === "circle") {
	dot = document.createElementNS('http://www.w3.org/2000/svg', name)
    }
    else {
	console.warn('Fatal error: Selected CSS animation option is not available!')
	return
    }
    container.appendChild(dot)
    keyframes = keyframesGenerator(movement, multiplier, color, opacity)
    dots.push({
	  el: dot,
	  x,
	  y,
	  keyframes
    })
}

function animate(dot, transformations, SVG) {
    const definition = transformations ?
	  dot.keyframes.map( ({top, left, color})=>({ transform: `translate(${top}px,${left}px)`, backgroundColor: colorStr(color), fill: colorStr(color)  }) ) :
	      SVG ?
	        dot.keyframes.map( ({top, left, color})=>({ cy: dot.y + top, cx: dot.x + left, fill: colorStr(color) }) ) :
	        dot.keyframes.map( ({top, left, color})=>({ top: `${dot.y + top}px`, left: `${dot.x + left}px`, backgroundColor: colorStr(color) }) ) 
    console.log(definition)
    if (!transformations && !SVG) { dot.el.style.position = "absolute"}
    dot.el.animate(definition, animation)
}

dots.forEach( dot=>{
    const SVG = settings.mode.indexOf('SVG') === 0
    if (SVG) {
	dot.el.setAttribute('cy', dot.y)
	dot.el.setAttribute('cx', dot.x)
    } else {
	dot.el.style.top = dot.y + "px"
	dot.el.style.left = dot.x + "px"
    }
   animate(dot, settings.transformations, SVG)     
})
}
