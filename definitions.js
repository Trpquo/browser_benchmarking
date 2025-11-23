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
    element.setAttribute('cx', (ordinal % 50) * step)
    element.setAttribute('cy', Math.floor(ordinal / 50) * step)
    element.setAttribute('r', step)
    
    if (settings.transformations) {
	animateTransform(element, settings)
    }
    else {
	animateAbsolute(element, settings, ordinal, step)
    }

    container.appendChild(element)
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
    const animationDefinition = {
	top: [
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${top*step}px + ${random(movement)*distance}rem)`,
	],
	left: [
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step+step/2}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	    `calc(${left*step}px + ${random(movement)*distance}rem)`,
	],
    }
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
    settings.mode.indexOf('HTML') > -1 ? definition.backgroundColor = animation : definition.fill = animation
}
