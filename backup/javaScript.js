function animateElements(name, settings, container, step) {
    console.log("Animating with pure JS.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings
    
    const dotsPerRow = 50 
    const dotDiameter = window.innerWidth / dotsPerRow
    const dotsRows = Math.ceil(count / dotsPerRow) 

    const push = ()=>random(movement)*dotDiameter*multiplier


    let keyframes = []
    const dots = [] 

    for (let i=0;  i < count; i++) {
	let dot
	if (settings.mode.indexOf("HTML") > -1) {
	    dot = document.createElement(name) 
	    dot.style.position = "absolute"
	} else if (settings.mode.indexOf('SVG') > -1) {
	    dot = document.createElementNS('http://www.w3.org/2000/svg', name)
	} else { return }

	const gray = {r:155,g:155,b:155,a:1}
	keyframes = [
	    {top: 0, left: 0, color: color==="on" ? randomRGBA(opacity) : gray},
	    {top: 0 + push(), left: dotDiameter + push(), color: color==="on" ? randomRGBA(opacity) : gray},
	    {top: dotDiameter + push(), left: dotDiameter + push(), color: color==="on" ? randomRGBA(opacity) : gray},
	    {top: dotDiameter + push(), left: 0 + push(), color: color==="on" ? randomRGBA(opacity) : gray},
	    {top: 0, left: 0, color: color==="on" ? randomRGBA(opacity) : gray}
	] 
	// Position grid index
	const row = Math.floor(i / dotsPerRow) 
	const col = i % dotsPerRow 

	// Base grid position in px
	const baseTop = row * dotDiameter
	const baseLeft = col * dotDiameter

	// Initially position dot absolutely
	if (settings.mode.indexOf('HTML') > -1) {
	    dot.style.left = baseLeft + "px"
	    dot.style.top = baseTop + "px"
	} else if (settings.mode.indexOf('SVG') > -1) {
	    dot.setAttribute('cx', baseLeft)
	    dot.setAttribute('cy', baseTop)
	}

	container.appendChild(dot);

	dots.push({
	    el: dot,
	    baseTop,
	    baseLeft,
	    keyframes
	});
    }

    const duration = 4000; // full loop duration in ms

    // Linear interpolation
    function lerp(a, b, t) {
	return a + (b - a) * t;
    }

    function animate(time=0) {
	const t = (time % duration) / duration;
	const segments = 4;
	const segmentIndex = Math.floor(t * segments);
	const segmentT = (t * segments) - segmentIndex;

	dots.forEach(({el, baseTop, baseLeft, keyframes}) => {
	    const start = keyframes[segmentIndex];
	    const end = keyframes[segmentIndex + 1];

	    // Interpolated offsets
	    const offsetTop = lerp(start.top, end.top, segmentT);
	    const offsetLeft = lerp(start.left, end.left, segmentT);
	    const R = lerp(start.color.r, end.color.r, segmentT);
	    const G = lerp(start.color.g, end.color.g, segmentT);
	    const B = lerp(start.color.b, end.color.b, segmentT);
	    const A = lerp(start.color.a, end.color.a, segmentT);
	    const offsetColor = {r:R, g:G, b:B, a:A}

	    // Update CSS top and left
	    if (settings.mode.indexOf('HTML') > -1) {
		el.style.left = baseLeft + offsetLeft + "px"
		el.style.top = baseTop + offsetTop + "px"
		el.style.backgroundColor = colorStr(offsetColor)
	    } else if (settings.mode.indexOf('SVG') > -1) {
		el.setAttribute('cx', baseLeft + offsetLeft)
		el.setAttribute('cy', baseTop + offsetTop)
		el.style.fill = colorStr(offsetColor)
	    }
	});

	requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}
