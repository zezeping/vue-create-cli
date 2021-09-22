#!/usr/bin/env node
const { Command } = require('commander')

const program = new Command()
program.version('0.0.1', '-v, --version', 'output the current version')

program.command('init <proectName>').alias('new').alias('create')
  .description('初始化一个项目')
  .option('-r, --registry [registry]', 'registry地址，默认：https://registry.npmjs.org/', 'https://registry.npmjs.org/')
  .action(require('./actions/init'))

program.parse()