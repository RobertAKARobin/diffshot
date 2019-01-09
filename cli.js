#!/usr/bin/env node

const git = require('simple-git/promise')()

async function main(){
	const commits = JSON.parse(JSON.stringify((await git.log()).all))
	for(let index = 0, commit = undefined; commit = commits[index]; index += 1){
		let previousCommit = commits[index + 1]
		if(previousCommit){
			console.log(await git.diff([`${previousCommit.hash}..${commit.hash}`]))
		}
	}
}

main()
