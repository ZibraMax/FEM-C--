import { FEMViewer } from "./FEMViewer.js";
import { Brick } from "./Elements.js";

let path_str = "SPHERE_FERNANDO";
let magnif = 100;
let Cs;
let queryString = window.location.search;
if (queryString != "") {
	queryString = queryString.split("?")[1];
	let parametros = new URLSearchParams(queryString);
	let funcion_param = parametros.get("mesh");
	let magnif_param = parametros.get("magnif");
	let cs = parametros.get("c");
	if (funcion_param) {
		path_str = funcion_param;
	}
	if (magnif_param) {
		magnif = parseFloat(magnif_param);
	}
	if (cs) {
		Cs = cs.split(",").map((x) => parseFloat(x));
	}
}
let path = `./resources/${path_str}.json`;
if (path_str.startsWith("https://")) {
	path = path_str;
}
const canvas = document.querySelector("#c");
const O = new FEMViewer(canvas, magnif);
await O.loadJSON(path);
if (Cs) {
	const c11 = Cs[0]; //223.1;
	const c12 = Cs[1]; //63.9;
	const c44 = Cs[2]; //79.6;
	const C = [
		[c11, c12, c12, 0, 0, 0],
		[c12, c11, c12, 0, 0, 0],
		[c12, c12, c11, 0, 0, 0],
		[0, 0, 0, c44, 0, 0],
		[0, 0, 0, 0, c44, 0],
		[0, 0, 0, 0, 0, c44],
	];
	O.defineElasticityTensor(C);
}
O.init();
document.addEventListener("visibilitychange", (e) =>
	O.handleVisibilityChange(e)
);
const nodoTexto = document.getElementById("textNodo");
function onDocumentKeyDown(event) {
	const keyCode = event.which;
	if (keyCode == 39) {
		O.nextSolution();
		nodoTexto.innerHTML = `Solución ${O.step + 1}`;
	} else if (keyCode == 37) {
		O.prevSolution();
		nodoTexto.innerHTML = `Solución ${O.step + 1}`;
	}
}
document.addEventListener("keydown", onDocumentKeyDown, false);
const bl = document.getElementById("bl");
const br = document.getElementById("br");
bl.addEventListener(
	"click",
	() => {
		O.prevSolution();
		nodoTexto.innerHTML = `Solución ${O.step + 1}`;
	},
	false
);
br.addEventListener(
	"click",
	() => {
		O.nextSolution();
		nodoTexto.innerHTML = `Solución ${O.step + 1}`;
	},
	false
);
canvas.addEventListener("mousedown", O.onDocumentMouseDown.bind(O));
import * as THREE from "../build/three.module.js";

const geo = new THREE.BoxGeometry(1);
geo.scale(2, 2, 2);
const b = new Brick(
	[
		[-1.0, -1.0, -1.0],
		[1.0, -1.0, -1.0],
		[1.0, 1.0, -1.0],
		[-1.0, 1.0, -1.0],
		[-1.0, -1.0, 1.0],
		[1.0, -1.0, 1.0],
		[1.0, 1.0, 1.0],
		[-1.0, 1.0, 1.0],
	],
	[
		[-1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1],
	]
);
const a = [];
for (let i = 0; i < geo.attributes.position.array.length; i += 3) {
	const x = geo.attributes.position.array[i];
	const y = geo.attributes.position.array[i + 1];
	const z = geo.attributes.position.array[i + 2];
	const real = [x, y, z];
	for (let j = 0; j < b.coords.length; j++) {
		const coord = b.coords[j];
		const test = math.add(coord, math.multiply(real, -1));
		if (math.sum(math.abs(test)) < 0.1) {
			console.log(i, j, test);
			a.push(j);
		}
	}
	// geo.attributes.position.setXYZ(0, ...[2, 3, 4]);
	// geo.attributes.position.setXYZ(1, ...[2, 3, 4]);
	// geo.attributes.position.setXYZ(1, ...[2, 3, 4]);
}
console.log(geo, geo.attributes.position.count);
console.log(a);
