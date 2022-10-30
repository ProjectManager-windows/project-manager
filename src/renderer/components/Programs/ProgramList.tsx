import '../../styles/ProgramList.scss';
import '../../styles/ProgramItem.scss';
import React             from 'react';
import { Ripple }        from 'primereact/ripple';
import ProgramItem       from './ProgramItem';
import useLogo           from '../hooks/useLogo';
import { ProgramFields } from '../../../types/project';

const ProgramList = (props: {
	Programs: { [key: string]: ProgramFields },
	onSelect: (e: React.MouseEvent<HTMLDivElement>, program: ProgramFields) => void,
	createProgram: (e: React.MouseEvent<HTMLDivElement>) => void
}) => {
	const { Programs, onSelect, createProgram } = props;
	let forSort                                 = [];
	for (const ProgramKey in Programs) {
		const Program = Programs[ProgramKey];
		forSort.push(Program);
	}
	forSort    = forSort.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	const logo = useLogo({
							 type : 'program',
							 name : '+',
							 color: 'transparent',
							 logo : ''
						 });
	return (
		<div className='ProgramList'>
			<ul className='list'>
				{forSort.map((Program) => <ProgramItem onSelect={(e, program) => onSelect(e, program)} key={Program.id} program={Program} />)}
				<div className='ProgramItem' id='program-item-new' onClick={(e) => createProgram(e)}>
					<li className='item p-ripple'>
						<Ripple />
						<div>
							{logo}
							<div className='info'>
								<div className='tp name' data-pr-tooltip='create'>create</div>
							</div>
						</div>
					</li>
				</div>
			</ul>
		</div>
	);
};

export default ProgramList;
