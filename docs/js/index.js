import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OBJLoader } from "./OBJLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as BufferGeometryUtils from "./BufferGeometryUtils.js";
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

class AxisGridHelper {
	constructor(node, units = 10) {
		const axes = new THREE.AxesHelper();
		axes.material.depthTest = false;
		axes.renderOrder = 2; // after the grid
		node.add(axes);

		const grid = new THREE.GridHelper(units, units);
		grid.material.depthTest = false;
		grid.renderOrder = 1;
		grid.rotateX(Math.PI / 2);
		node.add(grid);

		this.grid = grid;
		this.axes = axes;
		this.visible = true;
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
	function makeInstance(geometry, matProps) {
		const material = new THREE.MeshLambertMaterial(matProps);
		const mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}

	function bufferGeometry(geometry) {
		geometries.push(geometry);
	}

	THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

	// Conectar con el HTML
	const canvas = document.querySelector("#c");
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.shadowMap.enabled = true;

	// Configuración de la cámara
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const size = 10;
	const camera = new THREE.OrthographicCamera(
		(size * aspect) / -2,
		(size * aspect) / 2,
		size / -2,
		size / 2,
		1,
		100
	);
	camera.zoom = 3;
	camera.position.set(0, 0, 5);
	camera.up.set(0, 0, -1);
	camera.lookAt(0, 0, 0);
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color(1, 1, 1);

	const controls = new OrbitControls(camera, canvas);
	controls.addEventListener("change", render);
	controls.target.set(0, 0, 0);
	controls.update();

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
	const material = new THREE.MeshLambertMaterial({
		color: "red",
		emissive: "blue",
		wireframe: true,
	});
	const mesh = new THREE.Mesh(mergedGeometry, material);
	model.add(mesh);

	scene.add(model);
	makeAxisGrid(model, `Model grid`, 3);

	// Luz
	const skyColor = 0xffffff;
	const groundColor = 0x545454; // brownish orange
	const intensity = 1;
	const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
	scene.add(light);

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			const newAspect = canvas.clientWidth / canvas.clientHeight;

			camera.left = (size * newAspect) / -2;
			camera.right = (size * newAspect) / 2;
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
