import { useTranslation } from 'react-i18next';

const GitPlugin = () => {
	const { t } = useTranslation();

	return (
		<div>
			{t('test')}
		</div>
	);
};

export default GitPlugin;
