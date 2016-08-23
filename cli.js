#!/usr/bin/env node
'use strict';
const fs = require('fs');
const getStdin = require('get-stdin');
const meow = require('meow');
const pify = require('pify');
const toIco = require('to-ico');

const fsP = pify(fs);
const cli = meow(`
	Usage
	  $ to-ico <input> ... > favicon.ico
	  $ cat <input> | to-ico > favicon.ico

	Example
	  $ to-ico unicorn-16x16.png unicorn-32x32.png > favicon.ico
	  $ cat unicorn-32x32.png | to-ico > favicon.ico
`);

const run = input => toIco(input).then(buf => process.stdout.write(buf));

if (!cli.input.length && process.stdin.isTTY) {
	console.error('Specify at least one filename');
	process.exit(1);
}

if (cli.input.length) {
	Promise.all(cli.input.map(x => fsP.readFile(x))).then(run);
} else {
	getStdin.buffer().then(buf => run([buf]));
}
