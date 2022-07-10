import { useTranslation }               from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

function guidGenerator() {
	const S4 = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return ('a' + S4() + S4());
}

export type settingType = 'text' | 'longText' | 'int' | 'float';

const SettingInput = (props: { settingKey: string, type: settingType }) => {
	const { t }                     = useTranslation();
	const { settingKey, type }      = props;
	const [oldValue, setOldValue]   = useState(window.electron.store.get(settingKey));
	const [newValue, setNewValue]   = useState(oldValue);
	const [className, setClassName] = useState('SettingInput' + ' SettingInput-' + type + ' noChanged');
	useEffect(() => {
		setOldValue(window.electron.store.get(settingKey));
	}, []);
	const id     = useMemo(() => guidGenerator(), [settingKey,type]);
	const commit = (newVal: any) => {
		window.electron.store.set(settingKey, newVal);
		setNewValue(newVal);
		setOldValue(newVal);
	};
	useEffect(() => {
		const isChanged = oldValue !== newValue;
		setClassName('SettingInput' + ' SettingInput-' + type + ' ' + (isChanged ? 'changed' : 'noChanged'));
	}, [oldValue, newValue]);
	switch (type) {
		case 'text':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<input id={id} value={newValue} onInput={e => setNewValue(e.target.value)} onBlur={e => commit(e.target.value)} />
				</div>
			);
		case 'longText':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<input id={id} value={newValue} onInput={e => setNewValue(e.target.value)} />
				</div>
			);
		case 'int':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<input type='number' id={id} value={newValue} onInput={e => setNewValue(e.target.value)} onChange={e => commit(e.target.value)} />
				</div>
			);
		case 'float':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<input id={id} value={newValue} onInput={e => setNewValue(e.target.value)} />
				</div>
			);
		default:
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<input id={id} value={newValue} onInput={e => setNewValue(e.target.value)} />
				</div>
			);
	}

};

export default SettingInput;
