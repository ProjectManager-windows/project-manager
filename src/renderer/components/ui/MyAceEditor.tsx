import AceEditor           from 'react-ace';
import { IAceEditorProps } from 'react-ace/src/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-spellcheck';
import { IAceOptions }     from 'react-ace/src/types';

export const MyAceEditor = (props: IAceEditorProps) => {
	const { mode, theme, value, name, height,width,onLoad, onChange, onBlur, setOptions } = props;

	const options: IAceOptions = Object.assign(setOptions ?? {}, {
		fontFamily               : 'Fira Code',
		enableBasicAutocompletion: true,
		enableLiveAutocompletion : true,
		enableSnippets           : true,
		showLineNumbers          : true,
		spellcheck               : true,
		enableMultiselect        : true,
		cursorStyle              : 'slim',
		tabSize                  : 2
	} as IAceOptions);

	return (
		<AceEditor
			mode={mode}
			theme={theme}
			value={value || ''}
			name={name}
			height={height}
			width={width}
			onLoad={onLoad}
			onChange={onChange}
			onBlur={onBlur}
			fontSize={14}
			showPrintMargin
			showGutter
			highlightActiveLine
			setOptions={options}
		/>
	);
};
