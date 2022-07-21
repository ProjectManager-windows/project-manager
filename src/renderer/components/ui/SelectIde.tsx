import { Dropdown }            from 'primereact/dropdown';
import '../../styles/SelectIde.scss';
import { useEffect, useState } from 'react';
import useLogo                 from '../hooks/useLogo';

const SelectIde = (props: { id: any, value?: any, setVal?: (value: any) => void }) => {
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
	} else {
		IDEs.unshift({
						 id   : 0,
						 name : `(default)`,
						 logo : window.pixel,
						 color: 'transparent'
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
		}
		if (defaultIdeId) {
			const logo = useLogo({
									 type : 'ide',
									 name : `${data[defaultIdeId].name} (default)`,
									 logo : data[defaultIdeId].logo,
									 color: data[defaultIdeId].color
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>{`${data[defaultIdeId].name} (default)`}</div>
				</div>
			);
		} else {
			const logo = useLogo({
									 type : 'ide',
									 name : 'default',
									 logo : window.pixel,
									 color: 'transparent'
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>(default)</div>
				</div>
			);
		}

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
				style={{ width: 'calc(100% - 35px)' }}
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
