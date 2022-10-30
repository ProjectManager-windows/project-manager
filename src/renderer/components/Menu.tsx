import '../styles/menu.scss';
import { Menubar }                                                                                                                                    from 'primereact/menubar';
import React, { useEffect, useState }                                                                                                                 from 'react';
import { useTranslation }                                                                                                                             from 'react-i18next';
import { FontAwesomeIcon }                                                                                                                            from '@fortawesome/react-fontawesome';
import { faFile, faFolder, faGear, faMagnifyingGlass, faMaximize, faMicrochip, faPlus, faSquareXmark, faTerminal, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate }                                                                                                                   from 'react-router-dom';
import logo                                                                                                                                           from '../../../assets/icon.svg';

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
			label  : t('project').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faFile} />,
			command: () => {
				if (location.pathname !== '/') navigate('/');
			},
			items  : [
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
			label  : t('programs').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faTerminal} />,
			command: () => {
				if (location.pathname !== '/programs') navigate('/programs');
			}
		},
		{
			label  : 'Close',
			icon   : 'pi pi-fw pi-power-off',
			command: () => {
				window.electron.app.hide();
			}
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
					<FontAwesomeIcon className='p-menuitem-icon' onClick={() => window.electron.app.toggleMinimize()} icon={faWindowMinimize} />
					<FontAwesomeIcon className='p-menuitem-icon' onClick={() => window.electron.app.toggleMaximize()} icon={state.isMaximized ? faWindowRestore : faMaximize} />
					<FontAwesomeIcon className='p-menuitem-icon' onClick={() => window.electron.app.hide()} icon={faSquareXmark} />
				</div>
			</div>
			<Menubar model={items} start={start} end={end} />
		</div>
	);
};

export default Menu;
