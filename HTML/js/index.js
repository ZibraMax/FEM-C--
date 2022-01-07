import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OBJLoader } from "./OBJLoader.js";
import { OrbitControls } from "./OrbitControls.js";

const gui = new GUI();
function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

class AxisGridHelper {
	constructor(node, units = 10) {
		const axes = new THREE.AxesHelper();
		axes.material.depthTest = false;
		axes.renderOrder = 2; // after the grid
		node.add(axes);

		const grid = new THREE.GridHelper(units, units);
		grid.material.depthTest = false;
		grid.renderOrder = 1;
		node.add(grid);

		this.grid = grid;
		this.axes = axes;
		this.visible = false;
	}
	get visible() {
		return this._visible;
	}
	set visible(v) {
		this._visible = v;
		this.grid.visible = v;
		this.axes.visible = v;
	}
}

function makeAxisGrid(node, label, units) {
	const helper = new AxisGridHelper(node, units);
	gui.add(helper, "visible").name(label);
}

function main() {
	function makeInstance(geometry, matProps, pos, add = false) {
		const material = new THREE.MeshPhongMaterial(matProps);
		const mesh = new THREE.Mesh(geometry, material);
		if (add) {
			scene.add(mesh);
		}
		mesh.position.set(...pos);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		return mesh;
	}

	// Conectar con el HTML
	const canvas = document.querySelector("#c");
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.shadowMap.enabled = true;

	// Configuración de la cámara
	const fov = 75;
	const aspect = 2; // the canvas default should be calculated
	const near = 0.1;
	const far = 6;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 1, -3);
	camera.up.set(0, 1, 1);
	camera.lookAt(0, 0, 0);
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color(1, 1, 1);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	// Creación de objetos (se podría hacer despues???)
	const solarSystem = new THREE.Object3D();
	scene.add(solarSystem);

	const earthOrbit = new THREE.Object3D();
	earthOrbit.position.set(-1, 0, 0);

	const moonOrbit = new THREE.Object3D();
	moonOrbit.position.set(-0.2, 0, 0);

	let radius = 0.5;
	let widthSegments = 15;
	let heightSegmentes = 15;
	const geometry = new THREE.SphereGeometry(
		radius,
		widthSegments,
		heightSegmentes
	);

	radius = 0.1;
	widthSegments = 15;
	heightSegmentes = 15;
	let geometry2 = new THREE.SphereGeometry(
		radius,
		widthSegments,
		heightSegmentes
	);

	radius = 0.05;
	widthSegments = 5;
	heightSegmentes = 5;
	let geometry3 = new THREE.SphereGeometry(
		radius,
		widthSegments,
		heightSegmentes
	);

	const sun = makeInstance(
		geometry,
		{ emissive: 0xffff00, flatShading: true },
		[0, 0, 0]
	);
	const earth = makeInstance(
		geometry2,
		{
			color: 0x2233ff,
			emissive: 0x112244,
			shininess: 0,
			flatShading: true,
		},
		[0, 0, 0]
	);
	const moon = makeInstance(
		geometry3,
		{ color: "gray", emissive: 0x112244, shininess: 0, flatShading: true },
		[0, 0, 0]
	);

	solarSystem.add(sun);
	earthOrbit.add(earth);
	moonOrbit.add(moon);
	earthOrbit.add(moonOrbit);
	solarSystem.add(earthOrbit);

	const objs = [solarSystem, earthOrbit, moonOrbit, sun, earth, moon];
	const objLoader = new OBJLoader();
	objLoader.load("resources/tie.obj", (root) => {
		const ship_material = new THREE.MeshPhongMaterial({
			color: "white",
			emissive: "gray",
			shininess: 40,
			// flatShading: true,
		});
		root.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = ship_material;
			}
		});
		root.scale.set(0.05, 0.05, 0.05);
		root.position.set(0.8, 1, 0);
		scene.add(root);
		// objs.push(root);
		solarSystem.add(root);
	});
	// const objs = [teapot];

	// Luz
	const color = 0xffffff;
	const intensity = 3;
	const light = new THREE.PointLight(color, intensity);
	light.castShadow = true;
	scene.add(light);

	makeAxisGrid(solarSystem, "solarSystem", 25);
	makeAxisGrid(sun, "sunMesh");
	makeAxisGrid(earthOrbit, "earthOrbit");
	makeAxisGrid(earth, "earthMesh");
	makeAxisGrid(moonOrbit, "moonOrbit");
	makeAxisGrid(moon, "moonMesh");

	function render(time) {
		time *= 0.001; // convert time to seconds
		objs.forEach((obj, ndx) => {
			const speed = 1;
			const rot = time * speed;
			obj.rotation.y = rot;
		});
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}
main();
