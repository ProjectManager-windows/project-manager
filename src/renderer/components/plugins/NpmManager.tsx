import { useTranslation }             from 'react-i18next';
import { useEffect, useState }        from 'react';
import { DataTable }                  from 'primereact/datatable';
import { Column }                     from 'primereact/column';
import '../../styles/plugins/npmManager.scss';
import { InputText }                  from 'primereact/inputtext';
import { Button }                     from 'primereact/button';
import dayjs                          from 'dayjs';
import { hasTypes, PackageJson }      from '../../../types/PackageJson';
import ReactMarkdown                  from 'react-markdown';
import rehypeRaw                      from 'rehype-raw';
import remarkGfm                      from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as prismTheme }     from 'react-syntax-highlighter/dist/esm/styles/prism';

const NpmManager = () => {
	const { t }                           = useTranslation();
	const [search, setSearch]             = useState('');
	const [tmpSearch, setTmpSearch]       = useState('');
	const [expandedRows, setExpandedRows] = useState({});
	const [searching, setSearching]       = useState(false);
	const [packages, setPackages]         = useState<PackageJson[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			setSearching(true);
			setTimeout(async () => {
				console.time('st');
				const data = await window.electron.npm.search(search, { limit: 5 });
				console.timeEnd('st');
				setPackages(data);
				console.log(data);
				setSearching(false);
			}, 10);
		};
		if (search) {
			fetchData();
		} else {
			setPackages([]);
			setSearching(false);
		}
	}, [search]);

	function startSearch() {
		setSearch(tmpSearch);
		setSearching(true);
	}

	const dateBodyTemplate     = (rowData: PackageJson) => {
		return dayjs(rowData.date).fromNow();
	};
	const keywordsBodyTemplate = (rowData: PackageJson) => {
		return rowData.keywords?.slice(0, 3)?.join(', ');
	};
	const hasTypesBodyTemplate = (rowData: PackageJson) => {
		switch (rowData.hasTypes) {
			case hasTypes.ts:
				return <img className={`hasTypes hasTypes-${rowData.hasTypes}`} src={window.icons.ts} alt={rowData.hasTypes} />;
			case hasTypes.dt:
				return <img className={`hasTypes hasTypes-${rowData.hasTypes}`} src={window.icons.dt} alt={rowData.hasTypes} />;
			case hasTypes.no:
				return <img className={`hasTypes hasTypes-${rowData.hasTypes}`} src={window.icons.ts} alt={rowData.hasTypes} />;
		}
	};
	const header               = (
		<div className='p-inputgroup'>
			<InputText
				placeholder={t('search')} onChange={e => setTmpSearch(e.target.value)} onKeyUp={e => {
				if (e.code === 'Enter' || e.code === 'NumpadEnter') startSearch();
			}}
			/>
			<span className='p-inputgroup-addon'>
				<Button
					onClick={startSearch} icon='pi pi-search'
				></Button>
			</span>
		</div>
	);
	const rowExpansionTemplate = (rowData: PackageJson) => {
		return (
			<div className={'markdown'}>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}
					components={{
						code({ node, inline, className, children, ...props }) {
							const match = /language-(\w+)/.exec(className || '');
							return !inline && match ? (
								<SyntaxHighlighter
									children={String(children).replace(/\n$/, '')}
									//@ts-ignore
									style={prismTheme}
									language={match[1]}
									PreTag='div'
									{...props}
								/>
							) : (
									   <code className={className} {...props}>
										   {children}
									   </code>
								   );
						}
					}}
				>
					{rowData.readme ? rowData.readme : ''}
				</ReactMarkdown>
			</div>
		);
	};

	return (
		<div className='NpmManager'>
			<div className='header'>
				<div className='name'>{t('NpmManager').ucfirst()}</div>
				<hr />
			</div>
			<div className={'content'}>
				<DataTable
					style={{ height: '100%', width: '100%' }}
					header={header} loading={searching}
					scrollable scrollHeight='100%'
					value={packages} dataKey='name' rowHover
					expandedRows={expandedRows}
					rowExpansionTemplate={rowExpansionTemplate}
					onRowToggle={(e) => setExpandedRows(e.data)}
				>
					<Column expander style={{ minWidth: '2em', maxWidth: '3em' }} />
					<Column field='hasTypes' header={t('ts').ucfirst()} sortable body={hasTypesBodyTemplate} style={{ minWidth: '4em', maxWidth: '4em' }} />
					<Column field='name' header={t('name').ucfirst()} sortable filter filterField='name' />
					<Column field='version' header={t('version').ucfirst()} sortable filter filterField='version' />
					<Column field='description' header={t('description').ucfirst()} sortable filter filterField='description' />
					<Column field='keywords' header={t('keywords').ucfirst()} sortable filter filterField='keywords' body={keywordsBodyTemplate} />
					<Column field='date' dataType='date' header={t('date').ucfirst()} sortable filter filterField='date' body={dateBodyTemplate} />
				</DataTable>
			</div>
		</div>
	);
};

export default NpmManager;
