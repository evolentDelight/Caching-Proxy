#!/usr/bin/env node

import { program } from 'commander';
import { validate } from './validate.js'
import { startServer } from './server.js';

program
  .name('caching-proxy')
  .description('CLI program to cache responses from other servers')
  .version('0.0.1');

program
  .option('-p, --port <number>', 'port on which the caching proxy server will run')
  .option('-o, --origin <origin>', 'origin of the server to which the requests will be forwarded to')
  .option('-c, --clear-cache', 'Clear the cache')
  .action((options) =>{
    let port = options.port;
    let origin = options.origin;

    if(options.clearCache){
      console.log('clear cache requested')
      return;
    }

    if( !port || !origin ){
      program.error("Missing required options: --port and --origin are required unless --clear-cache is used")
    }

    //Validate Port and Origin Input
    let { isValid, errorMessage, validatedPort, validatedOrigin } = validate(port, origin);
    if(!isValid) program.error(errorMessage);

    // Start Server
    startServer(validatedPort, validatedOrigin);
  })

function errorColor(str){
  return `\x1b[31m${str}\x1b[0m`;
}

program.configureOutput({
  writeErr: (str) => {
    process.stderr.write(`${errorColor(`[ERROR] :`)} ${str}`)
  }
})

program.parse();