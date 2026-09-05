'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

type PatternShape = 'Checks' | 'Stripes' | 'Edge';

type AnimatedGradientConfig = {
  color1: string;
  color2: string;
  color3: string;
  rotation?: number;
  proportion?: number;
  scale?: number;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  offset?: number;
  shape?: PatternShape;
  shapeSize?: number;
};

type AnimatedGradientProps = {
  config?: AnimatedGradientConfig;
  noise?: { opacity: number; scale?: number };
  radius?: string;
  style?: CSSProperties;
  className?: string;
};

const SHAPES: Record<PatternShape, number> = { Checks: 0, Stripes: 1, Edge: 2 };

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265359

vec2 rotateUv(vec2 uv, float angle) {
  return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * uv;
}

float randomValue(vec2 point) {
  return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  float a = randomValue(cell);
  float b = randomValue(cell + vec2(1.0, 0.0));
  float c = randomValue(cell + vec2(0.0, 1.0));
  float d = randomValue(cell + vec2(1.0, 1.0));
  vec2 blend = local * local * (3.0 - 2.0 * local);
  return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}

vec4 blendColors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgeWidth, float blurAmount) {
  float first = smoothstep(.35 * edgeWidth, .7 - .35 * edgeWidth + .5 * blurAmount, mixer);
  float second = smoothstep(.3 + .35 * edgeWidth, 1. - .35 * edgeWidth + blurAmount, mixer);
  return mix(mix(c1, c2, first), c3, second);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float time = .5 * u_time;
  float noiseScale = .0005 + .006 * u_scale;

  uv -= .5;
  uv *= noiseScale * u_resolution;
  uv = rotateUv(uv, u_rotation * .5 * PI);
  uv /= max(u_pixelRatio, 1.0);
  uv += .5;

  float firstNoise = valueNoise(uv + time);
  float secondNoise = valueNoise(uv * 2. - time);
  float angle = firstNoise * TWO_PI;
  uv += 4. * u_distortion * secondNoise * vec2(cos(angle), sin(angle));

  for (int index = 1; index <= 4; index++) {
    float iteration = float(index);
    if (iteration > u_swirlIterations) break;
    uv.x += clamp(u_swirl, 0., 2.) / iteration * cos(time + iteration * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / iteration * cos(time + iteration * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  float mixer;
  if (u_shape < .5) {
    vec2 shapeUv = uv * (.5 + 3.5 * u_shapeScale);
    float shape = .5 + .5 * sin(shapeUv.x) * cos(shapeUv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    float stripe = fract((uv * (.25 + 3. * u_shapeScale)).y);
    float shape = smoothstep(0., .55, stripe) * smoothstep(1., .45, stripe);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float edge = (1. - uv.y - .5) / (noiseScale * u_resolution.y) + .5;
    float shapeScaling = .2 * (1. - u_shapeScale);
    mixer = smoothstep(.45 - shapeScaling, .55 + shapeScaling, edge + .3 * (proportion - .5));
  }

  vec4 color = blendColors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
  fragColor = vec4(color.rgb, 1.0);
}
`;

function toRgba(hex: string): [number, number, number, number] {
  const value = hex.replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((part) => part + part).join('') : value;
  return [
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
    normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  ];
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function AnimatedGradient({
  config = { color1: '#01030a', color2: '#072b59', color3: '#0b6eaa' },
  noise,
  radius = '0px',
  style,
  className,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power', premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      time: uniform('u_time'), resolution: uniform('u_resolution'), pixelRatio: uniform('u_pixelRatio'),
      scale: uniform('u_scale'), rotation: uniform('u_rotation'), proportion: uniform('u_proportion'),
      softness: uniform('u_softness'), shape: uniform('u_shape'), shapeScale: uniform('u_shapeScale'),
      distortion: uniform('u_distortion'), swirl: uniform('u_swirl'), swirlIterations: uniform('u_swirlIterations'),
    };
    const colors = [config.color1, config.color2, config.color3].map(toRgba);
    ['u_color1', 'u_color2', 'u_color3'].forEach((name, index) => gl.uniform4fv(uniform(name), colors[index]));
    gl.uniform1f(uniforms.scale, config.scale ?? .46);
    gl.uniform1f(uniforms.rotation, ((config.rotation ?? -18) * Math.PI) / 180);
    gl.uniform1f(uniforms.proportion, (config.proportion ?? 48) / 100);
    gl.uniform1f(uniforms.softness, (config.softness ?? 88) / 100);
    gl.uniform1f(uniforms.shape, SHAPES[config.shape ?? 'Edge']);
    gl.uniform1f(uniforms.shapeScale, (config.shapeSize ?? 58) / 100);
    gl.uniform1f(uniforms.distortion, (config.distortion ?? 7) / 50);
    gl.uniform1f(uniforms.swirl, (config.swirl ?? 28) / 100);
    gl.uniform1f(uniforms.swirlIterations, Math.min(config.swirlIterations ?? 3, 4));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const modestDevice = (navigator.hardwareConcurrency || 4) <= 4;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, modestDevice ? 1 : 1.25);
    const frameDuration = 1000 / (modestDevice ? 18 : 24);
    const startedAt = performance.now();
    let frameId = 0;
    let previousFrame = 0;

    const resize = () => {
      const width = Math.max(1, Math.round(container.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(container.clientHeight * pixelRatio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      if (now - previousFrame >= frameDuration || reducedMotion) {
        previousFrame = now;
        resize();
        gl.uniform1f(uniforms.time, ((now - startedAt) / 1000) * ((config.speed ?? 13) / 100) * 5 + (config.offset ?? -180) * .01);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.pixelRatio, pixelRatio);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!reducedMotion && !document.hidden) frameId = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frameId);
      if (!document.hidden && !reducedMotion) frameId = requestAnimationFrame(draw);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    document.addEventListener('visibilitychange', handleVisibility);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [config.color1, config.color2, config.color3, config.distortion, config.offset, config.proportion, config.rotation, config.scale, config.shape, config.shapeSize, config.softness, config.speed, config.swirl, config.swirlIterations]);

  const fallback = `radial-gradient(circle at 72% 18%, ${config.color3} 0, transparent 42%), linear-gradient(145deg, ${config.color2}, ${config.color1} 72%)`;

  return (
    <div ref={containerRef} className={className} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden', borderRadius: radius, background: fallback, ...style }}>
      <canvas ref={canvasRef} className="animated-gradient-canvas" />
      {noise && noise.opacity > 0 ? <div className="animated-gradient-noise" style={{ opacity: noise.opacity, backgroundSize: `${(noise.scale ?? 1) * 180}px` }} /> : null}
    </div>
  );
}
