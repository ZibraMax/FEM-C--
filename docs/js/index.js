import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OBJLoader } from "./OBJLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as BufferGeometryUtils from "./BufferGeometryUtils.js";
import { AxisGridHelper, MinMaxGUIHelper, ColorGUIHelper } from "./minigui.js";
const nodes = [];
const prisms = [];
const geometries = [];
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

function makeAxisGrid(node, label, units) {
	const helper = new AxisGridHelper(node, units);
	gui.add(helper, "visible").name(label);
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
	const folder = gui.addFolder(name);
	folder.add(vector3, "x", -100, 100).onChange(onChangeFn);
	folder.add(vector3, "y", -100, 100).onChange(onChangeFn);
	folder.add(vector3, "z", -100, 100).onChange(onChangeFn);
	folder.open();
}

function main() {
	function makeInstance(geometry, matProps) {
		const material = new THREE.MeshLambertMaterial(matProps);
		const mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}
	function updateCamera() {
		camera.updateProjectionMatrix();
		render();
	}

	function bufferGeometry(geometry) {
		geometries.push(geometry);
	}

	THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

	// Conectar con el HTML
	const canvas = document.querySelector("#c");
	const renderer = new THREE.WebGLRenderer({
		canvas,
	});
	renderer.shadowMap.enabled = true;

	// Configuración de la cámara
	const fov = 40;
	const aspect = 2; // the canvas default
	const near = 0.01;
	const far = 200;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 0, 25);
	camera.lookAt(0, 0, 0);

	gui.add(camera, "fov", 1, 180).onChange(updateCamera);
	const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
	gui.add(minMaxGUIHelper, "min", 0.1, 1000, 0.1)
		.name("near")
		.onChange(updateCamera);
	gui.add(minMaxGUIHelper, "max", 0.1, 1000, 0.1)
		.name("far")
		.onChange(updateCamera);

	const scene = new THREE.Scene();
	// scene.background = new THREE.Color(1, 1, 1);

	const controls = new OrbitControls(camera, canvas);
	controls.addEventListener("change", render);
	controls.target.set(0, 0, 0);
	controls.update();

	const planeSize = 40;

	const loader = new THREE.TextureLoader();
	const texture = loader.load("./resources/images/checker.png");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);

	const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	const floor = new THREE.Mesh(planeGeo, planeMat);
	floor.rotation.x = Math.PI;
	floor.receiveShadow = true;

	scene.add(floor);

	const model = new THREE.Object3D();

	const order = [1, 0, 2, 3, 2, 0, 3, 0, 1, 3, 1, 2];

	// Creación de objetos (se podría hacer despues???)
	for (let j = 0; j < prisms.length; j++) {
		const parent_geometry = new THREE.TetrahedronGeometry(1);
		const prism = prisms[j];

		const count = parent_geometry.attributes.position.count;
		for (let i = 0; i < count; i++) {
			const verticei = nodes[prism[order[i]]];
			parent_geometry.attributes.position.setX(i, verticei[0]);
			parent_geometry.attributes.position.setY(i, verticei[1]);
			parent_geometry.attributes.position.setZ(i, verticei[2]);
		}
		parent_geometry.attributes.position.needsUpdate = true;
		parent_geometry.computeVertexNormals();

		bufferGeometry(parent_geometry);
		// const a = makeInstance(parent_geometry, {
		// 	color: "red",
		// 	emissive: "blue",
		// 	wireframe: true,
		// });

		// model.add(a);
	}

	const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
		geometries,
		false
	);
	const material = new THREE.MeshPhongMaterial({
		color: "red",
		emissive: "blue",
		flatShading: true,
	});
	const mesh = new THREE.Mesh(mergedGeometry, material);
	mesh.castShadow = true;
	model.add(mesh);

	scene.add(model);
	makeAxisGrid(model, `Model grid`, 3);

	// Luz
	const color = 0xffffff;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(0, 0, 10);
	light.target.position.set(-5, 0, 0);
	light.castShadow = true;
	scene.add(light);
	scene.add(light.target);

	const helper = new THREE.DirectionalLightHelper(light);
	scene.add(helper);

	function updateLight() {
		light.target.updateMatrixWorld();
		helper.update();
		render();
	}
	updateLight();

	gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
	gui.add(light, "intensity", 0, 2, 0.01);

	makeXYZGUI(gui, light.position, "position", updateLight);
	makeXYZGUI(gui, light.target.position, "target", updateLight);

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);
	}
	window.addEventListener("resize", render);

	render();
}

fetch("./resources/geometry.json")
	.then((response) => {
		return response.json();
	})
	.then((jsondata) => {
		nodes.push(...jsondata["coords"]);
		prisms.push(...jsondata["prisms"]);
		console.log(prisms.length, nodes.length);
		main();
	});
