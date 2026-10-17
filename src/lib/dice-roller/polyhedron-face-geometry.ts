/**
 * Shared math for CSS-3D polyhedral dice (D8/D10/D12).
 *
 * Model: polyhedron centered at origin in CSS space (x right, y down,
 * z toward viewer). Each face is described by its 3D corner points; this
 * module derives everything the DOM needs:
 * - face plane transform `rotateY(az) rotateX(el) rotateZ(spin) translateZ(d)`
 * - clip-path polygon + container box + margins (face-local 2D projection)
 * - landing pose (rx, ry) that brings the face normal onto the view axis;
 *   `spin` is chosen so the landed face reads upright on screen.
 */

import type { CSSProperties } from "react";

import type { DiceRotation } from "@/types/dice-roller";

import { DICE_CIRCUMRADIUS_PX } from "@/lib/dice-roller/roll-a-dice-classes";

export type Vec3 = readonly [number, number, number];

export type PolyhedronFaceSpec = {
	/** Die value shown on this face. */
	value: number;
	/** Face corners in 3D px, any winding order. */
	vertices: readonly Vec3[];
};

export type PolyhedronFaceRender = {
	value: number;
	normal: Vec3;
	faceStyle: CSSProperties;
	numberStyle: CSSProperties;
	landing: DiceRotation;
};

const DEG_PER_RAD = 180 / Math.PI;

export { DICE_CIRCUMRADIUS_PX };

/**
 * Uniformly scales face specs so the circumradius equals `radius`.
 */
export const normalizeFaceSpecs = (
	specs: readonly PolyhedronFaceSpec[],
	radius: number = DICE_CIRCUMRADIUS_PX,
): PolyhedronFaceSpec[] => {
	const maxDistance = Math.max(
		...specs.flatMap((spec) => spec.vertices.map((v) => Math.hypot(...v))),
	);
	const factor = radius / maxDistance;
	return specs.map((spec) => ({
		value: spec.value,
		vertices: spec.vertices.map(
			(v): Vec3 => [v[0] * factor, v[1] * factor, v[2] * factor],
		),
	}));
};

const dot = (a: Vec3, b: Vec3): number =>
	a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0],
];

const subtract = (a: Vec3, b: Vec3): Vec3 => [
	a[0] - b[0],
	a[1] - b[1],
	a[2] - b[2],
];

const scaleVec = (v: Vec3, k: number): Vec3 => [v[0] * k, v[1] * k, v[2] * k];

const addVec = (a: Vec3, b: Vec3): Vec3 => [
	a[0] + b[0],
	a[1] + b[1],
	a[2] + b[2],
];

const normalize = (v: Vec3): Vec3 => scaleVec(v, 1 / Math.hypot(...v));

const rotateAroundXRad = (rad: number, v: Vec3): Vec3 => [
	v[0],
	v[1] * Math.cos(rad) - v[2] * Math.sin(rad),
	v[1] * Math.sin(rad) + v[2] * Math.cos(rad),
];

const rotateAroundYRad = (rad: number, v: Vec3): Vec3 => [
	v[0] * Math.cos(rad) + v[2] * Math.sin(rad),
	v[1],
	-v[0] * Math.sin(rad) + v[2] * Math.cos(rad),
];

/** Applies the cube transform `rotateY(ry) rotateX(rx)` to a vector. */
export const applyDiceRotation = (rotation: DiceRotation, v: Vec3): Vec3 =>
	rotateAroundYRad(
		rotation.ry / DEG_PER_RAD,
		rotateAroundXRad(rotation.rx / DEG_PER_RAD, v),
	);

/** Unit normal pointing away from the polyhedron center. */
export const computeOutwardNormal = (vertices: readonly Vec3[]): Vec3 => {
	const raw = cross(
		subtract(vertices[1]!, vertices[0]!),
		subtract(vertices[2]!, vertices[0]!),
	);
	const centroid = scaleVec(
		vertices.reduce(addVec, [0, 0, 0]),
		1 / vertices.length,
	);
	const normal = normalize(raw);
	return dot(normal, centroid) < 0 ? scaleVec(normal, -1) : normal;
};

const round = (value: number): number => Math.round(value * 10000) / 10000;

/** Cube rotation (rotateY(ry) rotateX(rx)) that brings this face toward the viewer. */
export const computeFaceLanding = (vertices: readonly Vec3[]): DiceRotation => {
	const normal = computeOutwardNormal(vertices);
	return {
		rx: round(Math.atan2(normal[1], normal[2]) * DEG_PER_RAD),
		ry: round(
			Math.atan2(-normal[0], Math.hypot(normal[1], normal[2])) *
				DEG_PER_RAD,
		),
	};
};

/** In-plane Z spin (radians) so the face value reads upright after `landing`. */
export const computeFaceUprightSpinRad = (
	vertices: readonly Vec3[],
): number => {
	const normal = computeOutwardNormal(vertices);
	const landing = computeFaceLanding(vertices);
	const elevationRad = Math.asin(Math.max(-1, Math.min(1, -normal[1])));
	const azimuthRad = Math.atan2(normal[0], normal[2]);
	const xAxis = rotateAroundYRad(
		azimuthRad,
		rotateAroundXRad(elevationRad, [1, 0, 0]),
	);
	const landedX = applyDiceRotation(landing, xAxis);
	return -Math.atan2(landedX[1], landedX[0]);
};

/** Upright in-plane axes for face UV / clip-path (CSS space). */
export const computeFaceUprightAxes = (
	vertices: readonly Vec3[],
): { uAxis: Vec3; vAxis: Vec3 } => {
	const normal = computeOutwardNormal(vertices);
	const elevationRad = Math.asin(Math.max(-1, Math.min(1, -normal[1])));
	const azimuthRad = Math.atan2(normal[0], normal[2]);
	const xAxis = rotateAroundYRad(
		azimuthRad,
		rotateAroundXRad(elevationRad, [1, 0, 0]),
	);
	const yAxis = rotateAroundYRad(
		azimuthRad,
		rotateAroundXRad(elevationRad, [0, 1, 0]),
	);
	const spinRad = computeFaceUprightSpinRad(vertices);
	return {
		uAxis: addVec(
			scaleVec(xAxis, Math.cos(spinRad)),
			scaleVec(yAxis, Math.sin(spinRad)),
		),
		vAxis: addVec(
			scaleVec(xAxis, -Math.sin(spinRad)),
			scaleVec(yAxis, Math.cos(spinRad)),
		),
	};
};

/** Fixed light from top-left-front; brightness baked per face. */
const LIGHT_DIRECTION = normalize([-0.45, -0.7, 0.55]);

const buildFaceBackground = (normal: Vec3): string => {
	const luminance = (dot(normal, LIGHT_DIRECTION) + 1) / 2;
	const lightness = 40 + luminance * 18;
	const stop = (delta: number): string =>
		`hsl(19 100% ${(lightness + delta).toFixed(1)}%)`;
	return `linear-gradient(160deg, ${stop(9)} 0%, ${stop(0)} 52%, ${stop(-7)} 100%)`;
};

const percent = (value: number, total: number): string =>
	`${round((value / total) * 100)}%`;

// No backface-visibility:hidden - Chromium intermittently culls front faces
// mid-animation (holes in the solid); preserve-3d depth sorting hides backfaces.
export const POLY_FACE_BASE_CLASS = "absolute left-1/2 top-1/2";

export const POLY_FACE_NUMBER_CLASS =
	"absolute -translate-x-1/2 -translate-y-1/2 font-extrabold leading-none text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]";

export const buildPolyhedronFaces = (
	specs: readonly PolyhedronFaceSpec[],
): PolyhedronFaceRender[] =>
	specs.map((spec) => {
		const normal = computeOutwardNormal(spec.vertices);
		const planeDistance = dot(normal, spec.vertices[0]!);
		const landing = computeFaceLanding(spec.vertices);
		const elevationRad = Math.asin(Math.max(-1, Math.min(1, -normal[1])));
		const azimuthRad = Math.atan2(normal[0], normal[2]);
		const spinRad = computeFaceUprightSpinRad(spec.vertices);
		const { uAxis: spunX, vAxis: spunY } = computeFaceUprightAxes(
			spec.vertices,
		);

		const points2d = spec.vertices.map((v): readonly [number, number] => [
			dot(v, spunX),
			dot(v, spunY),
		]);
		const xs = points2d.map((p) => p[0]);
		const ys = points2d.map((p) => p[1]);
		const minX = Math.min(...xs);
		const minY = Math.min(...ys);
		const width = Math.max(...xs) - minX;
		const height = Math.max(...ys) - minY;

		const clipPath = `polygon(${points2d
			.map(
				([x, y]) =>
					`${percent(x - minX, width)} ${percent(y - minY, height)}`,
			)
			.join(", ")})`;

		const centroidX = xs.reduce((s, v) => s + v, 0) / xs.length;
		const centroidY = ys.reduce((s, v) => s + v, 0) / ys.length;

		const transform = `rotateY(${round(azimuthRad * DEG_PER_RAD)}deg) rotateX(${round(
			elevationRad * DEG_PER_RAD,
		)}deg) rotateZ(${round(spinRad * DEG_PER_RAD)}deg) translateZ(${round(planeDistance)}px)`;

		return {
			value: spec.value,
			normal,
			landing,
			faceStyle: {
				width: round(width),
				height: round(height),
				marginLeft: round(minX),
				marginTop: round(minY),
				transformOrigin: `${round(-minX)}px ${round(-minY)}px`,
				clipPath,
				background: buildFaceBackground(normal),
				transform,
			},
			numberStyle: {
				left: percent(centroidX - minX, width),
				top: percent(centroidY - minY, height),
				// Scale digits with face size (D6 faces are much larger than D20).
				fontSize: Math.round(
					Math.max(24, Math.min(width, height) * 0.3),
				),
			},
		};
	});

export const buildPolyOrientation = (
	faces: readonly PolyhedronFaceRender[],
): Record<number, DiceRotation> => {
	const orientation: Record<number, DiceRotation> = {};
	for (const face of faces) {
		orientation[face.value] = face.landing;
	}
	return orientation;
};
