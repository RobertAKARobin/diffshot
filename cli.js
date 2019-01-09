#!/usr/bin/env node

const git = require('simple-git/promise')()
const Jimp = require('jimp')
const fs = require('fs-extra')

async function main(){
	const font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK)
	const imageWidth = 800
	const imageBackground = 'fff'
	const lineIndentPx = 5
	const lineHeightPx = 16
	const directoryName = '_DIFFSHOT'

	await fs.emptyDir(`./${directoryName}`)

	const commits = JSON.parse(JSON.stringify((await git.log()).all))
	const commitMarkdowns = [`# Diffshot`]
	for(let commitIndex = 0, commit = null; commit = commits[commitIndex]; commitIndex += 1){
		const previousCommit = commits[commitIndex + 1]
		const previousHash = (previousCommit
			? previousCommit.hash
			: '4b825dc642cb6eb9a060e54bf8d69288fbee4904')
		const diff = await git.diff([`${previousHash}..${commit.hash}`])
		const diffByLine = diff.split('\n')
		const image = await (new Jimp(imageWidth, (lineHeightPx * (diffByLine.length - 1)), imageBackground))
		const imagePath = `./${directoryName}/${commit.hash}.png`

		diffByLine.forEach((line, lineIndex)=>{
			image.print(font, lineIndentPx, (lineHeightPx * lineIndex), line)
		})
		await image.writeAsync(imagePath)

		commitMarkdowns.push(`
## ${commit.message}

> ${commit.hash}

![${commit.message}](${imagePath})`)
	}

	await fs.writeFileSync('./_DIFFSHOT.md', commitMarkdowns.join('\n'))
}

main()
