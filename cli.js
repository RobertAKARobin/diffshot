#!/usr/bin/env node

const git = require('simple-git/promise')()

async function main(){
	const log = await git.log()
	console.log(log)
}

main()
