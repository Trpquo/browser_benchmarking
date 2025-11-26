function animateElement(name, ordinal, settings, container, step) {
    console.log("Animating with pure JS.")
    const { random:movement, distance:multiplier, color, blending:opacity } = settings
    let element;
    if (settings.mode.indexOf("HTML") > -1) {
	element = document.createElement(name) 
	element.style.position = "absolute"
    } else if (settings.mode.indexOf('SVG') > -1) {
	element = document.createElementNS('http://www.w3.org/2000/svg', name)
    } else { return }
    container.appendChild(element)
    
    // define motion stops
    const initLeft = (ordinal%50)*step + random(movement)*step,
	  initTop = Math.floor(ordinal/50)*step + random(movement)*step;
    const farLeft = initLeft + step*multiplier + random(movement)*step*multiplier,
	  farTop = initTop + step*multiplier + random(movement)*step*multiplier;
    const horizStep = (farLeft - initLeft) / 100,
	  vertStep = (farTop - initTop) / 100;

    // define color stops
    const  initR = 155 + random(color)*100*spin(),
	  initG = 155 + random(color)*100*spin(),
	  initB = 155 + random(color)*100*spin(),
	  initO = 1 - random(opacity);
    const oneR = initR + random(color)*50*spin(),
	  oneG = initG + random(color)*50*spin(),
	  oneB = initB + random(color)*50*spin(),
	  oneO = initO + random(opacity)*spin();
    const twoR = oneR + random(color)*50*spin(),
	  twoG = oneG + random(color)*50*spin(),
	  twoB = oneB + random(color)*50*spin(),
	  twoO = oneO + random(opacity)*spin();
    const threeR = twoR + random(color)*50*spin(),
	  threeG = twoG + random(color)*50*spin(),
	  threeB = twoB + random(color)*50*spin(),
	  threeO = twoO + random(opacity)*spin();
    const stepInitOneR = (oneR - initR)/100,
	  stepInitOneG = (oneG - initG)/100,
	  stepInitOneB = (oneB - initB)/100,
	  stepInitOneO = (oneO - initO)/100,
	  stepOneTwoR = (twoR - oneR)/100,
	  stepOneTwoG = (twoG - oneG)/100,
	  stepOneTwoB = (twoB - oneB)/100,
	  stepOneTwoO = (twoO - oneO)/100,
	  stepTwoThreeR = (threeR - twoR)/100,
	  stepTwoThreeG = (threeG - twoG)/100,
	  stepTwoThreeB = (threeB - twoB)/100,
	  stepTwoThreeO = (threeO - twoO)/100,
	  stepThreeInitR = (initR - threeR)/100,
	  stepThreeInitG = (initG - threeG)/100,
	  stepThreeInitB = (initB - threeB)/100,
	  stepThreeInitO = (initO - threeO)/100;

    // define and start animation
    let left = initLeft, top = initTop, r = g = b = initR, o = initO;
    function frame() {
	/* console.log(initLeft, left, initLeft + step, initTop, top, initTop + step) */
	if (Math.round(left) < Math.round(initLeft + step*multiplier) && Math.round(top) === Math.round(initTop)) {
	    left += horizStep + random(movement)*horizStep
	    r += stepInitOneR; g += stepInitOneG; b += stepInitOneB; o += stepInitOneO
	}
	else if (Math.round(left) >= Math.round(initLeft + step*multiplier) && Math.round(top) < Math.round(initTop + step*multiplier)) {
	    top += vertStep + random(movement)*vertStep
	    r += stepOneTwoR; g += stepOneTwoG; b += stepOneTwoB; o += stepOneTwoO
	}
	else if (Math.round(left) > Math.round(initLeft) && Math.round(top) >= Math.round(initTop + step*multiplier)) {
	    left -= horizStep - random(movement)*horizStep
	    r += stepTwoThreeR; g += stepTwoThreeG; b += stepTwoThreeB; o += stepTwoThreeO
	}
	else if (top > 0) {
	    top -= vertStep - random(movement)*vertStep
	    r += stepThreeInitR; g += stepThreeInitG; b += stepThreeInitB; o += stepThreeInitO
	}
	else {
	    left = initLeft
	    top = initTop
	}
	if (settings.mode.indexOf('HTML') > -1) {
	    element.style.left = left + "px"
	    element.style.top = top + "px"
	} else if (settings.mode.indexOf('SVG') > -1) {
	    element.setAttribute('cx', left)
	    element.setAttribute('cy', top)
	}

	if (color || opacity) {
	    if (r > 255) {r = 255}
	    if (r < 0) {r = 0}
	    if (g > 255) {g = 255}
	    if (g < 0) {g = 0}
	    if (b > 255) {b = 255}
	    if (b < 0) {b = 0}
	    if (o > 1) {o = 1}
	    if (o < .25) {o = .25}
	    const frameColor = `rgba(${color ? r : initR}, ${color ? g : initG}, ${color ? b : initB}, ${opacity ? o : initO})`
	    /* console.log(frameColor) */
	    settings.mode.indexOf("HTML") > -1 ? element.style.backgroundColor = frameColor : element.style.fill = frameColor
	}
	/* clearInterval(tick) */
    }
    const tick = setInterval(frame, 5);
    return element
}
