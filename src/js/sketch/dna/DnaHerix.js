import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class DnaHerix {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 800;
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(this.num * 3), 3);
    const baRadians = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    const baRadiuses = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    const baDelays = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const diff = {
        x: (Math.random() * 2 - 1) * 1.2,
        y: (Math.random() * 2 - 1) * 1.2,
        z: (Math.random() * 2 - 1) * 1.2,
      };
      baPositions.setXYZ(
        i,
        ((i / this.num) * 2 - 1) * 100 + diff.x,
        diff.y,
        diff.z
      );
      baRadians.setX(i, MathEx.radians(i / this.num * 1200 + i % 2 * 180));
      baRadiuses.setX(i, 20);
      baDelays.setX(i, MathEx.radians(Math.random() * 360));
    }
    geometry.addAttribute('position', baPositions);
    geometry.addAttribute('radian', baRadians);
    geometry.addAttribute('radius', baRadiuses);
    geometry.addAttribute('delay', baDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/dnaHerix.vs'),
      fragmentShader: require('./glsl/dnaHerix.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
    this.obj.name = 'DNA Herix';
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}