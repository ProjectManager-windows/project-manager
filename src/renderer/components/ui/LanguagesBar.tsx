const LanguagesBar = (props: { stats?: { [key: string]: number }, className?: string }) => {
	const { stats, ...args }                   = props;
	const progress                             = [];
	let anal: { name: string, size: number }[] = [];
	let total                                  = 0;
	for (const statsKey in stats) {
		for (const availableExtKey of window.LanguagesExtensions) {
			if (availableExtKey?.extensions?.includes(statsKey)) {
				anal.push({ name: availableExtKey.name, size: stats[statsKey] });
				total += stats[statsKey];
				break;
			}
		}
	}
	console.log(anal)

	anal = anal.sort((a, b) => {
		if (a.size === b.size) {
			return 0;
		}
		return a.size < b.size ? 1 : -1;
	});
	for (const analKey in anal) {
		const { name, size } = anal[analKey];
		const percent        = size / total * 100;
		const color          = window.languagesColors[name.toLowerCase()] || '#FFFFFF';
		if(percent < 5){
			continue;
		}
		progress.push(<div key={name} className={`progress-bar lang-${name}`} role='progressbar' style={{ width: percent, background: color,borderRight:"1px solid black" }} />);
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
