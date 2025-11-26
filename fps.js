const fpsElem = document.getElementById('fps');

let lastTime = performance.now();
let frameCount = 0;

function loop(now, terminate) {

    frameCount++;

    const delta = now - lastTime;
    // ažuriraj FPS otprilike svake sekunde
    if (delta >= 1000) {
        const fps = (frameCount * 1000) / delta;
        fpsElem.value = fps.toFixed(2);
        frameCount = 0;
        lastTime = now;
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
