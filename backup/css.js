function pushElement(name, ordinal, settings, container, step) {
    const element = document.createElement(name)
    if (settings.transformations) {
	animateTransform(element, settings, step)
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
    if (settings.transformations) {
	animateTransform(element, settings, step)
    }
    else {
	animateAbsolute(element, settings, ordinal, step)
    }

    container.appendChild(element)
    return element
}

function animateTransform(element, settings, step) {
    console.log("Animating with transform")
    const { random:movement, distance, color, blending:opacity } = settings
    const animationDefinition = {
	offset: [0, .25, .5, .75, 1],
	transform: [
	    `translate(0, 0)`,
	    `translate(${step+random(movement)*distance*step}px, ${0+random(movement)*distance*step}px)`,
	    `translate(${step+random(movement)*distance*step}px, ${step+random(movement)*distance*step}px)`,
	    `translate(${0+random(movement)*distance*step}px, ${step+random(movement)*distance*step}px)`,
	    `translate(0, 0)`,
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
	    `calc(${top*step}px + ${random(movement)*distance*step}px)`,
	    `calc(${top*step}px + ${random(movement)*distance*step}px)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance*step}px)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance*step}px)`,
	    `calc(${top*step}px + ${random(movement)*distance*step}px)`,
	]
    const leftAnim = [
	    `calc(${left*step}px + ${random(movement)*distance*step}px)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance*step}px)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance*step}px)`,
	    `calc(${left*step}px + ${random(movement)*distance*step}px)`,
	    `calc(${left*step}px + ${random(movement)*distance*step}px)`,
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
