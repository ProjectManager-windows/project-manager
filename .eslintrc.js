module.exports = {
	extends      : 'erb',
	rules        : {
		// A temporary hack related to IDE not resolving correct package.json
		'@typescript-eslint/ban-ts-comment'              : 0,
		'@typescript-eslint/lines-between-class-members' : 0,
		'@typescript-eslint/naming-convention'           : 0,
		'@typescript-eslint/no-explicit-any'             : 0,
		'@typescript-eslint/no-shadow'                   : 0,
		'@typescript-eslint/no-unused-expressions'       : 0,
		'@typescript-eslint/no-unused-vars'              : 0,
		'class-methods-use-this'                         : 0,
		'guard-for-in'                                   : 0,
		'import/no-cycle'                                : 0,
		'import/no-duplicates'                           : 0,
		'import/no-extraneous-dependencies'              : 0,
		'import/no-named-as-default'                     : 0,
		'import/no-unresolved'                           : 'error',
		'import/order'                                   : 1,
		'import/prefer-default-export'                   : 0,
		'jsx-a11y/click-events-have-key-events'          : 0,
		'jsx-a11y/no-noninteractive-element-interactions': 0,
		'jsx-a11y/no-static-element-interactions'        : 0,
		'max-classes-per-file'                           : 0,
		'no-await-in-loop'                               : 0,
		'no-continue'                                    : 0,
		'no-empty'                                       : 0,
		'no-plusplus'                                    : 0,
		'no-restricted-syntax'                           : 0,
		'no-undef'                                       : 0,
		'no-unused-expressions'                          : 0,
		'no-unused-vars'                                 : 0,
		'no-useless-constructor'                         : 0,
		'object-shorthand'                               : 0,
		'prefer-const'                                   : 0,
		'prettier/prettier'                              : 0,
		'promise/always-return'                          : 0,
		'promise/no-nesting'                             : 0,
		'react/react-in-jsx-scope'                       : 0

	},
	parserOptions: {
		ecmaVersion         : 2020,
		sourceType          : 'module',
		project             : './tsconfig.json',
		tsconfigRootDir     : __dirname,
		createDefaultProgram: true
	},
	settings     : {
		'import/resolver': {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node      : {},
			webpack   : {
				config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
			},
			typescript: {}
		},
		'import/parsers' : {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		}
	}
};
