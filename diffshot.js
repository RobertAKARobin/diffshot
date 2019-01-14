#!/usr/bin/env node

const git = require('simple-git/promise')()
const Jimp = require('jimp')
const fs = require('fs-extra')
const argv = require('yargs').argv

const defaultConfig = {
	imageWidthPx: 800,
	imageBgColorHex: '000',
	textFontFile: `${__dirname}/fonts/inconsolata_16.fnt`,
	textLineIndentPx: 5,
	textLineHeightPx: 20,
	textColorMain: [255, 255, 255],
	textColorDelete: [255],
	textColorAdd: [, 255],
	textColorHeadline: [255, 255],
	textColorMeta: [, 255, 255],
	outputDirectory: '_DIFFSHOT',
	outputDocName: 'README.md',
	_: '*'
}

main()

async function main(){
	const config = {}
	for(let configProperty in defaultConfig){
		config[configProperty] = (argv[configProperty] || defaultConfig[configProperty])
	}

	const font = await Jimp.loadFont(config.textFontFile)
	const glyphs = {
		main:		rgb(font.pages[0].clone(), config.textColorMain),
		delete:		rgb(font.pages[0].clone(), config.textColorDelete),
		add:		rgb(font.pages[0].clone(), config.textColorAdd),
		headline:	rgb(font.pages[0].clone(), config.textColorHeadline),
		meta:		rgb(font.pages[0].clone(), config.textColorMeta),
	}

	await fs.emptyDir(`./${config.outputDirectory}`)

	const log = JSON.parse(JSON.stringify((await git.log()).all))
	const commits = []
	for(let commitIndex = 0, rawCommit = null; rawCommit = log[commitIndex]; commitIndex += 1){
		const previousRawCommit = log[commitIndex + 1]
		const previousHash = (previousRawCommit ?  previousRawCommit.hash.substring(0, 8) : '4b825dc642cb6eb9a060e54bf8d69288fbee4904')
		const diffSummary = await git.diffSummary([`${previousHash}..${rawCommit.hash}`].concat(config._))
		const fileNames = diffSummary.files.map(file=>file.file).sort()
		const commit = {
			message: rawCommit.message,
			anchor: anchorify(rawCommit.message),
			hash: rawCommit.hash.substring(0, 8),
			prevHash: previousHash,
			files: fileNames.map(fileName=>{
				return {
					name: fileName,
					imagePath: `./${config.outputDirectory}/${pathify(rawCommit.message)}.${pathify(fileName)}.png`,
					anchor: `${anchorify(rawCommit.message)}-${anchorify(fileName)}`
				}
			})
		}
		commits.push(commit)

		for(let fileIndex = 0, file = null; file = commit.files[fileIndex]; fileIndex += 1){
			const diff = await git.diff([`${commit.prevHash}..${commit.hash}`, '--', file.name])
			const diffByLine = diff.split('\n')
			const image = await (new Jimp(config.imageWidthPx, (config.textLineHeightPx * (diffByLine.length - 1)), config.imageBgColorHex))
	
			diffByLine.unshift(
				`# ${commit.hash}: ${commit.message}`
			)
			diffByLine.forEach((line, lineIndex)=>{
				let glyphColor
				switch(line.substring(0,1)){
					case '-': glyphColor = glyphs.delete; break;
					case '+': glyphColor = glyphs.add; break;
					case '@': glyphColor = glyphs.meta; break;
					case '#': glyphColor = glyphs.headline; break;
					default:  glyphColor = glyphs.main
				}
				font.pages = [glyphColor]
				image.print(font, config.textLineIndentPx, (config.textLineHeightPx * lineIndex), line.replace(/\t/g, '   '))
			})
			await image.writeAsync(file.imagePath)
		}
	}

	const markdown = [
		'# Diffshot',
		'## Contents',
		commits.map(commit=>[
			`- [${commit.hash}: ${commit.message}](#${commit.anchor})`,
			commit.files.map(file=>[
				`\t- [${file.name}](#${file.anchor})`
			])
		]),
		commits.map(commit=>[
			`# ${commit.message}`,
			`> ${commit.hash}`,
			commit.files.map(file=>[
				`## ${commit.message}: ${file.name}`,
				`![${commit.message}: ${file.name}](${file.imagePath})`
			])
		])
	]

	await fs.writeFileSync(`${config.outputDirectory}/${config.outputDocName}`, flatten(markdown).join('\n'))
}

function anchorify(input){
	return input
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^a-zA-Z0-9\-_]/g, "")
}

function rgb(jimp, rgb){
	const colors = ['red', 'green', 'blue']
	return jimp.color(rgb.map((value, index)=>{
		return {apply: colors[index], params: [value || 0]}
	}))
}

function flatten(nestedArray){
	return nestedArray.reduce((output, item)=>{
		if(Array.isArray(item)){
			return output.concat(flatten(item))
		}else{
			return output.concat(item)
		}
	}, [])
}

function pathify(input){
	return input
		.toLowerCase()
		.substring(0, 50)
		.replace(/ /g, "-")
		.replace(/[^a-zA-Z0-9-_\.]/g, "")
		.replace(/-{2,}/g, "-")
}
