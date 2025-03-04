import { useMemo } from 'react';

// eslint-disable-next-line react/require-default-props
const LanguagesBar = (props: { stats?: { [key: string]: number }, className?: string }) => {
	const { stats, ...args } = props;

	const elements = useMemo(() => {
		const progress                             = [];
		let anal: { name: string, size: number }[] = [];
		let total                                  = 0;
		let total2                                 = 0;
		for (const statsKey in stats) {
			for (const availableExtKey of window.LanguagesExtensions) {
				if (availableExtKey?.extensions?.includes(statsKey) && !['data', 'prose'].includes(availableExtKey.type)) {
					anal.push({ name: availableExtKey.name, size: Math.sqrt(stats[statsKey]) });
					total += Math.sqrt(stats[statsKey]);
					total2 += stats[statsKey];
					break;
				}
			}
		}
		anal      = anal.sort((a, b) => {
			if (a.size === b.size) {
				return 0;
			}
			return a.size < b.size ? 1 : -1;
		});
		let other = 0;
		for (const analKey in anal) {
			const { name, size } = anal[analKey];
			const percent        = (Math.round(size / total * 1000) / 10);
			const percent2       = (Math.round((size * size) / total2 * 1000) / 10);
			const color          = window.languagesColors[name.toLowerCase()] || '#FFFFFF';
			if (percent < 5) {
				continue;
			} else {
				other += percent;
			}
			progress.push(
				<div
					key={`${name}-${percent}`}
					className={`tp progress-bar lang-${name}`} style={{ width: `${percent}%`, background: color, borderRight: '1px solid transparent' }}
					data-pr-tooltip={`${name} - ${percent2.toFixed(1)}%`}
				/>
			);
		}
		if (100 - other) {
			const color   = window.languagesColors.other;
			const percent = 100 - other;

			progress.push(<div
				key='other' className='tp progress-bar lang-other`' style={{ width: `${percent}%`, background: color, borderRight: '1px solid transparent' }}
				data-pr-tooltip={`other - ${percent.toFixed(1)}%`}
			/>);
		}
		return progress;
	}, [
								 stats
							 ]);


	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<div {...args}>
			<div className='progress'>
				{elements.map((element) =>element)}
			</div>
		</div>
	);
};

export default LanguagesBar;
