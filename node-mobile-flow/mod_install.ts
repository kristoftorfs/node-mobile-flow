import child = require("child_process");
var exec = child.exec;

var cmd = process.argv.slice(2);
cmd.unshift('npm', 'install');
cmd.push(' --save');

var npm: child.ChildProcess = child.exec(cmd.join(' '));
npm.stdout.pipe(process.stdout);
npm.stderr.pipe(process.stderr);

cmd[0] = 'tsd';
var tsd: child.ChildProcess = child.exec(cmd.join(' '));
tsd.stdout.pipe(process.stdout);
tsd.stderr.pipe(process.stderr);
