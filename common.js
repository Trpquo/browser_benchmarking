const animationDuration = {
    duration: 2000,
    iterations: Infinity
}
const random = (cond)=>cond === "on" ? Math.random() : 0;
const spin = ()=> Math.random() < 0.5 ? -1 : 1;
