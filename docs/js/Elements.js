import * as THREE from "../build/three.module.js";

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
	setGeometryCoords(Ue, mult, parent_geometry, line_geometry) {
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
		let count = parent_geometry.attributes.position.count;
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

		if (line_geometry) {
			count = line_geometry.attributes.position.count;
			for (let i = 0; i < count; i++) {
				const node = this.line_order[i];
				const verticei = this.coords[node];
				line_geometry.attributes.position.setX(
					i,
					verticei[0] + this.modifier[i][0] + Ue[0][node] * mult
				);
				line_geometry.attributes.position.setY(
					i,
					verticei[1] + this.modifier[i][1] + Ue[1][node] * mult
				);
				line_geometry.attributes.position.setZ(
					i,
					verticei[2] + this.modifier[i][2] + Ue[2][node] * mult
				);
			}
			line_geometry.attributes.position.needsUpdate = true;
			line_geometry.computeVertexNormals();
		}
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
		this.geometry = new THREE.TetrahedronGeometry(1);
		this.order = [1, 0, 2, 3, 2, 0, 3, 0, 1, 3, 1, 2];
		this.line_order = [0, 1, 2, 0, 3, 1, 3, 2];
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

export {
	Brick,
	BrickO2,
	Tetrahedral,
	TetrahedralO2,
	Lineal,
	Triangular,
	TriangularO2,
	Quadrilateral,
	Serendipity,
};
