const animationDuration = {
    duration: 2000,
    iterations: Infinity
}
const random = (cond)=>cond ? Math.random() : 0;

function pushElement(name, ordinal, settings, container, step) {
    const element = document.createElement(name)
    if (settings.transformations) {
	animateTransform(element, settings)
    }
    else {
	animateAbsolute(element, settings, ordinal, step)
    }

    container.appendChild(element)
    return element
}

function pushSVG(name, ordinal, settings, container, step) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name)
    const halfstep = step/2
    element.setAttribute('cx', halfstep + (ordinal % 50) * step)
    element.setAttribute('cy', halfstep + Math.floor(ordinal / 50) * step)
    console.log(element)
    if (settings.transformations) {
	animateTransform(element, settings)
    }
    else {
	animateAbsolute(element, settings, ordinal, step)
    }

    container.appendChild(element)
    return element
}

function animateElement(name, ordinal, settings, container, step) {
    const element = document.createElement(name)
    element.style.position = "absolute"
    container.appendChild(element)
    const tick = setInterval(frame, 5)
    const distance = Math.round(step) / 100,
	  initLeft = Math.round((ordinal%50)*step*100)/100,
	  initTop = Math.round(Math.floor(ordinal/50)*step*100)/100;
    let left = initLeft, top = initTop;
    function frame() {
	/* console.log(initLeft, left, initLeft + step, initTop, top, initTop + step) */
	if (Math.round(left) < Math.round(initLeft + step) && Math.round(top) === Math.round(initTop)) {
	    left += distance
	    element.style.left = left + "px"
	}
	else if (Math.round(left) === Math.round(initLeft + step) && Math.round(top) < Math.round(initTop + step)) {
	    top += distance
	    element.style.top = top + "px"
	}
	else if (Math.round(left) > Math.round(initLeft) && Math.round(top) === Math.round(initTop + step)) {
	    left -= distance
	    element.style.left = left + "px"
	}
	else {
	    top -= distance
	    element.style.top = top + "px"
	}
	/* clearInterval(tick) */
    }
    return element
}

function animateTransform(element, settings) {
    console.log("Animating with transform")
    const { random:movement, distance, color, blending:opacity } = settings
    const animationDefinition = {
	offset: [0, .25, .5, .75, 1],
	transform: [
	    `translate(0rem, 0rem)`,
	    `translate(${1+random(movement)*distance}rem, ${0+random(movement)*distance}rem)`,
	    `translate(${1+random(movement)*distance}rem, ${1+random(movement)*distance}rem)`,
	    `translate(${0+random(movement)*distance}rem, ${1+random(movement)*distance}rem)`,
	    `translate(0rem, 0rem)`,
	],
    }
    if (color || opacity) { animateColor(animationDefinition, settings) }
    element.animate(animationDefinition, animationDuration)
}

function animateAbsolute(element, settings, ordinal, step) {
    console.log("Animating with absolute postioning")
    const { random:movement, distance, color, blending:opacity } = settings
    element.style.position = "absolute"
    const top = Math.floor(ordinal / 50)
    const left = (ordinal % 50)
    const topAnim = [
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	]
    const leftAnim = [
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	]
    const yAnim = [
	    top*step + random(movement)*distance*15,
	    top*step + random(movement)*distance*15,
	    top*step+step/2 + random(movement)*distance*15,
	    top*step+step/2 + random(movement)*distance*15,
	    top*step + random(movement)*distance*15,
	]
    const xAnim = [
	    left*step + random(movement)*distance*15,
	    left*step+step/2 + random(movement)*distance*15,
	    left*step+step/2 + random(movement)*distance*15,
	    left*step + random(movement)*distance*15,
	    left*step + random(movement)*distance*15,
    ]
    const animationDefinition = settings.mode === "SVG+CSS"  ? {cx: xAnim, cy: yAnim} : {top: topAnim, left: leftAnim};
    if (color || opacity) { animateColor(animationDefinition, settings) }
    element.animate(animationDefinition, animationDuration)
}


function animateColor(definition, settings) {
    const { color, blending:opacity } = settings
    animation = [
	'rgba(155,155,155,1)',
	`rgba(${random(color)*155+100}, ${random(color)*155+100}, ${random(color)*155+100}, ${1-random(opacity)})`,
	`rgba(${random(color)*155+100}, ${random(color)*155+100}, ${random(color)*155+100}, ${1-random(opacity)})`,
	`rgba(${random(color)*155+100}, ${random(color)*155+100}, ${random(color)*155+100}, ${1-random(opacity)})`,
	'rgba(155,155,155,1)',
    ]
    settings.mode === "HTML+CSS" ? definition.backgroundColor = animation : definition.fill = animation
}
