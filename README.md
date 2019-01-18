# Diffshot

[![NPM version](https://img.shields.io/npm/v/diffshot.svg)](https://www.npmjs.com/package/diffshot)

Loops through a Git log and makes an image of the diff of each file, like this:

![Diffshot sample](https://raw.githubusercontent.com/RobertAKARobin/diffshot/master/image.png)

[See more examples](https://github.com/RobertAKARobin/diffshot/wiki)

## Why?

I use Diffshot to make coding tutorials. I used to include code snippets in my tutorials, but found that it kept my students from learning: they just copied and pasted my code in order to finish the tutorial as quickly as possible.

By using images of code, instead of actual code, it removes the temptation to copy and paste. Even if students simply type out what's in the images, they gain a better understanding because (a) they have to actually read the code, and (b) they often make mistakes (forget a bracket, misspell a variable, etc) and have to debug to find the error.

## Installation

```sh
$ npm install -g diffshot
```

## Usage

```sh
$ cd my-git-repo
$ diffshot
```

The result is:
* A directory named `_DIFFSHOT` that contains a bunch of images, and
* A file named `README.md` that lists the text and images of each diff.

[See the wiki for an example.](https://github.com/RobertAKARobin/diffshot/wiki)

## Options

```
$ diffshot -h
diffshot [<options>] [<commit> [<commit>]] [--] [<path>...]
Loops through a Git log and makes an image of the diff of each file.

Options:
  --help, -h                Show help                                                      [boolean]
  --version, -v             Show version number                                            [boolean]
  --filesToExclude                                  [array] [default: ["^.*-lock.json$","^.*.fnt$"]]
  --isOldestCommitFirst                                                    [boolean] [default: true]
  --doEraseOutputDirectory                                              [boolean] [default: "false"]
  --outputDirectory                                                  [string] [default: "_DIFFSHOT"]
  --outputFilename                                                   [string] [default: "README.md"]
  --fontFile          [string] [default: "~/npm-install-location/diffshot/fonts/inconsolata_16.fnt"]
  --fontLineIndentPx                                                           [number] [default: 5]
  --fontLineHeightPx                                                          [number] [default: 20]
  --fontColorMain                                                       [string] [default: "ffffff"]
  --fontColorDelete                                                     [string] [default: "ff0000"]
  --fontColorAdd                                                        [string] [default: "00ff00"]
  --fontColorHeadline                                                   [string] [default: "ffff00"]
  --fontColorMeta                                                       [string] [default: "00ffff"]
  --imageWidthPx                                                             [number] [default: 800]
  --imageBgColor                                                        [string] [default: "000000"]

Examples:
  diffshot                                            Will make an image of the diff of each file in
                                                      each commit.
  diffshot index.js                                   Will make an image of the diff of index.js in
                                                      each commit.
  diffshot index.js package.json                      Will make an image of the diffs of index.js
                                                      and package.json in each commit.
  diffshot acb5f13..ad8cfc9 index.js package.json     Will make an image of the diffs of index.js
                                                      and package.json from commit acb5f13 through
                                                      ad8cfc9.
  diffshot  --filesToExclude=package.json             Will make an image of each file in each
  --filesToExclude=^.*-lock.json$                     commit, excluding those named package.json and
                                                      those ending with "-lock.json"
```

The font must be a bitmap font (`.fnt`) file.

## Contributing

Yes, please! :)
