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
    let el = null;
    switch(settings.mode) {
	case "HTML+CSS":
	    for (i=0; i<settings.increment; i++) {
		el = pushElement("span", i, settings, container, step)
	    }
	    break;
	case "SVG+CSS":
	    const svg = document.createElement('svg')
	    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
	    svg.setAttribute('viewBox', `0 0 ${step*50} ${step*50}`)
	    /* svg.setAttribute('viewBox', `0 0 ${step*50} ${step*Math.ceil(settings.increment/50)}`) */
	    svg.setAttribute('preserveAspectRatio',"xMidYMid meet")
	    for (i=0; i<settings.increment; i++) {
		el = pushSVG("circle", i, settings, svg, step)
	    }
	    container.appendChild(svg)
	    break;
	default:
	    console.log(`Action for ${settings.mode} is not defined.`)
    }
}
