import { Stack } from "@mantine/core";
import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { ShaderMaterial, Vector2, Vector3 } from "three";

function GradientPlane() {
  const materialRef = useRef<ShaderMaterial>(null!);
  const { invalidate } = useThree();
  const offset = useRef(new Vector2(0, 0));

  useEffect(() => {
    const handleResize = () => {
      if (!materialRef.current) return;
      const { innerWidth: w, innerHeight: h } = window;
      materialRef.current!.uniforms.u_resolution?.value.set(w, h);
      invalidate();
    };
    handleResize();
    window.addEventListener("resize", () => {
      handleResize();
      invalidate();
    });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [invalidate]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={`
        precision highp float;
        
        uniform vec2 u_resolution;
        uniform vec3 u_colorStops[5];
        uniform vec2 u_offset;
        
        varying vec2 vUv;

        // 2-D Simplex noise — Ashima Arts (public domain)
        vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;} 
        vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;} 
        vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} 
        float simplex2d(vec2 v){
          const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                               0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                              -0.577350269189626,  // -1.0 + 2.0 * C.x
                               0.024390243902439); // 1.0 / 41.0
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i); // Avoid truncation effects in permutation
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                      + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0 * a0 + h * h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Hash for grain
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

        vec3 getRamp(float t){
          if(t < 0.25){ return mix(u_colorStops[0], u_colorStops[1], t / 0.25); }
          if(t < 0.5){ return mix(u_colorStops[1], u_colorStops[2], (t-0.25)/0.25); }
          if(t < 0.75){ return mix(u_colorStops[2], u_colorStops[3], (t-0.5)/0.25); }
          return mix(u_colorStops[3], u_colorStops[4], (t-0.75)/0.25);
        }

        // evaluate colour at a given UV after warp & ramp
        vec3 evalColor(vec2 uv){
          vec2 p = uv * 2.0 - 1.0;
          p.x *= u_resolution.x / u_resolution.y;

          float n1 = simplex2d(p * 0.4);          // lower frequency for larger flow
          vec2 warp = p + n1 * 0.65;              // keep curvature with slightly stronger warp
          float base = simplex2d(warp * 0.4);    // match lower frequency in base
          float v = clamp(0.5 + base * 0.6, 0.0, 1.0);
          return getRamp(v);
        }

        void main(){
          vec2 uv = (gl_FragCoord.xy + u_offset * u_resolution) / u_resolution;

          vec3 col = evalColor(uv);

          // 4-tap blur for silky smoothness
          vec2 texel = 1.0 / u_resolution;
          vec3 blurCol = ( evalColor(uv + vec2(texel.x, 0.0)) +
                           evalColor(uv - vec2(texel.x, 0.0)) +
                           evalColor(uv + vec2(0.0, texel.y)) +
                           evalColor(uv - vec2(0.0, texel.y)) ) * 0.25;
          col = mix(col, blurCol, 0.6);

          vec3 finalCol = col + hash(gl_FragCoord.xy) * 0.02;
          float vig = smoothstep(0.8, 1.2, length(uv));
          finalCol *= 1.0 - vig * 0.25;

          gl_FragColor = vec4(finalCol, 1.0);
        }
      `}
        vertexShader={`
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `}
        uniforms={{
          u_resolution: {
            value: new Vector2(window.innerWidth, window.innerHeight),
          },
          u_colorStops: {
            value: [
              new Vector3(0.086, 0.094, 0.333), // #161855
              new Vector3(0.224, 0.141, 0.847), // #3924d8
              new Vector3(0.424, 0.125, 1.0), // #6c20ff
              new Vector3(0.722, 0.145, 1.0), // #b825ff
              new Vector3(1.0, 0.333, 0.871), // #ff55de
            ],
          },
          u_offset: {
            value: new Vector2(3.5, 1.5),
          },
        }}
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
