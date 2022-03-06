import * as THREE from "../build/three.module.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm";
import { OrbitControls } from "./OrbitControls.js";
import * as BufferGeometryUtils from "./BufferGeometryUtils.js";
import { AxisGridHelper } from "./minigui.js";
import {
	Brick,
	BrickO2,
	Tetrahedral,
	TetrahedralO2,
	Lineal,
	Triangular,
	TriangularO2,
	Quadrilateral,
	Serendipity,
} from "./Elements.js";

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

const functions = {
	MAX: (x) => Math.max(...x),
	MIN: (x) => Math.min(...x),
	AVE: (x) => x.reduce((a, b) => a + b, 0) / x.length,
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
		this.calculateStress = false;
		this.C = Array(6).fill(Array(6).fill(0.0));
		// THREE JS
		this.renderer = new THREE.WebGLRenderer({ canvas });
		this.renderer.localClippingEnabled = true;
		this.delta = 0;
		this.interval = 1 / 120;
		this.clock = new THREE.Clock();
		this.bufferGeometries = [];
		this.bufferLines = [];
		this.model = new THREE.Object3D();
		this.colors = false;
		this.animate = true;
		this.magnif = magnif;
		this.mult = 1.0;
		this.side = 1.0;
		this.max_disp = 0.0;
		this.draw_lines = false;

		this.mode = "MAX";
		this.colorMode = "DISP";
		this.secondVariable = 0;

		this.gui = new GUI({ title: "Configuraciones" });
		this.first_color = [78 / 255, 51 / 255, 255 / 255];
		//248 / 360, 184 / 360
		this.second_color = [255 / 255, 51 / 255, 51 / 255];
		this.settings();
	}

	defineElasticityTensor(C) {
		this.calculateStress = true;
		this.C = C;
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
		this.gui
			.add(this, "draw_lines")
			.onChange(this.updateLines.bind(this))
			.name("Draw lines");

		// ESTO ES SOLO PARA DESPLAZAMIENTOS ESPECIFICAMENTE
		this.gui
			.add(this, "colors")
			.name("Draw Colors")
			.onChange(this.updateMaterial.bind(this));
		this.gui
			.add(this, "mode", { Max: "MAX", Min: "MIN", Average: "AVE" })
			.name("Color mode");
		this.gui
			.add(this, "colorMode", {
				Displacements: "DISP",
				Stress: "STRESS",
				Strain: "STRAIN",
			})
			.onChange(this.updateColorVariable.bind(this))
			.name("Color variable");
		this.gui
			.add(this, "secondVariable", {
				11: 0,
				22: 1,
				33: 2,
				12: 3,
				13: 4,
				23: 5,
			})
			.onChange(this.updateColorVariable.bind(this))
			.name("Second variable");

		this.gui.addColor(this, "first_color");
		this.gui.addColor(this, "second_color");
		this.gui.add(this, "animate").name("Animation");
		this.gui.add(this, "magnif", 0, 1000).name("Disp multiplier");
	}
	updateColorVariable() {
		this.max_disp = 0.0;
		if (this.colorMode == "DISP") {
			this.max_disp = Math.max(...this.U);
		} else if (this.colorMode == "STRESS") {
			for (const e of this.elements) {
				const variable = e.sigmas[this.secondVariable].map((x) =>
					Math.abs(x)
				);

				this.max_disp = Math.max(this.max_disp, ...variable);
			}
		} else if (this.colorMode == "STRAIN") {
			for (const e of this.elements) {
				const variable = e.epsilons[this.secondVariable].map((x) =>
					Math.abs(x)
				);
				this.max_disp = Math.max(this.max_disp, ...variable);
			}
		}
		console.log("AAAAAA", this.max_disp);
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

	handleVisibilityChange(e) {
		if (document.visibilityState === "hidden") {
			this.clock.stop();
		} else {
			this.clock.start();
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

		// console.log(this.mult);

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

			if (this.draw_lines) {
				e.setGeometryCoords(
					Ue,
					this.magnif * this.mult,
					this.bufferGeometries[i],
					this.bufferLines[i]
				);
			} else {
				e.setGeometryCoords(
					Ue,
					this.magnif * this.mult,
					this.bufferGeometries[i]
				);
			}

			if (this.colors) {
				let max_disp_nodes = 0.0;
				let variable = e.Ue;
				if (this.colorMode == "STRESS") {
					variable = e.sigmas;
				} else if (this.colorMode == "STRAIN") {
					variable = e.epsilons;
				}
				if (this.colorMode == "DISP") {
					for (const ue of e.Ue) {
						max_disp_nodes = Math.max(max_disp_nodes, ...ue);
					}
				} else {
					max_disp_nodes = functions[this.mode](
						variable[this.secondVariable].map((x) => x * this.mult)
					);
				}

				const color = new THREE.Color();
				const color1 = new THREE.Color(...this.first_color);
				const color2 = new THREE.Color(...this.second_color);
				const c1 = {};
				color1.getHSL(c1);
				const c2 = {};
				color2.getHSL(c2);
				let amount = max_disp_nodes / this.max_disp;
				const hue = THREE.MathUtils.lerp(c1.h, c2.h, amount);
				const saturation = THREE.MathUtils.lerp(c1.s, c2.s, amount);
				const lightness = THREE.MathUtils.lerp(c1.l, c2.l, amount);
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
		}

		this.mergedGeometry.dispose();
		this.mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			this.bufferGeometries,
			false
		);
		this.mesh.geometry = this.mergedGeometry;
		this.mesh.material = this.material;
		this.mesh.material.needsUpdate = true;

		if (this.draw_lines) {
			this.mergedLineGeometry.dispose();
			this.mergedLineGeometry = BufferGeometryUtils.mergeBufferGeometries(
				this.bufferLines,
				false
			);
			this.contour.geometry = this.mergedLineGeometry;
		}

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

	updateLines() {
		if (this.draw_lines) {
			this.model.add(this.contour);
		} else {
			this.model.remove(this.contour);
		}
	}

	init() {
		this.createElements();
		this.createLines();
		this.updateU();
		this.mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			this.bufferGeometries,
			true
		);
		this.updateMaterial();
		const line_material = new THREE.LineBasicMaterial({
			color: "black",
			linewidth: 3,
		});
		this.mergedLineGeometry = BufferGeometryUtils.mergeBufferGeometries(
			this.bufferLines,
			true
		);
		this.contour = new THREE.Line(this.mergedLineGeometry, line_material);
		// this.model.add(this.contour);

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
		const norm = 1.0 / Math.max(...jsondata["nodes"].flat());
		// console.log(norm);
		this.nodes.push(...jsondata["nodes"]);

		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			for (let j = 0; j < node.length; j++) {
				this.nodes[i][j] *= norm;
			}
		}
		this.nvn = jsondata["nvn"];
		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = this.nodes[i].length; j < 3; j++) {
				this.nodes[i].push(0.0); //Coordinate completition
			}
		}
		this.dictionary.push(...jsondata["dictionary"]);
		this.types.push(...jsondata["types"]);
		if (jsondata["disp_field"] == undefined) {
			this.solutions = [Array(this.nodes.length * this.nvn).fill(0.0)];
		} else {
			this.solutions.push(...jsondata["disp_field"]);
		}
		for (let s = 0; s < this.solutions.length; s++) {
			for (let i = 0; i < this.solutions[s].length; i++) {
				this.solutions[s][i] *= norm;
			}
		}

		const secon_coords = this.nodes[0].map((_, colIndex) =>
			this.nodes.map((row) => row[colIndex])
		);

		let sizex =
			Math.max(...secon_coords[0].flat()) -
			Math.min(...secon_coords[0].flat());
		let sizey =
			Math.max(...secon_coords[1].flat()) -
			Math.min(...secon_coords[1].flat());
		let sizez =
			Math.max(...secon_coords[2].flat()) -
			Math.min(...secon_coords[2].flat());
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i][0] -= sizex / 2;
			this.nodes[i][1] -= sizey / 2;
			this.nodes[i][2] -= sizez / 2;
		}
		this.size =
			Math.max(...this.nodes.flat()) - Math.min(...this.nodes.flat());
	}

	updateU() {
		this.U = this.solutions[this.step];
		this.updateColorVariable();
		for (const e of this.elements) {
			e.setUe(this.U, this.calculateStress);
			if (this.calculateStress) {
				e.postProcess(this.C, this.calculateStress);
			}
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
			this.bufferGeometries.push(this.elements[i].geometry);
		}
	}
	createLines() {
		for (const e of this.elements) {
			const points = [];
			const count = e.line_order.length;
			for (let j = 0; j < count; j++) {
				const node = e.line_order[j];
				const verticei = e.coords[node];
				points.push(new THREE.Vector3(...verticei));
			}
			const line_geo = new THREE.BufferGeometry().setFromPoints(points);
			this.bufferLines.push(line_geo);
		}
	}
}
export { FEMViewer };
