let FPSLoopRequest = false
let FPSFrameRequest = null

const fpsElem = document.getElementById('fps');

let lastTime = performance.now();
let frameCount = 0;

function fpsLoop(now, terminate) {
    if (FPSLoopRequest) {
	frameCount++;

	const delta = now - lastTime;
	// ažuriraj FPS otprilike svake sekunde
	if (delta >= 1000) {
            const fps = (frameCount * 1000) / delta;
            fpsElem.value = fps.toFixed(2);
            frameCount = 0;
            lastTime = now;
	}

	FPSFrameRequest = requestAnimationFrame(fpsLoop);
    } else {
	console.log("Canceling FPS measure")
	fpsElem.value = "OFF"
	cancelAnimationFrame(FPSFrameRequest)
    }
}

