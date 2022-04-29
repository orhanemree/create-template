<template>
    <div id="canvas"></div>
</template>

<script>
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export default {
    name: "Model",
    data(){
        return{}
    },
    methods: {
        init(){

            // three.js setup
            const canvas = document.getElementById("canvas");
            this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
            this.camera.position.z = 50;
            this.scene = new THREE.Scene();
            this.camera.lookAt(this.scene.position);

            // light
            const ambientLight = new THREE.AmbientLight(16777215);
            this.scene.add(ambientLight);

            // grid helper
            const gridHelper = new THREE.GridHelper(20, 15);
            this.scene.add(gridHelper);

            // renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            canvas.appendChild(this.renderer.domElement);

            // orbit controls
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
    },
    mounted(){
        this.init();
        this.animate();
    }
}
</script>