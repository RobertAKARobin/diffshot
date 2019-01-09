#!/usr/bin/env node

const git = require('simple-git/promise')()
const Jimp = require('jimp')

async function main(){
	const font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK)
	const imageWidth = 800
	const imageBackground = 'fff'
	const lineIndentPx = 5
	const lineHeightPx = 16

	const commits = JSON.parse(JSON.stringify((await git.log()).all))
	commits.forEach(async (commit, commitIndex)=>{
		const previousCommit = commits[commitIndex + 1]
		if(previousCommit){
			const diffByLine = (await git.diff([`${previousCommit.hash}..${commit.hash}`])).split('\n')
			const image = await (new Jimp(imageWidth, (lineHeightPx * (diffByLine.length - 1)), imageBackground))
			diffByLine.forEach(async (line, lineIndex)=>{
				image.print(font, lineIndentPx, (lineHeightPx * lineIndex), line)
			})
			await image.writeAsync(`./${commit.hash}.png`)
		}
	})
}

main()
