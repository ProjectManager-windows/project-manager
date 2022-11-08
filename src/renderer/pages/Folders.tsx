import { DataTable }                               from 'primereact/datatable';
import { Column }                                  from 'primereact/column';
import { Button }                                  from 'primereact/button';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation }                          from 'react-i18next';
import { ContextMenu }                             from 'primereact/contextmenu';
import { FolderFields }                            from '../../types/project';


export const Folders = () => {
	const cm                                    = useRef<ContextMenu | null>(null);
	const { t }                                 = useTranslation();
	const [selectedFolders, setSelectedFolders] = useState<FolderFields[]>([]);
	const [, forceUpdate]                       = useReducer(x => x + 1, 0);

	function addSelectedFolders(value: FolderFields) {
		selectedFolders.push(value);
		forceUpdate();
	}

	console.log(selectedFolders);

	function getAll() {
		return Object.values(window.electron.folders.getAll());
	}

	const [folders, setFolders] = useState(getAll());
	useEffect(() => {
		return window.electron.folders.onUpdate(() => {
			setFolders(getAll());
		});
	});

	const renderHeader       = () => {
		return (
			<div className='flex justify-content-between align-items-center'>
				<span className='p-buttonset'>
				<Button className='p-button-success' type='button' icon='pi pi-plus' label={t('add folder').ucfirst()} onClick={() => window.electron.folders.add()}></Button>
				<Button
					className='p-button-info' type='button' icon='pi pi-search' label={t('scan').ucfirst()} onClick={() => window.electron.projects.scanFolders(selectedFolders.map((i) => i.path))}
				></Button>
				<Button
					className='p-button-danger' type='button' icon='pi pi-times' label={t('delete').ucfirst()} onClick={() => window.electron.folders.delete(selectedFolders.map((i) => i.id))}
				></Button>
					</span>
			</div>
		);
	};
	// const actionBodyTemplate = (rowData: FolderFields) => {
	// 	return rowData.activeWatcher ?
	// 		   <Button className='p-button-success' type='button' icon='pi pi-check' onClick={() => window.electron.folders.toggle(rowData.id, !rowData.activeWatcher)}></Button>
	// 								 :
	// 		   <Button className='p-button-danger' type='button' icon='pi pi-times' onClick={() => window.electron.folders.toggle(rowData.id, !rowData.activeWatcher)}></Button>;
	// };
	const header             = renderHeader();

	const menuModel = [
		{ label: t('delete').ucfirst(), icon: 'pi pi-fw pi-times', command: () => window.electron.folders.delete(selectedFolders.map((i) => i.id)) },
		{ label: t('scan').ucfirst(), icon: 'pi pi-fw pi-search', command: () => window.electron.projects.scanFolders(selectedFolders.map((i) => i.path)) }
	];
	return (
		<div className='folders'>
			<ContextMenu model={menuModel} ref={cm} />
			<DataTable
				header={header}
				value={folders} rows={10} dataKey='id' rowHover
				selection={selectedFolders} onSelectionChange={e => setSelectedFolders(e.value)}
				contextMenuSelection={selectedFolders}
				onContextMenu={e => (cm ? cm?.current?.show(e.originalEvent) : '')} responsiveLayout='scroll'
				onContextMenuSelectionChange={e => addSelectedFolders(e.value)}
			>
				<Column selectionMode='multiple' headerStyle={{ width: '3em' }}></Column>
				<Column field='name' header={t('name').ucfirst()} sortable filter filterPlaceholder='Search by name' style={{ minWidth: '14rem' }} />
				<Column field='path' header={t('path').ucfirst()} sortable filter filterPlaceholder='Search by path' style={{ minWidth: '14rem' }} />
				{/* <Column header={t('activeWatcher').ucfirst()} headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} /> */}
			</DataTable>
		</div>
	);
};
