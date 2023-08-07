const width = 500;
const height = 500;
const radius = width / 2 - 100;

// Function to create the canvas element and return the context
function createCanvas(): CanvasRenderingContext2D | null {
	const container = document.getElementById("capture");

	if (container === null) {
		console.error("Container not found");
		return null;
	}

	const skillWheel = document.createElement("div");
	skillWheel.classList.add("skill-wheel");
	skillWheel.id = "skill-wheel";

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	skillWheel.appendChild(canvas);
	container.appendChild(skillWheel);
	return canvas.getContext("2d");
}

function drawBackground(canvas: CanvasRenderingContext2D) {
	const [x, y] = [width / 2, height / 2];

	canvas.strokeStyle = "#888888";
	canvas.lineWidth = 2;
	canvas.globalAlpha = 0.5;

	for (let i = 0; i < 5; i++) {
		canvas.beginPath();
		canvas.arc(x, y, (radius * (i + 1)) / 5, 0, 2 * Math.PI);
		canvas.stroke();
	}

	for (let i = 0; i < 10; i++) {
		canvas.beginPath();
		const angle = (i * 2 * Math.PI) / 10 - Math.PI / 2;
		const px1 = x + (radius / 5) * Math.cos(angle);
		const py1 = y + (radius / 5) * Math.sin(angle);
		const px2 = x + radius * Math.cos(angle);
		const py2 = y + radius * Math.sin(angle);
		canvas.moveTo(px1, py1);
		canvas.lineTo(px2, py2);
		canvas.stroke();
	}

	// for (let i = 0; i < 5; i++) {
	// 	const r = (radius * (i + 1)) / 5;
	// 	canvas.beginPath();
	// 	for (let j = 0; j <= 5; j++) {
	// 		const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
	// 		const px = x + r * Math.cos(angle);
	// 		const py = y + r * Math.sin(angle);

	// 		if (j === 0) {
	// 			canvas.moveTo(px, py);
	// 		} else {
	// 			canvas.lineTo(px, py);
	// 		}
	// 	}
	// 	canvas.stroke();
	// }
}

async function drawLabels(canvas: CanvasRenderingContext2D) {
	const [x, y] = [width / 2, height / 2];
	// Wait for font to be loaded
	const font = new FontFace("grotesk", "url(/grotesk.ttf)", {
		weight: "700",
	});
	await font.load();

	canvas.font = "20px grotesk";
	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.fillStyle = "#000000";

	// @ts-ignore
	canvas.letterSpacing = "5px";

	const labels = [
		"Danceability",
		"Energy",
		"           Happiness",
		"Instrumentalness   ",
		"Tempo",
	];

	const offsets = [18, 50, 45, 45, 45];

	canvas.beginPath();
	for (let i = 0; i < 5; i++) {
		const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
		const px = x + (radius + offsets[i]) * Math.cos(angle);
		const py = y + (radius + offsets[i]) * Math.sin(angle);

		canvas.fillText(labels[i], px, py);
	}
}

function drawPentagon(
	canvas: CanvasRenderingContext2D,
	dists: number[],
	colors: string[],
	x: number,
	y: number,
	reverse: boolean = false
) {
	dists = dists.map((d) => Math.max(0.05, Math.min(1, d)));

	// for (let i = 0; i <= 5; i++) {
	// 	const j = reverse ? 5 - i : i;
	// 	const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
	// 	const px = x + dists[j % 5] * radius * Math.cos(angle);
	// 	const py = y + dists[j % 5] * radius * Math.sin(angle);

	// 	if ((!reverse && j === 0) || (reverse && j === 5)) {
	// 		canvas.moveTo(px, py);
	// 	} else {
	// 		canvas.lineTo(px, py);
	// 	}
	// }
	for (let i = 0; i < 5; i++) {
		const j = reverse ? 5 - i : i;

		const angle1 = (j * 2 * Math.PI) / 5 - Math.PI / 2;
		const angle2 = ((j + 1) * 2 * Math.PI) / 5 - Math.PI / 2;

		const px2 = x + dists[j % 5] * radius * Math.cos(angle1);
		const py2 = y + dists[j % 5] * radius * Math.sin(angle1);

		const px3 = x + dists[(j + 1) % 5] * radius * Math.cos(angle2);
		const py3 = y + dists[(j + 1) % 5] * radius * Math.sin(angle2);

		canvas.beginPath();
		canvas.moveTo(x, y);
		canvas.lineTo(px2, py2);
		canvas.lineTo(px3, py3);
		canvas.closePath();
		canvas.fillStyle = colors[j];
		canvas.fill();
	}
}

function drawSkills(
	canvas: CanvasRenderingContext2D,
	skill_mean: number[],
	skill_variance: number[],
	colors: string[]
) {
	const [x, y] = [width / 2, height / 2];

	canvas.strokeStyle = "#000000";
	canvas.fillStyle = "#FF0000";
	canvas.globalAlpha = 0.5;

	canvas.beginPath();
	// drawPentagon(canvas, skill_mean, x, y);

	canvas.beginPath();
	canvas.shadowOffsetX = 2;
	canvas.shadowOffsetY = 2;
	canvas.shadowColor = "#000000";
	canvas.shadowBlur = 5;
	drawPentagon(
		canvas,
		skill_mean.map((x, i) => x + skill_variance[i]),
		["#000000", "#000000", "#000000", "#000000", "#000000"],
		x,
		y
	);

	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur = 0;
	canvas.beginPath();
	drawPentagon(
		canvas,
		skill_mean.map((x, i) => x + skill_variance[i]),
		colors,
		x,
		y
	);

	canvas.globalAlpha = 1;
}

export default function createSkillWheel(colors: string[], skill_means: number[]) {
	document.getElementById("skill-wheel")?.remove();
	const canvas = createCanvas();

	if (canvas === null) {
		console.error("Error creating canvas context.");
		return;
	}

	// Inflate skill means to take up more space
	skill_means = skill_means.map((x) => Math.pow(x, 0.33));

	drawBackground(canvas);
	drawLabels(canvas);
	drawSkills(canvas, skill_means, [0, 0, 0, 0, 0], colors);
}
