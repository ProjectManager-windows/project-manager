import '../styles/menu.scss';
import { Menubar }                    from 'primereact/menubar';
import React, { useEffect, useState } from 'react';
import { useTranslation }             from 'react-i18next';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import {
	faArrowUpRightFromSquare,
	faFile,
	faFolder,
	faGear,
	faMagnifyingGlass,
	faMaximize,
	faMicrochip,
	faPlus, faSquareXmark,
	faTerminal,
	faTrash,
	faWindowMinimize, faWindowRestore
}                                     from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate }   from 'react-router-dom';
import logo                           from '../../../assets/icon.svg';

const Menu = () => {
	const navigate          = useNavigate();
	const location          = useLocation();
	const { t }             = useTranslation();
	const [state, setState] = useState(
		{
			isMinimized: false,
			isMaximized: false,
			isVisible  : false,
			isFocused  : false
		}
	);
	const items             = [
		{
			label: t('file').ucfirst(),
			icon : <FontAwesomeIcon className='p-menuitem-icon' icon={faFile} />,
			items: [
				{
					label: t('add project').ucfirst(),
					icon : <FontAwesomeIcon className='p-menuitem-icon' icon={faPlus} />,
					items: [
						{
							label  : t('scan').ucfirst(),
							icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faMagnifyingGlass} />,
							command: () => {
								window.electron.projects.scan();
							}
						},
						{
							label  : t('select folder').ucfirst(),
							icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faFolder} />,
							command: () => {
								window.electron.projects.add();
							}
						}
					]
				},
				{
					label: 'delete project',
					icon : <FontAwesomeIcon className='p-menuitem-icon' icon={faTrash} />
				},
				{
					label: 'Export',
					icon : <FontAwesomeIcon className='p-menuitem-icon' icon={faArrowUpRightFromSquare} />
				},
				{
					separator: true
				},
				{
					label  : t('settings').ucfirst(),
					icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faGear} />,
					command: () => {
						if (location.pathname !== '/settings') navigate('/settings');
					}
				}
			]
		},
		{
			label: 'Edit',
			icon : 'pi pi-fw pi-pencil',
			items: [
				{
					label: 'Left',
					icon : 'pi pi-fw pi-align-left'
				},
				{
					label: 'Right',
					icon : 'pi pi-fw pi-align-right'
				},
				{
					label: 'Center',
					icon : 'pi pi-fw pi-align-center'
				},
				{
					label: 'Justify',
					icon : 'pi pi-fw pi-align-justify'
				}

			]
		},
		{
			label  : t('IDEs').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faMicrochip} />,
			command: () => {
				if (location.pathname !== '/ides') navigate('/ides');
			}
		},
		{
			label  : t('terminals').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faTerminal} />,
			command: () => {
				if (location.pathname !== '/terminals') navigate('/terminals');
			}
		},
		{
			label: 'Events',
			icon : 'pi pi-fw pi-calendar',
			items: [
				{
					label: 'Edit',
					icon : 'pi pi-fw pi-pencil',
					items: [
						{
							label: 'Save',
							icon : 'pi pi-fw pi-calendar-plus'
						},
						{
							label: 'Delete',
							icon : 'pi pi-fw pi-calendar-minus'
						}

					]
				},
				{
					label: 'Archieve',
					icon : 'pi pi-fw pi-calendar-times',
					items: [
						{
							label: 'Remove',
							icon : 'pi pi-fw pi-calendar-minus'
						}
					]
				}
			]
		},
		{
			label: 'Quit',
			icon : 'pi pi-fw pi-power-off'
		}
	];

	const start = React.createElement('img', {
		src      : logo,
		alt      : 'logo',
		height   : 40,
		className: 'm-2',
		style    : {
			marginRight: '5px'
		}
	});
	const end   = <div />;
	useEffect(() => {
		return window.electron.app.onChangeState((_state) => {
			setState(_state);
		});
	}, []);
	return (
		<div className='pm-menu'>
			<div className='pm-menu-top'>
				<div className='drag' />
				<div className='buttons'>
					<FontAwesomeIcon className='p-menuitem-icon' onClick={e => window.electron.app.toggleMinimize()} icon={faWindowMinimize} />
					<FontAwesomeIcon className='p-menuitem-icon' onClick={e => window.electron.app.toggleMaximize()} icon={state.isMaximized ? faWindowRestore : faMaximize} />
					<FontAwesomeIcon className='p-menuitem-icon' onClick={e => window.electron.app.quit()} icon={faSquareXmark} />
				</div>
			</div>
			<Menubar model={items} start={start} end={end} />
		</div>
	);
};

export default Menu;
