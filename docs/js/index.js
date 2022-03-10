import { FEMViewer } from "./FEMViewer.js";

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

const path = `./resources/${path_str}.json`;
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
