#!/usr/bin/env node

const [,, ...args] = process.argv

console.log(`Args: ${args.join('; ')}`)
