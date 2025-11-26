function GLanimateCanvas(settings, container, step) {
    console.log("Animating with WebGL.")
    const { increment:count, random:movement, distance:multiplier, color, blending:opacity } = settings, inch = multiplier/50

    const element = document.createElement("canvas")
    element.setAttribute('height', step*(Math.ceil(settings.increment/50)+50))
    element.setAttribute('width', step*50)
    container.appendChild(element)
    gl = element.getContext('webgl2', { antialias: true, alpha: true, })
    if (!gl) { alert('WebGL not available'); return }

    const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
    gl.useProgram(program);

    // Locations of uniforms
    const u_keyframesLoc = gl.getUniformLocation(program, 'u_keyframes');
    const u_timeLoc = gl.getUniformLocation(program, 'u_time');

    // Define keyframes as [x,y] in range [0..1]
    const keyframes = new Float32Array([
	0, 0,  // 0%
	1, 0,  // 25%
	1, 1,  // 50%
	0, 1,  // 75%
	0, 0   // 100%
    ]);

    // Set keyframes uniform once (array of vec2)
    gl.uniform2fv(u_keyframesLoc, keyframes);
    function render(timeMs) {
	const duration = 2000; // 4 seconds per full animation loop
	const time = (timeMs % duration) / duration;

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Update animation progress uniform
	gl.uniform1f(u_timeLoc, time);

	// Draw a single point (our circle)
	gl.drawArrays(gl.POINTS, 0, 1);

	requestAnimationFrame(render);
    }    

    requestAnimationFrame(render)
    return element
}

// Vertex shader source
const vertexShaderSrc = `#version 300 es
precision highp float;

// Uniform array of keyframe positions (vec2)
uniform vec2 u_keyframes[5];
uniform float u_time; // normalized animation time [0..1]

out vec3 v_color;

void main() {
  int segmentCount = 4; // 5 keyframes means 4 interpolation segments
  float t = u_time * float(segmentCount);
  int segmentIndex = int(floor(t));
  float segmentT = fract(t);

  vec2 startPos = u_keyframes[segmentIndex];
  vec2 endPos = u_keyframes[segmentIndex + 1];
  
  vec2 pos = mix(startPos, endPos, segmentT);

  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0); // convert [0..1] -> clip space [-1..1]
  gl_PointSize = 20.0; // make point visible as circle

  v_color = vec3(1.0, 0.5, 0.0); // orange color
}
`;

// Fragment shader source
const fragmentShaderSrc = `#version 300 es
precision highp float;
in vec3 v_color;
out vec4 outColor;

void main() {
  // Circular point: discard pixels outside circle radius
  vec2 coord = gl_PointCoord - vec2(0.5);
  if (length(coord) > 0.5) discard;

  outColor = vec4(v_color, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw "Program link failed: " + gl.getProgramInfoLog(program);
  }
  return program;
}
