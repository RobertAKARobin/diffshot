#!/usr/bin/env node

const diffshot = require('./src/diffshot')
const argv = require('yargs')
	.usage([
		'$0 [<options>] [<commit> [<commit>]] [--] [<path>...]',
		'Loop through a Git log and output a .png of the diff of each file in each commit.'
	].join('\n'))
	.alias('help', 'h')
	.alias('version', 'v')
	.options({
		'filesToExclude': {
			type: 'array',
			default: [
				'^.*-lock\.json$',
				'^.*\.fnt$'
			]
		},
		'doEraseOutputImagePath': {
			type: 'boolean',
			default: 'false'
		},
		'outputImagePath': {
			type: 'string',
			default: '_DIFFSHOT'
		},
		'outputDocPath': {
			type: 'string',
			default: '_DIFFSHOT/README.md'
		},
		'fontFile': {
			type: 'string',
			default: `${__dirname}/fonts/inconsolata_16.fnt`
		},
		'fontLineIndentPx': {
			type: 'number',
			default: 5
		},
		'fontLineHeightPx': {
			type: 'number',
			default: 20
		},
		'fontColorMain': {
			type: 'string',
			default: 'ffffff'
		},
		'fontColorDelete': {
			type: 'string',
			default: 'ff0000'
		},
		'fontColorAdd': {
			type: 'string',
			default: '00ff00'
		},
		'fontColorHeadline': {
			type: 'string',
			default: 'ffff00'
		},
		'fontColorMeta': {
			type: 'string',
			default: '00ffff'
		},
		'imageWidthPx': {
			type: 'number',
			default: 800
		},
		'imageBgColor': {
			type: 'string',
			default: '000000'
		}
	})
	.argv

diffshot(argv)
