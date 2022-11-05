import { Dropdown }                         from 'primereact/dropdown';
import '../../styles/ui/SelectIde.scss';
import { useCallback, useEffect, useState } from 'react';
import useLogo                              from '../hooks/useLogo';
import { ProgramType }                      from '../../../types/project';
import { useTranslation }                   from 'react-i18next';

const SelectIde = (props: { id: any, value?: any, setVal?: (value: any) => void }) => {
	const { t }                   = useTranslation();
	const { value, setVal, id }   = props;
	const [newValue, setNewValue] = useState<any>();
	useEffect(() => {
		setNewValue(value);
	}, [value, id]);
	const data         = window.electron.programs.getAll(ProgramType.ide);
	const programs     = Object.values(data);
	const defaultIdeId = window.electron.settings.get<string>(`default.${ProgramType.ide}`);
	if (defaultIdeId && data[defaultIdeId] !== undefined) {
		programs.unshift({
							 executeCommand: data[defaultIdeId].executeCommand,
							 executePath   : data[defaultIdeId].executePath,
							 type          : ProgramType.ide,
							 id            : 0,
							 name          : `${data[defaultIdeId].name} (${t('default')})`,
							 label         : `${data[defaultIdeId].name} (${t('default')})`,
							 logo          : data[defaultIdeId].logo,
							 color         : data[defaultIdeId].color
						 });
	} else {
		programs.unshift({
							 executeCommand: '',
							 executePath   : '',
							 type          : ProgramType.ide,
							 id            : 0,
							 name          : `(${t('default')})`,
							 label         : `(${t('default')})`,
							 logo          : window.pixel,
							 color         : 'transparent'
						 });
	}
	const selectedCountryTemplate = useCallback((option: any) => {
		if (option) {
			const logo = useLogo({
									 type : ProgramType.ide,
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
		if (defaultIdeId && data[defaultIdeId] !== undefined) {
			const logo = useLogo({
									 type : ProgramType.ide,
									 name : `${data[defaultIdeId].name} (${t('default')})`,
									 logo : data[defaultIdeId].logo,
									 color: data[defaultIdeId].color
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>{`${data[defaultIdeId].name} (${t('default')})`}</div>
				</div>
			);
		} else {
			const logo = useLogo({
									 type : ProgramType.ide,
									 name : 'default',
									 logo : window.pixel,
									 color: 'transparent'
								 });
			return (
				<div className='ide-item ide-item-value'>
					{logo}
					<div>(${t('default')})</div>
				</div>
			);
		}

	}, []);
	const countryOptionTemplate   = useCallback((option: any) => {
		const logo = useLogo({
								 type : ProgramType.ide,
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
	}, []);
	const setValue                = (e: any) => {
		setNewValue(e.value);
		if (setVal) setVal(e.value);
	};
	return (
		<div className='SelectIde'>
			<Dropdown
				style={{ width: 'calc(100%)' }}
				options={programs}
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
