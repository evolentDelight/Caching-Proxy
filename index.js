#!/usr/bin/env node

import { program } from 'commander';

function validatePort(port){// response: {isValid, errorMessage, validatedPort(null otherwise)}
  if( port === undefined || port === null || String(port).trim() === ""){// Check if port is empty
    return {
      isValid : false,
      errorMessage: `Port number is empty. Current input: '${port}'`,
      validatedPort : null
    }
  }

  const number = Number(port);

  if(Number.isNaN(number)){// Check if port is a number
    return {
      isValid : false,
      errorMessage : `Port number must be a number. Current input: '${port}'`,
      validatedPort : null
    }
  }

  if(!Number.isInteger(number))// Check if entered port number is a whole number
    return {
      isValid : false,
      errorMessage : `Entered Port: '${number}' is not a whole number`,
      validatedPort : null
    }

  if(number < 1 || number > 65535)// Check if the port number is within standardized range
    return {
      isValid : false,
      errorMessage : `Port number must be between 1 and 65535. Current input: '${number}'`,
      validatedPort : null
    }

  return {// Port has been validated
    isValid : true,
    errorMessage: null,
    validatedPort : number
  }
}

function validateURL(url){// response: {isValid, errorMessage, Validated-URL-string(null otherwise)}
  if( url === undefined || url === null | String(url).trim() === ""){// Check if URL is empty
    return{
      isValid : false,
      errorMessage: `URL is empty. Current input: '${url}`,
      validatedURL : null
    }
  }

  let parsedUrl;

  try{
    parsedUrl = new URL(url);// check if valid URL via JS's built-in URL constructor
  } catch {
    return {
      isValid : false,
      errorMessage : `Entered URL must be valid. Current input: ${url}`,
      validatedURL : null
    }
  }

  if(parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:"){// Check if URL has correct protocol
    return {
      isValid : false,
      errorMessage : `URL must start with http:// or https://. Current input: ${url}`,
      validatedURL : null
    }
  }

  if(!parsedUrl.hostname){// Check if URL has a hostname
    return {
      isValid : false,
      errorMessage: `URL must include a hostname`,
      validatedURL : null
    }
  }

  return {
    isValid : true,
    errorMessage: null,
    validatedURL : parsedUrl.origin
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

    let {isValid, errorMessage, validatedPort} = validatePort(port)
    if(!isValid) program.error(errorMessage);

    let validatedURL = "";
    ({isValid, errorMessage, validatedURL} = validateURL(url))
    if(!isValid) program.error(errorMessage);

    console.log(validatedPort)
    console.log(validatedURL)
  })

program.parse();