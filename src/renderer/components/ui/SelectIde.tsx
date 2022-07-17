import { Dropdown }            from 'primereact/dropdown';
import '../../styles/SelectIde.scss';
import { useEffect, useState } from 'react';
import useLogo                 from '../hooks/useLogo';

const SelectIde = (props: { id: any, value?: number, setVal?: (value: any) => void }) => {
	const { value, setVal, id }   = props;
	const [newValue, setNewValue] = useState<any>();
	useEffect(() => {
		setNewValue(value);
	}, [value, id]);
	const data         = window.electron.ides.getAll();
	const IDEs         = Object.values(data);
	const defaultIdeId = window.electron.settings.get('defaultIde');

	if (defaultIdeId) {
		IDEs.unshift({
						 id   : 0,
						 name : `${data[defaultIdeId].name} (default)`,
						 logo : data[defaultIdeId].logo,
						 color: data[defaultIdeId].color
					 });
	}
	const selectedCountryTemplate = (option: any) => {
		if (option) {
			const logo = useLogo({
									 type : 'ide',
									 name : option.name,
									 logo : option.logo,
									 color: option.color
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>{option.name}</div>
				</div>
			);
		} else if (defaultIdeId) {
			const logo = useLogo({
									 type : 'ide',
									 name : data[defaultIdeId].name,
									 logo : data[defaultIdeId].logo,
									 color: data[defaultIdeId].color
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>{data[defaultIdeId].name} (default)</div>
				</div>
			);
		}
		return (
			<div className='ide-item ide-item-value'>
				<img className='logo' src={window.pixel} alt='' />
				<div>no selected</div>
			</div>
		);
	};
	const countryOptionTemplate   = (option: any) => {
		const logo = useLogo({
								 type : 'ide',
								 name : option.name,
								 logo : option.logo,
								 color: option.color
							 });
		return (
			<div className='ide-item'>
				{logo}
				<div>{option.name}</div>
			</div>
		);
	};
	const setValue                = (e: any) => {
		setNewValue(e.value);
		if (setVal) setVal(e.value);
	};
	return (
		<div className='SelectIde'>
			<Dropdown
				options={IDEs}
				optionLabel='name'
				value={newValue}
				optionValue='id'
				onChange={setValue}
				filter
				// showClear
				filterBy='name'
				placeholder='Select a Country'
				valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate}
			/>
		</div>
	);
};

export default SelectIde;
