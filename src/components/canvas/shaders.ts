export const CreationShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor1: { value: [1.0, 0.84, 0.0] }, // Gold
        uColor2: { value: [1.0, 1.0, 1.0] }, // White
        uOpacity: { value: 0.1 }
    },
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simple noise function
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      float n = noise(vPosition * 0.5 + uTime * 0.1);
      vec3 finalColor = mix(uColor1, uColor2, n);
      float dist = length(vPosition);
      float alpha = uOpacity * (1.0 - smoothstep(0.0, 10.0, dist));
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};
