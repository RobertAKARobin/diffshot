#!/usr/bin/env node

const git = require('simple-git/promise')()
const Jimp = require('jimp')
const fs = require('fs-extra')

async function main(){
	const font = await Jimp.loadFont('./fonts/inconsolata_16.fnt')
	const glyphs = {
		white:	rgb(font.pages[0].clone(), [255, 255, 255]),
		red:	rgb(font.pages[0].clone(), [255]),
		green:	rgb(font.pages[0].clone(), [, 255]),
		yellow: rgb(font.pages[0].clone(), [255, 255]),
		cyan:	rgb(font.pages[0].clone(), [, 255, 255]),
	}
	const imageWidth = 800
	const imageBackground = '000'
	const lineIndentPx = 5
	const lineHeightPx = 20
	const directoryName = '_DIFFSHOT'

	await fs.emptyDir(`./${directoryName}`)

	const log = JSON.parse(JSON.stringify((await git.log()).all))
	const commits = []
	for(let commitIndex = 0, rawCommit = null; rawCommit = log[commitIndex]; commitIndex += 1){
		const previousRawCommit = log[commitIndex + 1]
		const previousHash = (previousRawCommit ?  previousRawCommit.hash.substring(0, 8) : '4b825dc642cb6eb9a060e54bf8d69288fbee4904')
		const fileNames = (await git.diffSummary([`${previousHash}..${rawCommit.hash}`])).files.map(file=>file.file).sort()
		const commit = {
			message: rawCommit.message,
			anchor: anchorify(rawCommit.message),
			hash: rawCommit.hash.substring(0, 8),
			prevHash: previousHash,
			files: fileNames.map(fileName=>{
				return {
					name: fileName,
					imagePath: `./${directoryName}/${pathify(rawCommit.message)}.${pathify(fileName)}.png`,
					anchor: `${anchorify(rawCommit.message)}-${anchorify(fileName)}`
				}
			})
		}
		commits.push(commit)

		for(let fileIndex = 0, file = null; file = commit.files[fileIndex]; fileIndex += 1){
			const diff = await git.diff([`${commit.prevHash}..${commit.hash}`, '--', file.name])
			const diffByLine = diff.split('\n')
			const image = await (new Jimp(imageWidth, (lineHeightPx * (diffByLine.length - 1)), imageBackground))
	
			diffByLine.unshift(
				`# ${commit.hash}: ${commit.message}`
			)
			diffByLine.forEach((line, lineIndex)=>{
				let glyphColor
				switch(line.substring(0,1)){
					case '-': glyphColor = glyphs.red; break;
					case '+': glyphColor = glyphs.green; break;
					case '@': glyphColor = glyphs.cyan; break;
					case '#': glyphColor = glyphs.yellow; break;
					default:  glyphColor = glyphs.white
				}
				font.pages = [glyphColor]
				image.print(font, lineIndentPx, (lineHeightPx * lineIndex), line.replace(/\t/g, '   '))
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

	await fs.writeFileSync('./_DIFFSHOT.md', flatten(markdown).join('\n'))
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

main()
