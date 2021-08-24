module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: [
		'standard'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		indent: [2, 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
		'accessor-pairs': 0
	}
}
