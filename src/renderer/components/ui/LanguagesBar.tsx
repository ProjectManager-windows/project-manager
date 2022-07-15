const LanguagesBar = (props: { stats?: { [key: string]: number }, className?: string }) => {
	const { stats, ...args }                   = props;
	const progress                             = [];
	let anal: { name: string, size: number }[] = [];
	let total                                  = 0;
	for (const statsKey in stats) {
		for (const availableExtKey of window.LanguagesExtensions) {
			if (availableExtKey?.extensions?.includes(statsKey) && availableExtKey.type !== 'data') {
				anal.push({ name: availableExtKey.name, size: stats[statsKey] });
				total += stats[statsKey];
				break;
			}
		}
	}
	console.log(anal);

	anal      = anal.sort((a, b) => {
		if (a.size === b.size) {
			return 0;
		}
		return a.size < b.size ? 1 : -1;
	});
	let other = 0;
	for (const analKey in anal) {
		const { name, size } = anal[analKey];
		const percent        = size / total * 100;
		const color          = window.languagesColors[name.toLowerCase()] || '#FFFFFF';
		if (percent < 2) {
			other += percent;
			continue;
		}
		progress.push(
			<div className={`progress-bar lang-${name}`} style={{ width: `calc(${percent}% - 1px)`, background: color, borderRight: '1px solid transparent' }} />
		);
	}
	if (other) {
		const color = window.languagesColors.other;
		progress.push(<div
			key='other' className='progress-bar lang-other`' style={{ width: `calc(${other}% - 1px)`, background: color, borderRight: '1px solid transparent' }}
		/>);
	}
	return (
		<div {...args}>
			<div className='progress'>
				{progress}
			</div>
		</div>
	);
};

export default LanguagesBar;
