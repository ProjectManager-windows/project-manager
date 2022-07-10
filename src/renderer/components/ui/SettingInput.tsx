import { useTranslation }               from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { InputSwitch }                  from 'primereact/inputswitch';
import { InputTextarea }                from 'primereact/inputtextarea';
import { InputNumber }                  from 'primereact/inputnumber';
import { InputText }                    from 'primereact/inputtext';

function guidGenerator() {
	const S4 = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return ('a' + S4() + S4());
}

export type settingType = 'text' | 'longText' | 'int' | 'float' | 'switch' | 'select';

const SettingInput = (props: { settingKey: string, type: settingType }) => {
	const { t }                     = useTranslation();
	const { settingKey, type }      = props;
	const [oldValue, setOldValue]   = useState(window.electron.store.get('settings.' + settingKey));
	const [newValue, setNewValue]   = useState(oldValue);
	const [className, setClassName] = useState('SettingInput' + ' SettingInput-' + type + ' noChanged');
	useEffect(() => {
		setOldValue(window.electron.store.get('settings.' + settingKey));
	}, []);
	const id     = useMemo(() => guidGenerator(), [settingKey, type]);
	const commit = (Val: any) => {
		const write = (v: any) => {
			window.electron.store.set('settings.' + settingKey, v);
			setNewValue(v);
			setOldValue(v);
		};

		if (type === 'int' || type === 'float') {
			let newVal = String(Val);
			newVal     = newVal.replaceAll(',', '.');
			newVal     = newVal.replaceAll(/[^\d.+-]/g, '');
			if (type === 'int') {
				const numberVal = parseInt(newVal);
				window.electron.store.set('settings.' + settingKey, numberVal);
				return write(numberVal);
			}
			if (type === 'float') {
				const numberVal = parseFloat(newVal);
				return write(numberVal);
			}
		}

		if (type === 'switch') {
			if (typeof Val != 'boolean') {
				if (typeof Val == 'string') {
					Val = Val.toLowerCase() === 'true';
				}
				if (typeof Val == 'number') {
					Val = !!Val;
				}
			}
			return write(Val);
		}
		return write(Val);
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
					<InputText
						id={id} value={newValue} onChange={e => {
						setNewValue(e.target.value);
						commit(e.target.value);
					}}
					/>
				</div>
			);
		case 'longText':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<InputTextarea
						autoResize={true} id={id} value={newValue}
						onChange={e => {
							setNewValue(e.target.value);
							commit(e.target.value);
						}}
					/>
				</div>
			);
		case 'int':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<InputNumber
						showButtons id={id} value={newValue}
						onChange={e => {
							setNewValue(e.value);
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'float':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<InputNumber
						showButtons id={id} value={newValue} mode='decimal' minFractionDigits={0} maxFractionDigits={5}
						onChange={e => {
							setNewValue(e.value);
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'switch':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<InputSwitch
						type='checkbox' id={id} checked={!!newValue}
						onChange={e => {
							setNewValue(e.value);
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'select':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					{/* @ts-ignore */}
					<select id={id} value={newValue} onInput={e => setNewValue(e.target.value)} onChange={e => commit(e.target.value)}>
						<option></option>
					</select>
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
