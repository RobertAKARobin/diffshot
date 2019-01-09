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

	const log = JSON.parse(JSON.stringify((await git.log()).all))
	for(let commitIndex = 0, rawCommit = null; rawCommit = log[commitIndex]; commitIndex += 1){
		const previousRawCommit = log[commitIndex + 1]
		const previousHash = (previousRawCommit ?  previousRawCommit.hash.substring(0, 6) : '4b825dc642cb6eb9a060e54bf8d69288fbee4904')
		const fileNames = (await git.diffSummary([`${previousHash}..${rawCommit.hash}`])).files.map(file=>file.file).sort()
		const commit = {
			name: rawCommit.message,
			abbr: rawCommit.message.toLowerCase().substring(0, 50)
				.replace(/ /g, "-")
				.replace(/[^a-zA-Z0-9\-_]/g, "")
				.replace(/-{2,}/g, "-"),
			hash: rawCommit.hash.substring(0, 6),
			prevHash: previousHash,
			files: fileNames.map(fileName=>{
				return {
					name: fileName,
					abbr: fileName.toLowerCase().substring(0, 50)
						.replace(/ /g, "-")
						.replace(/[^a-zA-Z0-9\-_\.]/g, "")
						.replace(/-{2,}/g, "-")
				}
			})
		}
		for(let fileIndex = 0, file = null; file = commit.files[fileIndex]; fileIndex += 1){
			const diff = await git.diff([`${commit.prevHash}..${commit.hash}`, file.name])
			const diffByLine = diff.split('\n')
			const image = await (new Jimp(imageWidth, (lineHeightPx * (diffByLine.length - 1)), imageBackground))
			const imagePath = `./${directoryName}/${commit.abbr}.${file.abbr}.png`
	
			diffByLine.forEach((line, lineIndex)=>{
				image.print(font, lineIndentPx, (lineHeightPx * lineIndex), line)
			})
			await image.writeAsync(imagePath)
		}

// 		commitMarkdowns.push(`
// ## ${commit.message}

// > ${commit.hash}

// ![${commit.message}](${imagePath})`)
	}

	// await fs.writeFileSync('./_DIFFSHOT.md', commitMarkdowns.join('\n'))
}

main()
