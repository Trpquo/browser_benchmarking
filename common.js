// setting up dimentions of dots and other common animation parameters
const dotsPerRow = 50 
const dotDiameter = window.innerWidth / dotsPerRow
const animation = {
    duration: 2000,
    segments: 4,
    iterations: Infinity
}

// common utility functions for generating random numbers when condition is met
const random = (cond)=>cond === "on" ? Math.random() : 0;
const spin = ()=> Math.random() < 0.5 ? -1 : 1;

// function to calculate random offset from common path
const push = (movement, multiplier)=>random(movement)*dotDiameter*multiplier*spin()/2

// function to calculate random color values, from 150-255 per RGB color channel; and .3-1 for opacity
const randomRGBA = (color, opacity)=>{
    const r = Math.round(155 + random(color) * 100 * spin())
    const g = Math.round(155 + random(color) * 100 * spin())
    const b = Math.round(155 + random(color) * 100 * spin())
    const a = opacity ? Math.random() * .7 + .3 : 1
    return {r,g,b,a}
}
const colorStr = ({r,g,b,a})=>`rgba(${r},${g},${b},${a})`
// neutral color
const gray = {r:155,g:155,b:155,a:1}
const basicColor = colorStr(gray)

// color distance calculator
const colorDistance = (c1, c2)=>{
    const dr = c1.r - c2.r
    const dg = c1.g - c2.g
    const db = c1.b - c2.b
    return Math.sqrt(dr*dr + dg*dg + db*db)
}

// Linear interpolation
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// function that generates five animation keyframes based on user-defined parameters 
const keyframesGenerator = (movement, multiplier, color, opacity)=>[
    {top: 0, left: 0, color: gray},
    {top: 0 + push(movement, multiplier), left: dotDiameter + push(movement, multiplier), color: randomRGBA(color, opacity)},
    {top: dotDiameter + push(movement, multiplier), left: dotDiameter + push(movement, multiplier), color: randomRGBA(color, opacity)},
    {top: dotDiameter + push(movement, multiplier), left: 0 + push(movement, multiplier), color: randomRGBA(color, opacity)},
    {top: 0, left: 0, color: gray},
]
