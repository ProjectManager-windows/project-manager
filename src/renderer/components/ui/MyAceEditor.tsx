import AceEditor           from 'react-ace';
import { IAceEditorProps } from 'react-ace/src/ace';

export const MyAceEditor = (props: IAceEditorProps) => {
	const { mode,theme, value, name, height, onChange, onBlur, setOptions } = props;

	const options = Object.assign(setOptions??{}, {
		fontFamily               : 'Fira Code',
		enableBasicAutocompletion: true,
		enableLiveAutocompletion : true,
		enableSnippets           : true,
		showLineNumbers          : true,
		tabSize                  : 2
	});

	return (
		<>
			<AceEditor
				mode={mode}
				theme={theme}
				value={value || ''}
				name={name}
				height={height}
				onChange={onChange}
				onBlur={onBlur}
				fontSize={14}
				showPrintMargin
				showGutter
				highlightActiveLine
				setOptions={options}
			/>
		</>
	);
};
