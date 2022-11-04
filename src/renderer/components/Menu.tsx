import '../styles/menu.scss';
import { Menubar }                                                                                            from 'primereact/menubar';
import React, { useEffect, useState }                                                                         from 'react';
import { useTranslation }                                                                                     from 'react-i18next';
import { FontAwesomeIcon }                                                                                    from '@fortawesome/react-fontawesome';
import { faFile, faFolder, faGear, faMaximize, faSquareXmark, faTerminal, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate }                                                                           from 'react-router-dom';
import logo                                                                                                   from '../../../assets/icon.svg';

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
			label  : t('projects').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faFile} />,
			command: () => {
				if (location.pathname !== '/') navigate('/');
			},
			items  : [
				{
					label  : t('scan').ucfirst(),
					icon   : 'pi pi-fw pi-search',
					command: () => {
						window.electron.projects.scan();
					}
				},
				{
					label  : t('select folder').ucfirst(),
					icon   : 'pi pi-fw pi-folder',
					command: () => {
						window.electron.projects.add();
					}
				}
			]
		},
		{
			label  : t('programs').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faTerminal} />,
			command: () => {
				if (location.pathname !== '/programs') navigate('/programs');
			}
		},
		{
			label  : t('folders').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faFolder} />,
			command: () => {
				if (location.pathname !== '/folders') navigate('/folders');
			}
		},
		{
			label  : t('settings').ucfirst(),
			icon   : <FontAwesomeIcon className='p-menuitem-icon' icon={faGear} />,
			command: () => {
				if (location.pathname !== '/settings') navigate('/settings');
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
