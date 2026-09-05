'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

type AnimatedGradientConfig = {
  color1: string;
  color2: string;
  color3: string;
  speed?: number;
  scale?: number;
  distortion?: number;
};

type AnimatedGradientProps = {
  config?: AnimatedGradientConfig;
  noise?: { opacity: number; scale?: number };
  radius?: string;
  style?: CSSProperties;
  className?: string;
};

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_scale;
uniform float u_distortion;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);

  float t = u_time * 0.16;
  float scale = mix(1.6, 3.4, u_scale);
  float waveA = sin((p.x * scale + p.y * 1.7) * 2.4 + t);
  float waveB = cos((p.y * scale - p.x * 1.15) * 2.8 - t * 0.82);
  float bend = sin(length(p + vec2(sin(t) * 0.12, cos(t * 0.7) * 0.1)) * 8.0 - t);
  float field = (waveA + waveB + bend * u_distortion) / (2.0 + u_distortion);
  float blend = smoothstep(-0.85, 0.95, field);

  vec2 glowPoint = vec2(0.2 * sin(t * 0.7), 0.18 * cos(t * 0.55));
  float glow = exp(-3.8 * length(p - glowPoint));
  vec3 color = mix(u_color1, u_color2, blend * 0.72);
  color = mix(color, u_color3, glow * 0.42);

  float vignette = smoothstep(0.92, 0.18, length(p));
  color *= 0.56 + vignette * 0.44;
  fragColor = vec4(color, 1.0);
}
`;

function toRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((part) => part + part).join('') : value;
  return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16) / 255) as [number, number, number];
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
  config = { color1: '#01040c', color2: '#082d5c', color3: '#0a6fa8', speed: 8, scale: 0.42, distortion: 0.7 },
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

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    });
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

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const scale = gl.getUniformLocation(program, 'u_scale');
    const distortion = gl.getUniformLocation(program, 'u_distortion');
    const colors = [config.color1, config.color2, config.color3].map(toRgb);
    ['u_color1', 'u_color2', 'u_color3'].forEach((name, index) => gl.uniform3fv(gl.getUniformLocation(program, name), colors[index]));
    gl.uniform1f(scale, config.scale ?? 0.42);
    gl.uniform1f(distortion, config.distortion ?? 0.7);

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.15);
      const width = Math.max(1, Math.round(container.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(container.clientHeight * pixelRatio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frameDuration = 1000 / 24;
    const startedAt = performance.now();
    let frameId = 0;
    let previousFrame = 0;

    const draw = (now: number) => {
      if (now - previousFrame >= frameDuration || reducedMotion) {
        previousFrame = now;
        resize();
        gl.uniform1f(time, ((now - startedAt) / 1000) * ((config.speed ?? 8) / 10));
        gl.uniform2f(resolution, canvas.width, canvas.height);
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
  }, [config.color1, config.color2, config.color3, config.distortion, config.scale, config.speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden', borderRadius: radius, background: config.color1, ...style }}
    >
      <canvas ref={canvasRef} className="animated-gradient-canvas" />
      {noise && noise.opacity > 0 ? <div className="animated-gradient-noise" style={{ opacity: noise.opacity, backgroundSize: `${(noise.scale ?? 1) * 180}px` }} /> : null}
    </div>
  );
}
