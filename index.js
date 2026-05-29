#!/usr/bin/env node

import { program } from 'commander';

function parsePort(port){
  return `From parsePort function ` + port
}

function parseURL(url){
  return 'From parseURL function ' + url
}

program
  .name('caching-proxy')
  .description('CLI program to cache responses from other servers')
  .version('0.0.1');

program
  .option('-p, --port <number>', 'port on which the caching proxy server will run', parsePort)
  .option('-o, --origin <url>', 'URL of the server to which the requests will be forwarded to', parseURL)
  .option('-c, --clear-cache', 'Clear the cache')
  .action((options) =>{
    if(options.clearCache){
      console.log('clear cache requested')
      return;
    }

    if( !options.port || !options.origin ){
      program.error("Missing required options: --port and --origin are required unless --clear-cache is used")
    }

    console.log(options.port)
    console.log(options.origin)
  })

program.parse();