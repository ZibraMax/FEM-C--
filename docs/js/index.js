import { FEMViewer } from "./FEMViewer.js";

let path_str = "SPHERE_FERNANDO";
let magnif = 100;
let queryString = window.location.search;
if (queryString != "") {
	queryString = queryString.split("?")[1];
	let parametros = new URLSearchParams(queryString);
	let funcion_param = parametros.get("mesh");
	let magnif_param = parametros.get("magnif");
	if (funcion_param) {
		path_str = funcion_param;
	}
	if (magnif_param) {
		magnif = parseFloat(magnif_param);
	}
}

const path = `./resources/${path_str}.json`;
const canvas = document.querySelector("#c");
const O = new FEMViewer(canvas, magnif);
await O.loadJSON(path);
O.magnif = magnif;
O.init();
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
