import { Button }               from 'primereact/button';
import React, { CSSProperties } from 'react';
import { OverlayPanel }         from 'primereact/overlaypanel';
import '../../styles/Help.scss';

export const Help = (props: { children: React.ReactNode; label?: string, style?: CSSProperties }) => {
	const op                         = React.useRef<OverlayPanel>(null);
	const { children, label, style } = props;
	return (
		<>
			<Button type='button' label={label} onClick={(e) => op.current?.toggle(e)} />
			<OverlayPanel ref={op}>
				<div className='Help-content' style={style}>
					{children}
				</div>
			</OverlayPanel>
		</>
	);
};
