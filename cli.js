#!/usr/bin/env node

const diffshot = require('./src/diffshot')
const yargs = require('yargs')
const argv = yargs
	.usage([
		'$0 [<options>] [<commit> [<commit>]] [--] [<path>...]',
		'Loops through a Git log and makes an image of the diff of each file.'
	].join('\n'))
	.alias('help', 'h')
	.alias('version', 'v')
	.wrap(yargs.terminalWidth())
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
		'outputDirectory': {
			type: 'string',
			default: '_DIFFSHOT'
		},
		'outputFilename': {
			type: 'string',
			default: 'README.md'
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
	.example('$0', 'Will make an image of the diff of each file in each commit.')
	.example('$0 index.js', 'Will make an image of the diff of index.js in each commit.')
	.example('$0 index.js package.json', 'Will make an image of the diffs of index.js and package.json in each commit.')
	.example('$0 acb5f13..ad8cfc9 index.js package.json', 'Will make an image of the diffs of index.js and package.json from commit acb5f13 through ad8cfc9.')
	.example('$0  --filesToExclude=package.json --filesToExclude=^.*-lock.json$', 'Will make an image of each file in each commit, excluding those named package.json and those ending with "-lock.json"')
	.argv

diffshot(argv)
