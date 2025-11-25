const form = document.getElementById("dashboard")
const container = document.getElementById("container")
form.addEventListener('submit', renderAnimation)

function renderAnimation(event) {
    event.preventDefault()
    const formData = new FormData(form)
    const settings = {}
    formData.forEach((value, key) => {
	settings[key] = value
    })
    container.innerHTML = ""; // erase all contents
    const step = window.innerWidth / 50;
    let el = null, svg = null;
    switch(settings.mode) {
	case "HTML+CSS":
	    for (let i=0; i<settings.increment; i++) {
		el = pushElement("span", i, settings, container, step)
	    }
	    break;
	case "SVG+CSS":
	    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	    svg.setAttributeNS(null, 'viewBox', `0 0 ${step*50} ${step*50}`)
	    for (let i=0; i<settings.increment; i++) {
		el = pushSVG("circle", i, settings, svg, step)
	    }
	    container.appendChild(svg)
	    break;
	case "HTML+JS":
	    for (let i=0; i<settings.increment; i++) {
		el = animateElement("span", i, settings, container, step)
	    }
	    break;
	case "SVG+JS":
	    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	    svg.setAttributeNS(null, 'viewBox', `0 0 ${step*50} ${step*50}`)
	    for (let i=0; i<settings.increment; i++) {
		el = animateElement("circle", i, settings, svg, step)
	    }
	    container.appendChild(svg)
	    break;
	default:
	    console.warn(`Action for ${settings.mode} is not defined.`)
    }
}
