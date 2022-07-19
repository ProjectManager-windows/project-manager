export function minmax(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}


export function round(value: number): number
export function round(value: number, precision: number): number
export function round(value: number, precision: number = 0): number {
	const multiplier = Math.pow(10, precision);
	return Math.round(value * multiplier) / multiplier;
}

export default { minmax, round };
