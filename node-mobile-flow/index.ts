'use strict';

var colors = require('colors');
import fs = require('fs');
import sprintf_mod = require('sprintf');
import child = require("child_process");
var sprintf = sprintf_mod.sprintf;
import path = require('path');
import ncp_mod = require('ncp');
var ncp = ncp_mod.ncp;
import rm = require('rimraf');

var project: string = process.argv[2];

// Install global modules
console.log('Installing global modules...'.cyan);
var npm = process.platform == 'win32' ? 'npm.cmd' : 'npm';
// TODO: Check why global install gives problems
//var cmd: child.ChildProcess = child.spawn(npm, ['install', '-g', 'gulp', 'cordova', 'tsd', 'bower']);
var cmd: child.ChildProcess = child.spawn(npm, ['--version']);
cmd.stderr.on('data', function (data: Buffer) {
    console.log(data.toString().yellow);
});
cmd.on('exit', function (code: number) {
    var out: string = sprintf('Installing global modules completed with code %d.', code);
    if (code == 0) out = out.green;
    else out = out.red;
    console.log(out);
    if (code != 0) process.exit(code);
    console.log(sprintf('Creating cordova project %s...', project).cyan);
    var arg = process.argv.slice(2);
    arg.unshift('create');
    var cordova = process.platform == 'win32' ? 'cordova.cmd' : 'cordova';
    var cmd2: child.ChildProcess = child.spawn(cordova, arg);
    cmd2.stderr.on('data', function (data: Buffer) {
        console.log(data.toString().yellow);
    });
    cmd2.on('exit', function (code: number) {
        var out: string = sprintf('Creating cordova project completed with code %d.', code);
        if (code == 0) out = out.green;
        else out = out.red;
        console.log(out);
        if (code != 0) process.exit(code);
        console.log(sprintf('Installing local modules for project %s...', project).cyan);
        var cmd3: child.ChildProcess = child.spawn(npm, sprintf('install --prefix %s --save-dev mkdirp rimraf gulp https://github.com/kristoftorfs/gulp-html-tag-include.git gulp-typescript gulp-concat-css gulp-html-tag-include gulp-htmlmin gulp-less gulp-minify-css gulp-uglify main-bower-files phonegap', project).split(' '));
        cmd3.stderr.on('data', function (data: Buffer) {
            console.log(data.toString().yellow);
        });
        cmd3.on('exit', function (code: number) {
            var out: string = sprintf('Installing local modules for project %s completed with code %d.', project, code);
            if (code == 0) out = out.green;
            else out = out.red;
            console.log(out);
            if (code != 0) process.exit(code);
            console.log(sprintf('Installing workflow into project %s...', project).cyan);
            var www = path.join(project, 'www');
            rm.sync(www);
            ['gulp', 'mkdirp', 'phonegap', 'rimraf'].forEach(function (value: any, index: number, array: any[]) {
                rm.sync(path.join(project, sprintf('%s', value)));
                rm.sync(path.join(project, sprintf('%s.cmd', value)));
            });
            fs.mkdirSync(www, 755);
            ncp('templates', project, function (err: Error) {
                if (err) {
                    console.log(sprintf('Failed installing workflow into project %s...', project).red);
                    console.log(err);
                    process.exit(1);
                } else {
                    console.log(sprintf('Installing workflow into project %s complete.', project).green);
                }
            });
        });
    });
});
