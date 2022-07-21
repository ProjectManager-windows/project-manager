import '../../styles/TerminalList.scss';
import TerminalItem from './TerminalItem';
import { IDEType }  from '../../../types/project';

const TerminalList = (props: { Terminals: { [key: string]: any }, onSelect: (e: React.MouseEvent<HTMLDivElement>, ide: IDEType) => void }) => {
	const { Terminals, onSelect } = props;
	let forSort                   = [];
	const list                    = [];

	// eslint-disable-next-line guard-for-in
	for (const TerminalKey in Terminals) {
		const Terminal = Terminals[TerminalKey];
		forSort.push(Terminal);
	}
	forSort = forSort.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	for (const Terminal of forSort) {
		list.push(<TerminalItem onSelect={(e, ide) => onSelect(e, ide)} key={Terminal.id} terminal={Terminal} />);
	}
	return (
		<div className='TerminalList'>
			<ul className='list'>
				{list}
			</ul>
		</div>
	);
};

export default TerminalList;
