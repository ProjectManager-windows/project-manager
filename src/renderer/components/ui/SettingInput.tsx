import { useTranslation }                      from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { InputSwitch }                         from 'primereact/inputswitch';
import { InputTextarea }                       from 'primereact/inputtextarea';
import { InputNumber }                         from 'primereact/inputnumber';
import { InputText }                           from 'primereact/inputtext';
import { ColorPicker }                         from 'primereact/colorpicker';

function guidGenerator() {
	function S4() {
		// eslint-disable-next-line no-bitwise
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (`a${S4()}${S4()}`);
}

export type settingType = 'text' | 'longText' | 'int' | 'float' | 'switch' | 'select' | 'color';

const SettingInput = (props: { settingKey: string, type: settingType, setVal?: (value: any) => void, value: any, children?: React.ReactNode }) => {
	const { t }                                         = useTranslation();
	const { settingKey, type, setVal, value, children } = props;
	const [newValue, setNewValue]                       = useState<any>();
	const [oldValue, setOldValue]                       = useState<any>();
	const [isChanged, setIsChanged]                     = useState<boolean>(false);
	// eslint-disable-next-line no-useless-concat
	const [className, setClassName]                     = useState<string>(`SettingInput SettingInput-${type} noChanged`);
	useEffect(() => {
		setOldValue(window.electron.settings.get(settingKey));
	}, [settingKey]);
	const id     = useMemo(() => guidGenerator(), []);
	const commit = (Val: any) => {
		const write = (v: any) => {
			if (oldValue != newValue) {
				if (setVal) {
					setVal(v);
				}
				setNewValue(v);
				setOldValue(v);
			}
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
		setNewValue(value);
		setOldValue(value);
	}, [value]);
	useEffect(() => {
		setIsChanged(oldValue !== newValue);
		setClassName(`SettingInput SettingInput-${type} ${oldValue !== newValue ? 'changed' : 'noChanged'}`);
	}, [oldValue, newValue, type]);
	switch (type) {
		case 'longText':
			return (
				<div className={className}>
					<div className='caption'>
						<label htmlFor={id}> {t(settingKey)} </label>
					</div>
					<div className='input'>
						<span className='p-input-icon-right'>
						{
							isChanged ? <i className='pi pi-spin pi-spinner' />
									  : <i className='pi  pi-check' />
						}
						<InputTextarea
							autoResize id={id} value={newValue}
							onChange={e => {
								setNewValue(e.target.value);
							}}
							onBlur={e => {
								commit(e.target.value);
							}}
						/>
					</span>
					</div>
				</div>
			);
		case 'int':
			return (
				<div className={className}>
					<div className='caption'>
						<label htmlFor={id}> {t(settingKey)} </label>
					</div>
					<div className='input'>
						<span className='p-input-icon-right'>
						{
							isChanged ? <i className='pi pi-spin pi-spinner' />
									  : <i className='pi  pi-check' />
						}
							<InputNumber
								id={id} value={newValue}
								onChange={e => {
									setNewValue(e.value);
								}}
								onBlur={e => {
									commit(e.target.value);
								}}
							/>
					</span>
					</div>
				</div>
			);
		case 'float':
			return (
				<div className={className}>
					<div className='caption'>
						<label htmlFor={id}> {t(settingKey)} </label>
					</div>
					<div className='input'>
						<span className='p-input-icon-right'>
						{
							isChanged ? <i className='pi pi-spin pi-spinner' />
									  : <i className='pi  pi-check' />
						}
							<InputNumber
								id={id} value={newValue} mode='decimal' minFractionDigits={0} maxFractionDigits={5}
								onChange={e => {
									setNewValue(e.value);
								}}
								onBlur={e => {
									commit(e.target.value);
								}}
							/>
					</span>
					</div>
				</div>
			);
		case 'switch':
			return (
				<div className={className}>
					<div className='caption'>
						<label htmlFor={id}> {t(settingKey)} </label>
					</div>
					<div className='input'>
						<span className='p-input-icon-right'>
							{
								isChanged ? <i className='pi pi-spin pi-spinner' />
										  : <i className='pi  pi-check' />
							}
							<InputSwitch
								type='checkbox' id={id}
								checked={!!newValue}
								onChange={(e) => {
									setNewValue(e.value);
									commit(e.value);
								}}
							/>
						</span>
					</div>
				</div>
			);
		case 'select':
			if (children) {
				return (
					<div className={className}>
						<div className='caption'>
							<label> {t(settingKey)} </label>
						</div>
						<div className='input'>
							{children}
						</div>
					</div>
				);
			}
			throw new Error('missing Dropdown');
		case 'color':
			return (
				<div className={className}>
					<div className='caption'>
						<label htmlFor={id}> {t(settingKey)} </label>
					</div>
					<div className='input'>
						<ColorPicker
							id={id + 'p'}
							value={newValue}
							onChange={e => {
								if (typeof e.value === 'string') {
									setNewValue('#' + e.value.replaceAll('#', ''));
									commit('#' + e.value.replaceAll('#', ''));
								}
							}}
						/>
						<InputText
							id={id}
							value={newValue}
							onChange={e => {
								setNewValue('#' + e.target.value.replaceAll('#', ''));
							}}
							onBlur={e => {
								commit('#' + e.target.value.replaceAll('#', ''));
							}}
						/>
					</div>
				</div>
			);
		case 'text':
		default:
			if (!children) {
				return (
					<div className={className}>
						<div className='caption'>
							<label htmlFor={id}> {t(settingKey)} </label>
						</div>
						<div className='input'>
							<span className='p-input-icon-right'>
								{
									isChanged ? <i className='pi pi-spin pi-spinner' />
											  : <i className='pi  pi-check' />
								}
								<InputText
									id={id}
									value={newValue}
									onChange={e => {
										setNewValue(e.target.value);
									}}
									onBlur={e => {
										commit(e.target.value);
									}}
								/>
							</span>
						</div>
					</div>
				);
			}
			return (
				<div className={className}>
					<label> {t(settingKey)} </label>
					{children}
				</div>
			);
	}

};

export default SettingInput;
