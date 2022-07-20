export function ucfirst(s: string) {
	return String(s).charAt(0).toUpperCase() + s.substring(1);
}

export default ucfirst;
