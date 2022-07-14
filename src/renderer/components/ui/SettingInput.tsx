import { useTranslation }               from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { InputSwitch }                  from 'primereact/inputswitch';
import { InputTextarea }                from 'primereact/inputtextarea';
import { InputNumber }                  from 'primereact/inputnumber';
import { InputText }                    from 'primereact/inputtext';

function guidGenerator() {
	function S4() {
		// eslint-disable-next-line no-bitwise
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (`a${S4()}${S4()}`);
}

export type settingType = 'text' | 'longText' | 'int' | 'float' | 'switch';

const SettingInput = (props: { settingKey: string, type: settingType }) => {
	const { t }                     = useTranslation();
	const { settingKey, type }      = props;
	const [oldValue, setOldValue]   = useState(window.electron.settings.get(settingKey));
	const [newValue, setNewValue]   = useState(oldValue);
	// eslint-disable-next-line no-useless-concat
	const [className, setClassName] = useState(`SettingInput SettingInput-${type} noChanged`);
	useEffect(() => {
		setOldValue(window.electron.settings.get(settingKey));
	}, [settingKey]);
	const id     = useMemo(() => guidGenerator(), []);
	const commit = (Val: any) => {
		const write = (v: any) => {
			window.electron.settings.set(settingKey, v);
			setNewValue(v);
			setOldValue(v);
		};

		if (type === 'int' || type === 'float') {
			let newVal = String(Val);
			newVal     = newVal.replaceAll(',', '.');
			newVal     = newVal.replaceAll(/[^\d.+-]/g, '');
			if (type === 'int') {
				const numberVal = parseInt(newVal, 10);
				window.electron.settings.set(settingKey, numberVal);
				return write(numberVal);
			}
			if (type === 'float') {
				const numberVal = parseFloat(newVal);
				return write(numberVal);
			}
		}

		if (type === 'switch') {
			let boolVal: boolean = Val;
			if (typeof Val !== 'boolean') {
				if (typeof Val === 'string') {
					boolVal = Val.toLowerCase() === 'true';
				}
				if (typeof Val === 'number') {
					boolVal = !!Val;
				}
			}
			return write(boolVal);
		}
		return write(Val);
	};
	useEffect(() => {
		const isChanged = oldValue !== newValue;
		setClassName(`SettingInput SettingInput-${type} ${isChanged ? 'changed' : 'noChanged'}`);
	}, [oldValue, newValue, type]);
	switch (type) {

		case 'longText':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					<InputTextarea
						autoResize id={id} value={newValue}
						onChange={e => {
							commit(e.target.value);
						}}
					/>
				</div>
			);
		case 'int':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					<InputNumber
						showButtons id={id} value={newValue}
						onChange={e => {
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'float':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					<InputNumber
						showButtons id={id} value={newValue} mode='decimal' minFractionDigits={0} maxFractionDigits={5}
						onChange={e => {
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'switch':
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					<InputSwitch
						type='checkbox' id={id} checked={!!newValue}
						onChange={e => {
							commit(e.value);
						}}
					/>
				</div>
			);
		case 'text':
		default:
			return (
				<div className={className}>
					<label htmlFor={id}> {t(settingKey)} </label>
					<InputText
						id={id} value={newValue} onChange={e => {
						commit(e.target.value);
					}}
					/>
				</div>
			);
	}

};

export default SettingInput;
