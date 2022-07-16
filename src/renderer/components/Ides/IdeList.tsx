import '../../styles/IdeList.scss';
import IdeItem     from './IdeItem';
import React       from 'react';
import { IDEType } from '../../../types/project';

const IdeList = (props: { Ides: { [key: string]: any }, onSelect: (e: React.MouseEvent<HTMLDivElement>, ide: IDEType) => void }) => {
	const { Ides, onSelect } = props;
	let forSort              = [];
	const list               = [];

	// eslint-disable-next-line guard-for-in
	for (const IdesKey in Ides) {
		const Ide = Ides[IdesKey];
		forSort.push(Ide);
	}
	forSort = forSort.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	for (const Ide of forSort) {
		list.push(<IdeItem onClick={(e, ide) => onSelect(e, ide)} key={Ide.id} Ide={Ide} />);
	}
	return (
		<div className='IdeList'>
			<ul className='list'>
				{list}
			</ul>
		</div>
	);
};

export default IdeList;
