import { Button }               from 'primereact/button';
import React, { CSSProperties } from 'react';
import { OverlayPanel }         from 'primereact/overlaypanel';
import '../../styles/Help.scss';

export const Help = (props: { children: React.ReactNode; label?: string, style?: CSSProperties, btn?: React.ReactNode }) => {
	const op                              = React.useRef<OverlayPanel>(null);
	const { children, label, style, btn } = props;
	return (
		<>
			<span onClick={(e) => op.current?.toggle(e)}>
					{btn !== undefined ? btn : <Button type='button' label={label} />}
				</span>
			<OverlayPanel ref={op}>
				<div className='Help-content' style={style}>
					{children}
				</div>
			</OverlayPanel>
		</>
	);
};
