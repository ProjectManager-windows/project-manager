import { useTranslation }                                      from 'react-i18next';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { DataTable }                                           from 'primereact/datatable';
import { Column }                                              from 'primereact/column';
import { FolderFields, ProjectAllProps, ProjectType }          from '../../../types/project';
import { ContextMenu }                                         from 'primereact/contextmenu';
import useLogo                                                 from '../hooks/useLogo';
import '../../styles/plugins/batchManagement.scss';
import { Button }                                              from 'primereact/button';
import { FontAwesomeIcon }                                     from '@fortawesome/react-fontawesome';
import { faBroom, faGear, faPlus, faTrash }                    from '@fortawesome/free-solid-svg-icons';
import { ProjectContext }                                      from '../context/ProjectContext';
import { InputText }                                           from 'primereact/inputtext';
import { Toolbar }                                             from 'primereact/toolbar';
import useSearch                                               from '../hooks/useSearch';

const BatchManagement = () => {
	const { setTechnology, selectProject } = useContext(ProjectContext);
	const { t }                            = useTranslation();
	const cm                               = useRef<ContextMenu | null>(null);

	const [_selectedProject, set_selectedProject] = useState<FolderFields[]>([]);
	const [, forceUpdate]                         = useReducer(x => x + 1, 0);

	function addSelectedProject(value: FolderFields) {
		_selectedProject.push(value);
		forceUpdate();
	}

	const [globalFilterValue, setGlobalFilterValue] = useState('');

	const [projects, setProjects] = useState(window.electron.projects.getAll());
	const projectList             = useSearch({ projects, searchString: globalFilterValue });
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);

	const LogoBodyTemplate   = (rowData: ProjectAllProps) => {
		return useLogo({
						   type : 'program',
						   name : rowData.name,
						   logo : rowData.logo,
						   color: rowData.color
					   });
	};
	const folderBodyTemplate = (rowData: ProjectAllProps) => {
		return window.electron.path.basename(window.electron.path.dirname(String(rowData.path)));
	};
	const sizeBodyTemplate   = (rowData: ProjectAllProps) => {
		return <div className={'sizes'}>
			<span> {t('current')}:</span>
			<span> {rowData.size?.formatBytes()}</span>
			<span> {t('can be')}:</span>
			<span> {rowData.compressedSize?.formatBytes()}</span>
		</div>;
	};


	const ToConfigBodyTemplate = (rowData: ProjectType) => {
		return <Button
			icon={<FontAwesomeIcon icon={faGear} />} onClick={() => {
			if (selectProject) {
				selectProject(rowData);
			}
			if (setTechnology) {
				setTechnology('config');
			}
		}}
		/>;
	};

	// const menuModel                                 = [
	// 	{ label: t('delete').ucfirst(), icon: 'pi pi-fw pi-times', command: () => console.log('test') },
	// 	{ label: t('scan').ucfirst(), icon: 'pi pi-fw pi-search', command: () => console.log('test') }
	// ];
	const renderHeader = () => {
		const leftContents = (
			<span className='p-buttonset'>
				<Button hidden className='p-button-info' type='button' icon={<FontAwesomeIcon icon={faPlus} />} label={t('add folder').ucfirst()} onClick={() => console.log('test')}></Button>
				<Button hidden className='p-button-info' type='button' icon={<FontAwesomeIcon icon={faBroom} />} label={t('clear temps').ucfirst()} onClick={() => console.log('test')}></Button>
				<Button className='p-button-danger' type='button' icon={<FontAwesomeIcon icon={faTrash} />} label={t('delete').ucfirst()} onClick={() => console.log('test')}></Button>
			</span>
		);

		const rightContents = (
			<span className='p-input-icon-left'>
				<i className='pi pi-search' />
				<InputText value={globalFilterValue} onChange={e => setGlobalFilterValue(e.target.value)} placeholder='Keyword Search' />
			</span>
		);
		return (
			<Toolbar left={leftContents} right={rightContents} />
		);
	};
	const header       = renderHeader();
	return (
		<div className='batchManagement'>
			<div className='header'>
				<div className='name'>{t('batch management').ucfirst()}</div>
				<hr />
			</div>
			{/* <ContextMenu model={menuModel} ref={cm} onHide={(e) => console.log(e)} /> */}
			<div className={'content'}>
				<DataTable
					style={{ height: '100%', width: '100%' }}
					header={header}
					scrollable scrollHeight='100%'
					value={projectList} dataKey='id' rowHover
					selection={_selectedProject} onSelectionChange={e => set_selectedProject(e.value)}
					contextMenuSelection={_selectedProject}
					onContextMenu={e => (cm ? cm?.current?.show(e.originalEvent) : '')}
					onContextMenuSelectionChange={e => addSelectedProject(e.value)}
				>
					<Column selectionMode='multiple' style={{ minWidth: '2em', maxWidth: '3em' }}></Column>
					<Column field='id' header={t('id').ucfirst()} sortable style={{ minWidth: '2em', maxWidth: '5em' }} />
					<Column field='logo' header={t('logo').ucfirst()} body={LogoBodyTemplate} style={{ minWidth: '40px', maxWidth: '6em' }} />
					<Column field='name' header={t('name').ucfirst()} sortable filter filterPlaceholder='Search by name' style={{ minWidth: '14rem' }} />
					<Column field='path' header={t('folder').ucfirst()} body={folderBodyTemplate} sortable filter filterPlaceholder='Search by folder' style={{ minWidth: '14rem' }} />
					<Column field='description' header={t('description').ucfirst()} sortable filter filterPlaceholder='Search by description' style={{ minWidth: '14rem' }} />
					<Column field='size' header={t('project size').ucfirst()} body={sizeBodyTemplate} style={{ minWidth: '10em', maxWidth: '10em' }} />
					<Column style={{ minWidth: '5em', maxWidth: '5em' }} body={ToConfigBodyTemplate} />

				</DataTable>
			</div>
		</div>
	);
};

export default BatchManagement;
