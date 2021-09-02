#!/usr/bin/env node
const { Command } = require('commander')

const program = new Command()
program.version('0.0.1', '-v, --version', 'output the current version')

program.command('init <proectName>').action(require('./actions/init'))

program.parse()