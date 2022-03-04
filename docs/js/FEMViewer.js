import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OrbitControls } from "./OrbitControls.js";
import * as BufferGeometryUtils from "./BufferGeometryUtils.js";
import { AxisGridHelper } from "./minigui.js";

class Element {
	coords;
	gdls;
	Ue;
	geometry;
	constructor(coords, gdls) {
		this.coords = coords;
		this.gdls = gdls;
		this.Ue = [];
	}
	setUe(U) {
		this.Ue = [];
		for (const v of this.gdls) {
			const u = [];
			for (const d of v) {
				u.push(U[d]);
			}
			this.Ue.push(u);
		}
	}
	setGeometryCoords(Ue, mult, parent_geometry) {
		if (!Ue) {
			Ue = [];
			const a = Array(this.coords.length).fill(0.0);
			Ue.push(a);
			Ue.push(a);
			Ue.push(a);
		}

		if (!mult) {
			mult = 1.0;
		}

		if (!parent_geometry) {
			parent_geometry = this.geometry;
		}
		const count = parent_geometry.attributes.position.count;
		for (let i = 0; i < count; i++) {
			const node = this.order[i];
			const verticei = this.coords[node];
			parent_geometry.attributes.position.setX(
				i,
				verticei[0] + this.modifier[i][0] + Ue[0][node] * mult
			);
			parent_geometry.attributes.position.setY(
				i,
				verticei[1] + this.modifier[i][1] + Ue[1][node] * mult
			);
			parent_geometry.attributes.position.setZ(
				i,
				verticei[2] + this.modifier[i][2] + Ue[2][node] * mult
			);
		}
		parent_geometry.attributes.position.needsUpdate = true;
		parent_geometry.computeVertexNormals();
	}
}
class Element3D extends Element {
	constructor(coords, gdls) {
		super(coords, gdls);
	}
	isInside(x) {
		return false;
	}
}

class Brick extends Element3D {
	order;
	line_order;
	constructor(coords, gdls) {
		super(coords, gdls);
		this.geometry = new THREE.BoxGeometry(1);
		this.order = [
			6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5, 2, 3, 1,
			0,
		];
		this.line_order = [0, 1, 2, 3, 0, 4, 5, 1, 5, 6, 2, 6, 7, 3];
		this.modifier = [
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
		];
	}
	psi(_z) {
		z = _z[0];
		n = _z[1];
		g = _z[2];
		return [
			(1.0 / 8.0) * (1 - z) * (1 - n) * (1 - g),
			(1.0 / 8.0) * (1 + z) * (1 - n) * (1 - g),
			(1.0 / 8.0) * (1 + z) * (1 + n) * (1 - g),
			(1.0 / 8.0) * (1 - z) * (1 + n) * (1 - g),
			(1.0 / 8.0) * (1 - z) * (1 - n) * (1 + g),
			(1.0 / 8.0) * (1 + z) * (1 - n) * (1 + g),
			(1.0 / 8.0) * (1 + z) * (1 + n) * (1 + g),
			(1.0 / 8.0) * (1 - z) * (1 + n) * (1 + g),
		];
	}
	dpsi(_z) {
		x = _z[0];
		y = _z[1];
		z = _z[2];
		return [
			[
				(1.0 / 8.0) * (y - 1.0) * (1.0 - z),
				(1.0 / 8.0) * (x - 1) * (1 - z),
				-(1.0 / 8.0) * (1 - x) * (1 - y),
			],
			[
				(1.0 / 8.0) * (1 - y) * (1 - z),
				(1.0 / 8.0) * (-1 - x) * (1 - z),
				-(1.0 / 8.0) * (1 + x) * (1 - y),
			],
			[
				(1.0 / 8.0) * (1 + y) * (1 - z),
				(1.0 / 8.0) * (1 + x) * (1 - z),
				-(1.0 / 8.0) * (1 + x) * (1 + y),
			],
			[
				(1.0 / 8.0) * (-1.0 - y) * (1 - z),
				(1.0 / 8.0) * (1 - x) * (1 - z),
				-(1.0 / 8.0) * (1 - x) * (1 + y),
			],
			[
				(1.0 / 8.0) * (1 - y) * (-1 - z),
				-(1.0 / 8.0) * (1 - x) * (1 + z),
				(1.0 / 8.0) * (1 - x) * (1 - y),
			],
			[
				(1.0 / 8.0) * (1 - y) * (1 + z),
				-(1.0 / 8.0) * (1 + x) * (1 + z),
				(1.0 / 8.0) * (1 + x) * (1 - y),
			],
			[
				(1.0 / 8.0) * (1 + y) * (1 + z),
				(1.0 / 8.0) * (1 + x) * (1 + z),
				(1.0 / 8.0) * (1 + x) * (1 + y),
			],
			[
				-(1.0 / 8.0) * (1 + y) * (1 + z),
				(1.0 / 8.0) * (1 - x) * (1 + z),
				(1.0 / 8.0) * (1 - x) * (1 + y),
			],
		];
	}
}

class Tetrahedral extends Element3D {
	order;
	line_order;
	constructor(coords, gdls) {
		super(coords, gdls);
		this.geometry = new THREE.BoxGeometry(1);
		this.order = [
			6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5, 2, 3, 1,
			0,
		];
		this.line_order = [0, 1, 2, 3, 0, 4, 5, 1, 5, 6, 2, 6, 7, 3];
		this.modifier = [
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
		];
	}
	psi(_z) {
		return 0.0;
	}
	dpsi(_z) {
		return 0.0;
	}
}

class Lineal extends Element3D {
	order;
	line_order;
	constructor(coords, gdls, tama) {
		super(coords, gdls);
		this.geometry = new THREE.BoxGeometry(1);
		this.order = [
			1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0,
		];
		this.line_order = [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0];
		const h = tama / 10.0;
		this.modifier = [
			[0.0, h, h],
			[0.0, h, h],
			[0.0, h, 0.0],
			[0.0, h, 0.0],
			[0.0, 0.0, h],
			[0.0, 0.0, h],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, h],
			[0.0, h, h],
			[0.0, 0.0, h],
			[0.0, h, h],
			[0.0, 0.0, 0.0],
			[0.0, h, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, h, 0.0],
			[0.0, 0.0, h],
			[0.0, h, h],
			[0.0, 0.0, 0.0],
			[0.0, h, 0.0],
			[0.0, h, h],
			[0.0, 0.0, h],
			[0.0, h, 0.0],
			[0.0, 0.0, 0.0],
		];
	}
	psi(_z) {
		return 0.0;
	}
	dpsi(_z) {
		return 0.0;
	}
}

class Triangular extends Element3D {
	order;
	line_order;
	constructor(coords, gdls, tama) {
		super(coords, gdls);
		this.geometry = new THREE.BoxGeometry(1);
		this.order = [
			2, 2, 1, 1, 2, 2, 0, 0, 2, 2, 2, 2, 0, 1, 0, 1, 2, 2, 0, 1, 2, 2, 1,
			0,
		];
		this.line_order = [0, 1, 2, 2, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2];
		const h = tama / 20.0;
		const orderori = [
			6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5, 2, 3, 1,
			0,
		];
		this.modifier = [
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
		];
		for (let k = 0; k < this.modifier.length; k++) {
			if (orderori[k] > 3) {
				this.modifier[k][2] = h;
			}
		}
	}
	psi(_z) {
		return 0.0;
	}
	dpsi(_z) {
		return 0.0;
	}
}

class Quadrilateral extends Element3D {
	order;
	line_order;
	constructor(coords, gdls, tama) {
		super(coords, gdls);
		this.geometry = new THREE.BoxGeometry(1);
		this.order = [
			2, 2, 1, 1, 3, 3, 0, 0, 3, 2, 3, 2, 0, 1, 0, 1, 3, 2, 0, 1, 2, 3, 1,
			0,
		];
		this.line_order = [0, 1, 2, 3, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3];
		const h = tama / 20.0;
		const orderori = [
			6, 2, 5, 1, 3, 7, 0, 4, 3, 2, 7, 6, 4, 5, 0, 1, 7, 6, 4, 5, 2, 3, 1,
			0,
		];
		this.modifier = [
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0],
		];
		for (let k = 0; k < this.modifier.length; k++) {
			if (orderori[k] > 3) {
				this.modifier[k][2] = h;
			}
		}
	}
	psi(_z) {
		return 0.0;
	}
	dpsi(_z) {
		return 0.0;
	}
}

class TetrahedralO2 extends Tetrahedral {
	constructor(coords, gdls) {
		super(coords, gdls);
	}
	psi(z) {
		return 0.0;
	}
	dpsi(z) {
		return 0.0;
	}
}

class BrickO2 extends Brick {
	constructor(coords, gdls) {
		super(coords, gdls);
	}
	psi(z) {
		return 0.0;
	}
	dpsi(z) {
		return 0.0;
	}
}

class TriangularO2 extends Triangular {
	constructor(coords, gdls, tama) {
		super(coords, gdls, tama);
	}
	psi(z) {
		return 0.0;
	}
	dpsi(z) {
		return 0.0;
	}
}

class Serendipity extends Quadrilateral {
	constructor(coords, gdls, tama) {
		super(coords, gdls, tama);
	}
	psi(z) {
		return 0.0;
	}
	dpsi(z) {
		return 0.0;
	}
}

const types = {
	B1V: Brick,
	B2V: BrickO2,
	TE1V: Tetrahedral,
	TE2V: TetrahedralO2,
	L1V: Lineal,
	T1V: Triangular,
	T2V: TriangularO2,
	C1V: Quadrilateral,
	C2V: Serendipity,
};

class FEMViewer {
	json_path;
	nodes;
	nvn;
	dictionary;
	types;
	solutions;
	U;
	step;
	max_disp;
	size;
	elements;
	canvas;
	camera;
	scene;
	controls;
	constructor(canvas, magnif) {
		if (!magnif) {
			magnif = 100;
		}
		// FEM
		this.canvas = canvas;
		this.nodes = [];
		this.nvn = -1;
		this.dictionary = [];
		this.types = [];
		this.solutions = [];
		this.U = [];
		this.step = 0;
		this.max_disp = 0.0;
		this.size = 0.0;
		this.elements = [];

		// THREE JS
		this.renderer = new THREE.WebGLRenderer({ canvas });
		this.delta = 0;
		this.interval = 1 / 120;
		this.clock = new THREE.Clock();
		this.bufferGeometries = [];
		this.model = new THREE.Object3D();
		this.colors = false;
		this.animate = true;
		this.magnif = magnif;
		this.mult = 1.0;
		this.side = 1.0;
		this.max_disp = 0.0;

		this.gui = new GUI({ title: "Configuraciones" });
		this.settings();
	}

	async loadJSON(json_path) {
		this.json_path = json_path;
		const response = await fetch(this.json_path);
		const jsondata = await response.json();
		this.parseJSON(jsondata);
	}

	settings() {
		THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
		// Camera settings
		const fov = 40;
		const aspect = 2; // the canvas default
		const near = 0.01;
		const far = 200;
		this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.camera.position.set(25, 25, 25);
		this.camera.lookAt(0, 0, 0);

		// Scene settings
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(1, 1, 1);

		// Controls
		this.controls = new OrbitControls(this.camera, this.canvas);
		this.controls.target.set(0, 0, 0);
		this.controls.update();

		// Lights
		this.light2 = new THREE.AmbientLight(0xffffff, 0.0);
		const color = 0xffffff;
		const intensity = 1;
		this.light = new THREE.DirectionalLight(color, intensity);
		this.light.position.set(0, 0, 10);
		this.light.target.position.set(-5, 0, 0);
		this.scene.add(this.light);
		this.scene.add(this.light2);
		this.scene.add(this.light.target);

		// GUI
		this.gui
			.add(this.camera, "fov", 1, 180)
			.name("Camera FOV")
			.onChange(this.updateCamera.bind(this));

		// ESTO ES SOLO PARA DESPLAZAMIENTOS ESPECIFICAMENTE
		this.gui
			.add(this, "colors")
			.name("Draw Colors")
			.onChange(this.updateMaterial.bind(this));
		this.gui.add(this, "animate").name("Animation");
		this.gui.add(this, "magnif", 0, 1000).name("Disp multiplier");
	}
	updateCamera() {
		this.camera.updateProjectionMatrix();
	}

	updateMaterial() {
		if (this.colors) {
			this.material = new THREE.MeshPhongMaterial({
				flatShading: true,
				vertexColors: true,
			});
			this.light2.intensity = 1.0;
			this.light.intensity = 0.0;
		} else {
			this.material = new THREE.MeshPhongMaterial({
				color: "#c4bbfc",
				emissive: "blue",
				flatShading: true,
			});
			this.light2.intensity = 0.0;
			this.light.intensity = 1.0;
		}
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		this.delta += this.clock.getDelta();
		if (this.delta > this.interval) {
			// The draw or time dependent code are here
			this.render(this.delta);

			this.delta = this.delta % this.interval;
		}
	}

	resizeRendererToDisplaySize() {
		const canvas = this.renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width = (canvas.clientWidth * pixelRatio) | 0;
		const height = (canvas.clientHeight * pixelRatio) | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			this.renderer.setSize(width, height, false);
		}
		return needResize;
	}

	render(time) {
		if (typeof time == "number") {
			time = time || 0;
		} else {
			time = 0.0;
		}
		this.mult += time * this.side;
		if (this.mult > 1) {
			this.side = -1.0;
		} else if (this.mult < -1) {
			this.side = 1.0;
		}
		if (!this.animate) {
			this.mult = 1.0;
		}

		// Specific part of shit

		for (let i = 0; i < this.elements.length; i++) {
			const e = this.elements[i];
			const Ue = [];
			for (const ue of e.Ue) {
				Ue.push(ue);
			}
			for (let j = Ue.length; j < 3; j++) {
				Ue.push(Array(e.coords.length).fill(0.0));
			}

			e.setGeometryCoords(
				Ue,
				this.magnif * this.mult,
				this.bufferGeometries[i]
			);
			let max_disp_nodes = 0.0;
			for (const ue of e.Ue) {
				max_disp_nodes = Math.max(
					max_disp_nodes,
					...ue.map((x) => Math.abs(x * this.mult))
				);
			}

			const color = new THREE.Color();
			let amount = max_disp_nodes / this.max_disp;
			amount = Math.min(amount, 1.0);
			const hue = THREE.MathUtils.lerp(248 / 360, 184 / 360, amount);
			const saturation = 1.0;
			const lightness = 0.6;
			color.setHSL(hue, saturation, lightness);
			// get the colors as an array of values from 0 to 255
			const rgb = color.toArray().map((v) => v * 255);

			// make an array to store colors for each vertex
			const numVerts =
				this.bufferGeometries[i].getAttribute("position").count;
			const itemSize = 3; // r, g, b
			const colors = new Uint8Array(itemSize * numVerts);

			// copy the color into the colors array for each vertex
			colors.forEach((v, ndx) => {
				colors[ndx] = rgb[ndx % 3];
			});

			const normalized = true;
			const colorAttrib = new THREE.BufferAttribute(
				colors,
				itemSize,
				normalized
			);
			this.bufferGeometries[i].setAttribute("color", colorAttrib);
		}
		this.mergedGeometry.dispose();
		this.mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			this.bufferGeometries,
			false
		);
		this.mesh.geometry = this.mergedGeometry;
		this.mesh.material = this.material;
		this.mesh.material.needsUpdate = true;

		if (this.resizeRendererToDisplaySize()) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
		this.renderer.render(this.scene, this.camera);
	}

	zoomExtents() {
		let vFoV = this.camera.getEffectiveFOV();
		let hFoV = this.camera.fov * this.camera.aspect;

		let FoV = Math.min(vFoV, hFoV);
		let FoV2 = FoV / 2;

		let dir = new THREE.Vector3();
		this.camera.getWorldDirection(dir);

		let bb = this.mesh.geometry.boundingBox;
		let bs = this.mesh.geometry.boundingSphere;
		let bsWorld = bs.center.clone();
		this.mesh.localToWorld(bsWorld);

		let th = (FoV2 * Math.PI) / 180.0;
		let sina = Math.sin(th);
		let R = bs.radius;
		let FL = R / sina;

		let cameraDir = new THREE.Vector3();
		this.camera.getWorldDirection(cameraDir);

		let cameraOffs = cameraDir.clone();
		cameraOffs.multiplyScalar(-FL);
		let newCameraPos = bsWorld.clone().add(cameraOffs);

		this.camera.position.copy(newCameraPos);
		this.camera.lookAt(bsWorld);
		this.controls.target.copy(bsWorld);

		this.controls.update();
	}

	init() {
		this.mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			this.bufferGeometries,
			true
		);
		this.material = new THREE.MeshPhongMaterial({
			color: "#c4bbfc",
			emissive: "blue",
			flatShading: true,
		});
		this.mesh = new THREE.Mesh(this.mergedGeometry, this.material);
		this.model.add(this.mesh);
		new AxisGridHelper(this.model, 0);

		this.scene.add(this.model);
		this.renderer.render(this.scene, this.camera);
		this.zoomExtents();
		window.addEventListener("resize", this.render.bind(this));
		requestAnimationFrame(this.update.bind(this));
	}

	parseJSON(jsondata) {
		this.nodes.push(...jsondata["nodes"]);
		this.nvn = jsondata["nvn"];
		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = 0; j <= 3 - this.nodes[i].length; j++) {
				this.nodes[i].push(0.0); //Coordinate completition
			}
		}
		this.dictionary.push(...jsondata["dictionary"]);
		this.types.push(...jsondata["types"]);
		if (jsondata["disp_field"] == undefined) {
			this.solutions = [Array(this.nodes.length * nvn).fill(0.0)];
		} else {
			this.solutions.push(...jsondata["disp_field"]);
		}
		this.updateU();
		this.size =
			Math.max(...this.nodes.flat()) - Math.min(...this.nodes.flat());
		console.log(this.size);
		console.log(this.dictionary.length, this.nodes.length);
		this.createElements();
	}

	updateU() {
		this.U = this.solutions[this.step];
		this.max_disp = Math.max(...this.U);
		for (const e of this.elements) {
			e.setUe(this.U);
		}
	}

	nextSolution() {
		this.step += 1 * (this.step < this.solutions.length - 1);
		this.updateU();
	}
	prevSolution() {
		this.step -= 1 * (this.step > 0);
		this.updateU();
	}

	createElements() {
		this.elements = new Array(this.dictionary.length).fill(0.0);
		for (let i = 0; i < this.dictionary.length; i++) {
			const gdls = this.dictionary[i];
			const egdls = [];
			for (let i = 0; i < this.nvn; i++) {
				const a = [];
				for (const gdl of gdls) {
					a.push(gdl * this.nvn + i);
				}
				egdls.push(a);
			}
			const coords = [];
			for (const node of gdls) {
				coords.push(this.nodes[node]);
			}
			this.elements[i] = new types[this.types[i]](
				coords,
				egdls,
				this.size
			);
			this.elements[i].setUe(this.U);
			this.elements[i].setGeometryCoords();
			this.bufferGeometries.push(this.elements[i].geometry);
		}
	}
}
export { FEMViewer };
