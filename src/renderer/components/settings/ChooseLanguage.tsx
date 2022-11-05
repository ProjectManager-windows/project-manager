import { Dropdown }       from 'primereact/dropdown';
import { useLang }        from '../hooks/useLang';
import { useTranslation } from 'react-i18next';
import '../../styles/flags.scss';

export const ChooseLanguage = () => {
	const [language, setLanguage, languages] = useLang();
	const { t }                              = useTranslation();


	const selectedCountryTemplate = (option: any, props: any) => {
		if (option) {
			return (
				<div className='country-item country-item-value'>
					<img
						// @ts-ignore
						alt={option} src={window.icons.flag_placeholder} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
						className={`flag flag-${option}`}
					/>
					<div>{option}</div>
				</div>
			);
		}

		return (
			<span>
                {props.placeholder}
            </span>
		);
	};
	const countryOptionTemplate   = (option: any) => {
		return (
			<div className='country-item'>
				<img
					// @ts-ignore
					alt={option} src={window.icons.flag_placeholder} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
					className={`flag flag-${option}`}
				/>
				<div>{option}</div>
			</div>
		);
	};
	return (
		<Dropdown
			value={language} options={languages} onChange={(e) => setLanguage(e.value)} filter placeholder={t('choose language')}
			valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate}
		/>
	);
};
