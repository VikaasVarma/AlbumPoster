import skmeans from "skmeans";
// import deltaE from "./deltaE";

function rgbToHex(rgb: Uint8ClampedArray): string {
	const r = rgb[0].toString(16).padStart(2, "0");
	const g = rgb[1].toString(16).padStart(2, "0");
	const b = rgb[2].toString(16).padStart(2, "0");
	return `#${r}${g}${b}`;
}

const [CX10, CY10, CZ10] = [0.97285, 1, 1.16145];

function rgbToLab(img: Uint8ClampedArray): Float32Array {
	let lab = new Float32Array(img.length);
	for (let i = 0; i < img.length; i += 3) {
		let [r, g, b] = img.slice(i, i + 3);
		let X, Y, Z;
		r /= 255;
		g /= 255;
		b /= 255;

		r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

		X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / CX10;
		Y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / CY10;
		Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / CZ10;

		X = X > 0.008856 ? Math.pow(X, 1 / 3) : 7.787 * X + 16 / 116;
		Y = Y > 0.008856 ? Math.pow(Y, 1 / 3) : 7.787 * Y + 16 / 116;
		Z = Z > 0.008856 ? Math.pow(Z, 1 / 3) : 7.787 * Z + 16 / 116;

		lab[i] = 116 * Y - 16;
		lab[i + 1] = 500 * (X - Y);
		lab[i + 2] = 200 * (Y - Z);
	}
	return lab;
}

function labToRgb(lab: Float32Array): Uint8ClampedArray {
	let rgb = new Uint8ClampedArray(lab.length);

	for (let i = 0; i < lab.length; i += 3) {
		let [L, A, B] = lab.slice(i, i + 3);
		let X, Y, Z, r, g, b;

		Y = (L + 16) / 116;
		X = A / 500 + Y;
		Z = Y - B / 200;

		X = CX10 * (X * X * X > 0.008856 ? X * X * X : (X - 16 / 116) / 7.787);
		Y = CY10 * (Y * Y * Y > 0.008856 ? Y * Y * Y : (Y - 16 / 116) / 7.787);
		Z = CZ10 * (Z * Z * Z > 0.008856 ? Z * Z * Z : (Z - 16 / 116) / 7.787);

		r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
		g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
		b = X * 0.0557 + Y * -0.204 + Z * 1.057;

		r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
		g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
		b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

		rgb[i] = Math.max(0, Math.min(1, r)) * 255;
		rgb[i + 1] = Math.max(0, Math.min(1, g)) * 255;
		rgb[i + 2] = Math.max(0, Math.min(1, b)) * 255;
	}
	return rgb;
}

function toArray<T extends number>(arr: ArrayLike<T>, rows: number, columns: number): T[][] {
	const reshaped = [];

	for (let i = 0; i < rows; i++) {
		const row = [];
		for (let j = 0; j < columns; j++) {
			row.push(arr[i * columns + j]);
		}
		reshaped.push(row);
	}
	return reshaped;
}

function toFloat32Array(arr: ArrayLike<number>): Float32Array {
	const float32 = new Float32Array(arr.length);
	for (let i = 0; i < arr.length; i++) {
		float32[i] = arr[i];
	}
	return float32;
}

function getImageData(img: HTMLImageElement): Promise<Uint8ClampedArray> {
	function _getImageData(_img: HTMLImageElement): Uint8ClampedArray {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		canvas.width = _img.width;
		canvas.height = _img.height;

		// Ensure that the image is not too large
		ctx.drawImage(_img, 0, 0, Math.min(_img.width, 512), Math.min(_img.height, 512));

		const rgba = ctx.getImageData(0, 0, _img.width, _img.height).data;
		const rgb = new Uint8ClampedArray(Math.floor(rgba.length / 4) * 3);

		let j = 0;
		for (let i = 0; i < rgba.length; i += 4) {
			rgb[j] = rgba[i];
			rgb[j + 1] = rgba[i + 1];
			rgb[j + 2] = rgba[i + 2];
			j += 3;
		}

		return rgb;
	}

	if (img.complete && img.naturalWidth !== 0) {
		return new Promise((resolve) => {
			resolve(_getImageData(img));
		});
	}
	return new Promise((resolve) => {
		img.onload = () => {
			resolve(_getImageData(img));
		};
	});
}

// function Ln_Norm(n: number, a: number[], b: number[]): number {
// 	let total = 0;
// 	for (let i = 0; i < a.length; i++) {
// 		total += Math.pow(Math.abs(a[i] - b[i]), n);
// 	}
// 	return Math.pow(total, 1 / n);
// }

export default async function getColors(): Promise<string[]> {
	const img = document.getElementById("album-cover") as HTMLImageElement;
	const rgb = await getImageData(img);
	const lab = rgbToLab(rgb);

	const reshaped = toArray(lab, lab.length / 3, 3);
	const clusters = skmeans(reshaped, 5, "kmpp");
	const centroids = clusters.centroids.map(toFloat32Array);
	return centroids.map(labToRgb).map(rgbToHex);
}
