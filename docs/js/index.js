import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OBJLoader } from "./OBJLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as BufferGeometryUtils from "./BufferGeometryUtils.js";
import { AxisGridHelper, MinMaxGUIHelper, ColorGUIHelper } from "./minigui.js";
const nodes = [];
const prisms = [];
const types = [];
let disp = [];
let nvn = 0;
const geometries = [];
let lines = [];
const gui = new GUI();
let side = 1.0;
let mult = -1.0;
let magnif = 5;
let time_mult = 1;
let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval = 1 / 120;
let NODE = 0;
let disps = [];

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
	scene.background = new THREE.Color(1, 1, 1);

	const controls = new OrbitControls(camera, canvas);
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
	planeGeo.translate(0, 0, 8);
	const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	const floor = new THREE.Mesh(planeGeo, planeMat);
	floor.rotation.x = Math.PI;
	floor.receiveShadow = true;

	scene.add(floor);

	const model = new THREE.Object3D();

	// Creación de objetos (se podría hacer despues???)
	const line_material = new THREE.LineBasicMaterial({
		color: "black",
		linewidth: 3,
	});
	for (let j = 0; j < prisms.length; j++) {
		let order = undefined;
		let line_order = undefined;
		let parent_geometry = undefined;
		if (types[j] == "B1V") {
			parent_geometry = new THREE.BoxGeometry(1);
			order = [
				6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5, 2,
				3, 1, 0,
			];
			line_order = [0, 1, 2, 3, 0, 4, 5, 1, 5, 6, 2, 6, 7, 3];
		} else {
			parent_geometry = new THREE.TetrahedronGeometry(1);
			order = [1, 0, 2, 3, 2, 0, 3, 0, 1, 3, 1, 2];
		}
		const prism = prisms[j];

		const count = parent_geometry.attributes.position.count;
		for (let i = 0; i < count; i++) {
			const gdl = prism[order[i]];
			const verticei = nodes[gdl];
			parent_geometry.attributes.position.setX(
				i,
				verticei[0] + disp[gdl * 3] * mult
			);
			parent_geometry.attributes.position.setY(
				i,
				verticei[1] + disp[gdl * 3 + 1] * mult
			);
			parent_geometry.attributes.position.setZ(
				i,
				verticei[2] + disp[gdl * 3 + 2] * mult
			);
		}
		parent_geometry.attributes.position.needsUpdate = true;
		parent_geometry.computeVertexNormals();

		bufferGeometry(parent_geometry);

		const points = [];
		for (let i = 0; i < line_order.length; i++) {
			const gdl = prism[line_order[i]];
			const verticei = nodes[gdl];
			points.push(new THREE.Vector3(...verticei));
		}
		const line_geo = new THREE.BufferGeometry().setFromPoints(points);
		lines.push(line_geo);
	}

	let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
		geometries,
		true
	);
	const material = new THREE.MeshPhongMaterial({
		color: "#c4bbfc",
		emissive: "blue",
		flatShading: true,
		// wireframe: true,
	});
	let mergedLineGeometry = BufferGeometryUtils.mergeBufferGeometries(
		lines,
		true
	);
	let line = new THREE.Line(mergedLineGeometry, line_material);
	scene.add(line);

	let mesh = new THREE.Mesh(mergedGeometry, material);
	model.add(mesh);

	scene.add(model);
	makeAxisGrid(model, `Model grid`, 3);

	// Luz
	const color = 0xffffff;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(0, 0, 10);
	light.target.position.set(-5, 0, 0);
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

	// function render() {
	// 	if (resizeRendererToDisplaySize(renderer)) {
	// 		const canvas = renderer.domElement;
	// 		camera.aspect = canvas.clientWidth / canvas.clientHeight;
	// 		camera.updateProjectionMatrix();
	// 	}

	// 	renderer.render(scene, camera);
	// }
	// controls.addEventListener("change", render);
	// render();
	// scene.remove(model);
	function update(time) {
		// console.log(disp);
		requestAnimationFrame(update);
		delta += clock.getDelta();
		if (delta > interval) {
			// The draw or time dependent code are here
			render(delta);

			delta = delta % interval;
		}
	}
	function render(time) {
		time = time || 0;
		// console.log(time);

		mult += time * time_mult * side;
		if (mult > 1) {
			side = -1.0;
		} else if (mult < -1) {
			side = 1.0;
		}

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		lines = [];
		for (let j = 0; j < geometries.length; j++) {
			const parent_geometry = geometries[j];
			let order = undefined;
			let line_order = undefined;
			if (types[j] == "B1V") {
				order = [
					6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5,
					2, 3, 1, 0,
				];
				line_order = [0, 1, 2, 3, 0, 4, 5, 1, 5, 6, 2, 6, 7, 3];
			} else {
				order = [1, 0, 2, 3, 2, 0, 3, 0, 1, 3, 1, 2];
			}
			const prism = prisms[j];

			const count = parent_geometry.attributes.position.count;
			for (let i = 0; i < count; i++) {
				const gdl = prism[order[i]];
				const verticei = nodes[gdl];
				parent_geometry.attributes.position.setX(
					i,
					verticei[0] + disp[gdl * 3] * magnif * mult
				);
				parent_geometry.attributes.position.setY(
					i,
					verticei[1] + disp[gdl * 3 + 1] * magnif * mult
				);
				parent_geometry.attributes.position.setZ(
					i,
					verticei[2] + disp[gdl * 3 + 2] * magnif * mult
				);
			}
			const points = [];
			for (let i = 0; i < line_order.length; i++) {
				const gdl = prism[line_order[i]];
				const verticei = nodes[gdl];
				let vx = verticei[0] + disp[gdl * 3] * magnif * mult;
				let vy = verticei[1] + disp[gdl * 3 + 1] * magnif * mult;
				let vz = verticei[2] + disp[gdl * 3 + 2] * magnif * mult;
				points.push(new THREE.Vector3(vx, vy, vz));
			}
			const line_geo = new THREE.BufferGeometry().setFromPoints(points);
			lines.push(line_geo);
		}
		mergedLineGeometry.dispose();
		mergedLineGeometry = BufferGeometryUtils.mergeBufferGeometries(
			lines,
			false
		);
		mergedGeometry.dispose();
		mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			geometries,
			false
		);

		mesh.geometry = mergedGeometry;
		line.geometry = mergedLineGeometry;

		// line = new THREE.Line(mergedGeometry, line_material);

		renderer.render(scene, camera);
		// requestAnimationFrame(render);
	}
	window.addEventListener("resize", render);

	requestAnimationFrame(update);
}
fetch("./resources/exported.json")
	.then((response) => {
		return response.json();
	})
	.then((jsondata) => {
		nodes.push(...jsondata["nodes"]);
		prisms.push(...jsondata["dictionary"]);
		types.push(...jsondata["types"]);
		disps.push(...jsondata["disp_field"]);
		disp = disps[NODE];
		nvn = jsondata["nvn"];
		console.log(prisms.length, nodes.length);
		main();
	});
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	const keyCode = event.which;
	console.log(NODE);
	if (keyCode == 39) {
		nextMode();
	} else if (keyCode == 37) {
		prevMode();
	}
	disp = disps[NODE];
}
function nextMode() {
	NODE += 1 * (NODE < disps.length - 1);
}
function prevMode() {
	NODE -= 1 * (NODE > 0);
}
