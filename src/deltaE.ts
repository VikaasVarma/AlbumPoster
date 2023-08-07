function degrees(radians: number): number {
	return (radians * 180) / Math.PI;
}

function radians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

function h_(b1: number, a1_: number): number {
	if (b1 === 0 && a1_ === 0) return 0;
	else {
		const h_ = degrees(Math.atan2(b1, a1_));
		if (h_ >= 0) return h_;
		else return h_ + 360;
	}
}

function dh_(h1: number, h2: number): number {
	if (Math.abs(h2 - h1) <= 180) return h2 - h1;
	else if (h2 - h1 > 180) return h2 - h1 - 360;
	else return h2 - h1 + 360;
}

function avg_H_(h1: number, h2: number) {
	if (Math.abs(h1 - h2) <= 180) return (h1 + h2) / 2.0;
	else if (Math.abs(h1 - h2) > 180 && h1 + h2 < 360)
		return (h1 + h2 + 360) / 2.0;
	else return (h1 + h2 - 360) / 2.0;
}

// http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
export default function deltaE(lab1: number[], lab2: number[]): number {
	const c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]);
	const c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);
	const avg_c1c2 = (c1 + c2) / 2.0;

	// (1/2) * (1 - sqrt((avg_c1c2^7) / (avg_c1c2^7 + 25^7))
	// prettier-ignore
	const G = 0.5 * (1 - Math.sqrt( Math.pow(avg_c1c2, 7.0) / (Math.pow(avg_c1c2, 7.0) + Math.pow(25.0, 7.0))));

	const a1_ = (1.0 + G) * lab1[1];
	const a2_ = (1.0 + G) * lab2[1];

	const c1_ = Math.sqrt(a1_ * a1_ + lab1[2] * lab1[2]);
	const c2_ = Math.sqrt(a2_ * a2_ + lab2[2] * lab2[2]);

	const h1_ = h_(lab1[2], a1_);
	const h2_ = h_(lab2[2], a2_);

	const dL_ = lab2[0] - lab1[0];
	const dC_ = c2_ - c1_;

	const dh = dh_(h1_, h2_); // (10)
	const dH_ = 2 * Math.sqrt(c1_ * c2_) * Math.sin(radians(dh) / 2.0); // (11)

	const avg_L = (lab1[0] + lab2[0]) / 2.0;
	const avg_C_ = (c1_ + c2_) / 2.0;

	const avg_H = avg_H_(h1_, h2_);
	const T =
		1 -
		0.17 * Math.cos(radians(avg_H - 30)) +
		0.24 * Math.cos(radians(2 * avg_H)) +
		0.32 * Math.cos(radians(3 * avg_H + 6)) -
		0.2 * Math.cos(radians(4 * avg_H - 63)); // (15)
	const dRo = 30 * Math.exp(-Math.pow((avg_H - 275) / 25, 2)); // (16)
	const RC = Math.sqrt(
		Math.pow(avg_C_, 7.0) / (Math.pow(avg_C_, 7.0) + Math.pow(25.0, 7.0))
	); // (17)
	const SL =
		1 +
		(0.015 * Math.pow(avg_L - 50, 2)) /
			Math.sqrt(20 + Math.pow(avg_L - 50, 2.0)); // (18)
	const SC = 1 + 0.045 * avg_C_; // (19)
	const SH = 1 + 0.015 * avg_C_ * T; // (20)
	const RT = -2 * RC * Math.sin(radians(2 * dRo)); // (21)
	const dE = Math.sqrt(
		Math.pow(dL_ / SL, 2) +
			Math.pow(dC_ / SC, 2) +
			Math.pow(dH_ / SH, 2) +
			RT * (dC_ / SC) * (dH_ / SH)
	); // (22)
	return dE;
}
