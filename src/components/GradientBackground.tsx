import { extend, Canvas, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import {
  ShaderMaterial,
  Vector2,
  Vector3,
  Color,
  RawShaderMaterial,
} from "three";
import { Stack } from "@mantine/core";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientShaderMaterial: any;
    }
  }
}

function shaderMaterial(
  uniforms: { [key: string]: any },
  vertexShader: string,
  fragmentShader: string,
  onInit?: (material?: RawShaderMaterial) => void
) {
  const material = class extends RawShaderMaterial {
    constructor() {
      const entries = Object.entries(uniforms);
      // Create uniforms and inject them into the shader code
      const uniformValues = entries.reduce(
        (acc, [name, value]) => {
          const uniform = { value };
          acc[name] = uniform;
          return acc;
        },
        {} as { [key: string]: { value: any } }
      );

      super({
        uniforms: uniformValues,
        vertexShader,
        fragmentShader,
      });

      // Create getter/setters
      entries.forEach(([name]) =>
        Object.defineProperty(this, name, {
          get: () => this.uniforms[name]!.value,
          set: (v) => (this.uniforms[name]!.value = v),
        })
      );

      if (onInit) onInit(this);
    }
  };
  (material as any).key = `${vertexShader}${fragmentShader}`;
  return material;
}

const GradientShaderMaterial = shaderMaterial(
  {
    u_resolution: new Vector2(),
    u_offset: new Vector2(3.5, 1.5),
    u_ramp: [
      new Color("#0E3E1E"),
      new Color("#8A05DB"),
      new Color("#DE37CC"),
      new Color("#E7EE9D"),
    ],
    u_shapeColA: new Color("#ABE4FF"),
    u_shapeColB: new Color("#420084"),
    u_shapePosA: new Vector2(0.65, 0.8),
    u_shapePosB: new Vector2(0.35, 0.21),
    u_shapeRadA: 0.58,
    u_shapeRadB: 0.58,
    u_gradientAngle: -28.0,
  },
  /*glsl*/ `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  /*glsl*/ `
    precision highp float;

    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform vec2 u_offset;
    uniform vec3 u_ramp[4];
    uniform vec3 u_shapeColA;
    uniform vec3 u_shapeColB;
    uniform vec2 u_shapePosA;
    uniform vec2 u_shapePosB;
    uniform float u_shapeRadA;
    uniform float u_shapeRadB;
    uniform float u_gradientAngle;

    // 2-D Simplex noise — Ashima Arts (public domain)
    vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;} 
    vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;} 
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} 
    float simplex2d(vec2 v){
      const vec4 C = vec4(0.211324865405187, (3.0-sqrt(3.0))/6.0, 0.366025403784439, 0.5*(sqrt(3.0)-1.0));
      const vec4 D = vec4(-0.577350269189626, -1.0 + 2.0 * C.x, 0.024390243902439, 1.0 / 41.0);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * D.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Seam-free overlay: smoothly blends multiply→screen across base 0.35-0.65
    vec3 overlay(vec3 base, vec3 blend) {
      vec3 multiply = 2.0 * base * blend;
      vec3 screen   = 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
      vec3 factor   = smoothstep(0.35, 0.65, base); // soft transition
      return mix(multiply, screen, factor);
    }

    vec3 getRamp(float t){
      // Non-uniform stop positions to match reference
      if(t < 0.20){ return mix(u_ramp[0], u_ramp[1], t / 0.20); }
      if(t < 0.55){ return mix(u_ramp[1], u_ramp[2], (t - 0.20) / 0.35); }
      return mix(u_ramp[2], u_ramp[3], (t - 0.55) / 0.45);
    }

    vec3 baseColour(vec2 uv) {
      // Rotated gradient
      float angle = u_gradientAngle * 3.14159 / 180.0;
      vec2 dir = vec2(cos(angle), sin(angle));
      float t = dot(uv - vec2(0.5), dir) + 0.5;
      vec3 col = getRamp(t);

      // Radial tints (aspect-correct circles)
      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

      vec2 dA = (uv - u_shapePosA);
      dA.x *= aspect.x;
      float distA = length(dA);
      float maskA = 1.0 - step(u_shapeRadA, distA);
      col = mix(col, overlay(col, u_shapeColA), maskA);

      vec2 dB = (uv - u_shapePosB);
      dB.x *= aspect.x;
      float distB = length(dB);
      float maskB = 1.0 - step(u_shapeRadB, distB);
      col = mix(col, overlay(col, u_shapeColB), maskB);

      return col;
    }

    void main() {
      vec2 uv = vUv;
      vec3 bColor = baseColour(uv);

      vec3 finalColor = bColor;
      // Convert from linear to sRGB for perceptual match
      finalColor = pow(finalColor, vec3(1.0/2.2));

      // Final colour
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ GradientShaderMaterial });

function GradientPlane() {
  const materialRef = useRef<any>(null!);
  const { invalidate, size } = useThree();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_resolution.value.set(
        size.width,
        size.height
      );
      invalidate();
    }
  }, [size, invalidate]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <gradientShaderMaterial
        ref={materialRef}
        key={(GradientShaderMaterial as any).key}
      />
    </mesh>
  );
}

export function GradientBackground() {
  return (
    <Stack style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Canvas
        orthographic
        dpr={1.1}
        gl={{ powerPreference: "high-performance", antialias: false }}
        frameloop="demand"
        style={{ position: "absolute", inset: 0, zIndex: -1 }}
      >
        <GradientPlane />
      </Canvas>
    </Stack>
  );
}
