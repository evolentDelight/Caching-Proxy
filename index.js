#!/usr/bin/env node

import { program } from 'commander';

function validatePort(port){// response: {isValid, errorMessage, Validated-Port-Number(null otherwise)}
  const number = Number(port);

  if(!Number.isInteger(number)) return {// Check if entered port number is a whole number
    isValid : false,
    errorMessage : `Entered Port: ${number} is not a whole number`,
    port : null
  }

  if(number < 1 || number > 65535) return {
    isValid : false,
    errorMessage : `Port number must be between 1 and 65535. Current input: ${number}`,
    port : null
  }

  return {
    isValid : true,
    errorMessage: null,
    validatedPort : number
  }
}

function validateURL(url){// response: {isValid, errorMessage, Validated-URL-string(null otherwise)}
  return {
    isValid : true,
    errorMessage: null,
    validatedUrl : url
  }
}

program
  .name('caching-proxy')
  .description('CLI program to cache responses from other servers')
  .version('0.0.1');

program
  .option('-p, --port <number>', 'port on which the caching proxy server will run')
  .option('-o, --origin <url>', 'URL of the server to which the requests will be forwarded to')
  .option('-c, --clear-cache', 'Clear the cache')
  .action((options) =>{
    let port = options.port;
    let url = options.origin;

    if(options.clearCache){
      console.log('clear cache requested')
      return;
    }

    if( !port || !url ){
      program.error("Missing required options: --port and --origin are required unless --clear-cache is used")
    }

    let {isValid, errorMessage, validatedPort} = validatePort(options.port)
    if(!isValid) program.error(errorMessage);

    let validatedURL = "";
    ({isValid, errorMessage, validatedURL} = validateURL(options.url))
    if(!isValid) program.error(errorMessage);

    console.log(validatedPort)
    console.log(validatedURL)
  })

program.parse();