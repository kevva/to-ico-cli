import fs from 'fs';
import test from 'ava';
import execa from 'execa';
import fileType from 'file-type';
import pify from 'pify';

process.chdir(__dirname);

test('show help screen', async t => {
	t.regex(await execa.stdout('./cli.js', ['--help']), /Convert PNG to ICO/);
});

test('show version', async t => {
	t.is(await execa.stdout('./cli.js', ['--version']), require('./package.json').version);
});

test('convert images to ico', async t => {
	t.deepEqual(fileType(await execa.stdout('./cli.js', [
		'fixtures/16.png',
		'fixtures/32.png'
	], {encoding: 'buffer'})), {
		ext: 'ico',
		mime: 'image/x-icon'
	});
});

test('convert image to ico using stdin', async t => {
	const input = await pify(fs.readFile)('fixtures/16.png');

	t.deepEqual(fileType(await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	})), {
		ext: 'ico',
		mime: 'image/x-icon'
	});
});
