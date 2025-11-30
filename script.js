// import GLanimateCanvas from './threeGL.js'

const form = document.getElementById("dashboard")
const container = document.getElementById("container")
form.addEventListener('submit', renderAnimation)

function renderAnimation(event) {
    event.preventDefault()
    const formData = new FormData(form)
    const settings = {}
    formData.forEach((value, key)=>{
	settings[key] = value
    })
    container.innerHTML = "" // erase all content
    let svg

    switch(settings.mode) {
	case "HTML+CSS":
	    CSSanimateElements("span", settings, container)
	    break;
	case "SVG+CSS":
	    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	    svg.setAttributeNS(null, 'viewBox', `0 0 ${dotDiameter*50} ${dotDiameter*50}`)
	    CSSanimateElements("circle", settings, svg)
	    container.appendChild(svg)
	    break;
	case "HTML+JS":
	    JSanimateElements("span", settings, container)
	    break;
	case "SVG+JS":
	    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	    svg.setAttributeNS(null, 'viewBox', `0 0 ${dotDiameter*50} ${dotDiameter*50}`)
	    JSanimateElements("circle", settings, svg)
	    container.appendChild(svg)
	    break;
	case "JS+Canvas":
	    JSanimateCanvas(settings, container)
	    break;
	case "WebGL+Canvas":
	    GLanimateCanvas(settings, container)
	    break;
	default:
	    console.warn(`Action for ${settings.mode} is not defined.`)
    }

// turn FPS measurement ON/OFF
    if (settings.fps_on==="on") {
	if (FPSFrameRequest) {
	    cancelAnimationFrame(FPSFrameRequest)
	}
	FPSLoopRequest = true
	requestAnimationFrame(fpsLoop)
    } else {
	FPSLoopRequest = false
    }
}
