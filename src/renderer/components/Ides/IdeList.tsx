import '../../styles/IdeList.scss';
import React       from 'react';
import IdeItem     from './IdeItem';
import { IDEType } from '../../../types/project';

const IdeList = (props: { Ides: { [key: string]: any }, onSelect: (e: React.MouseEvent<HTMLDivElement>, ide: IDEType) => void }) => {
	const { Ides, onSelect } = props;
	let forSort              = [];

	// eslint-disable-next-line guard-for-in
	for (const IdesKey in Ides) {
		const Ide = Ides[IdesKey];
		forSort.push(Ide);
	}
	forSort = forSort.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	return (
		<div className='IdeList'>
			<ul className='list'>
				{forSort.map((Ide) => <IdeItem onSelect={(e, ide) => onSelect(e, ide)} key={Ide.id} Ide={Ide} />)}
			</ul>
		</div>
	);
};

export default IdeList;
