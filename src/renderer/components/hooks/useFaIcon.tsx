import { useMemo } from 'react';

export function useFaIcon(icon: any,color: string="#000000") {
	return useMemo(() => {
		const s = `
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${icon.icon[0]} ${icon.icon[1]}'>
<path fill='${color}'
d='${icon.icon[4]}'/>
</svg>

	`;
		return 'data:image/svg+xml;base64,' + window.btoa(s);
	}, [icon]);
}

export default useFaIcon;
