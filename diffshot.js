#!/usr/bin/env node

const diffshot = require('./src/diffshot')
const argv = require('yargs')
	.usage('$0 [<options>] [<commit> [<commit>]] [--] [<path>...]')
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
		'outputImagePath': {
			type: 'string',
			default: '_DIFFSHOT'
		},
		'outputDocPath': {
			type: 'string',
			default: '_DIFFSHOT/README.md'
		},
		'textFontFile': {
			type: 'string',
			default: `${__dirname}/fonts/inconsolata_16.fnt`
		},
		'textLineIndentPx': {
			type: 'number',
			default: 5
		},
		'textLineHeightPx': {
			type: 'number',
			default: 20
		},
		'imageWidthPx': {
			type: 'number',
			default: 800
		},
		'imageBgColor': {
			type: 'string',
			default: '000000'
		},
		'textColorMain': {
			type: 'string',
			default: 'ffffff'
		},
		'textColorDelete': {
			type: 'string',
			default: 'ff0000'
		},
		'textColorAdd': {
			type: 'string',
			default: '00ff00'
		},
		'textColorHeadline': {
			type: 'string',
			default: 'ffff00'
		},
		'textColorMeta': {
			type: 'string',
			default: '00ffff'
		}
	})
	.argv

const config = JSON.parse(JSON.stringify(argv))
config.filesToExclude = config.filesToExclude.map(fileName=>new RegExp(fileName))
diffshot(config)
