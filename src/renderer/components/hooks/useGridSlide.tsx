import { DragEvent, useState } from 'react';

export function useGridSlide(): [JSX.Element, number, () => void] {
	const [deltaX, setDeltaX] = useState(0);
	let posX                  = 0;

	function start(e: DragEvent<HTMLDivElement>) {
		posX = e.pageX;
		e.currentTarget.setAttribute('draggable', 'true');
	}

	function drag(e: DragEvent<HTMLDivElement>) {
		if (e && e.currentTarget && e.currentTarget.style && e.pageX) {
			e.currentTarget.style.position = 'absolute';
			e.currentTarget.style.zIndex   = '999';
			e.currentTarget.style.left     = e.pageX + 'px';
			e.currentTarget.style.opacity  = '0.5';
		}
	}

	function stop(e: DragEvent<HTMLDivElement>) {
		if (e && e.currentTarget && e.currentTarget.style && e.pageX) {
			setDeltaX(e.pageX - posX);
			e.currentTarget.removeAttribute('style');
			e.currentTarget.removeAttribute('draggable');
		}
	}

	function reset() {
		setDeltaX(0);
	}

	const html = <div className='grid-slide' onDragStart={start} onDrag={drag} onDragEnd={stop}>
			  <div className='grid-slide-handel'></div>
		  </div>
	;
	return [html, deltaX, reset];
}
