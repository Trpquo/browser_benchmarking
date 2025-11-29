const animationDuration = {
    duration: 2000,
    iterations: Infinity
}
const random = (cond)=>cond === "on" ? Math.random() : 0;
const spin = ()=> Math.random() < 0.5 ? -1 : 1;

const randomRGBA = (opacity)=>{
    const r = Math.round(Math.random() * 150 + 105)
    const g = Math.round(Math.random() * 150 + 105)
    const b = Math.round(Math.random() * 150 + 105)
    const a = opacity==="on" ? Math.random() * .7 + .3 : 1
    return {r:r, g:g, b:b, a:a}
}

const colorStr = (c)=>`rgba(${c.r},${c.g},${c.b},${c.a})`

// color distance calculator
const colorDistance = (c1, c2)=>{
    const dr = c1.r - c2.r
    const dg = c1.g - c2.g
    const db = c1.b - c2.b
    return Math.sqrt(dr*dr + dg*dg + db*db)
}

