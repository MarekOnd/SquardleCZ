module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{json,svg,css,html,txt,js,tsv,md}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};