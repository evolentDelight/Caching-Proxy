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

function validateOrigin(origin){// response: {isValid, errorMessage, validatedOrigin(null otherwise)}
  if( origin === undefined || origin === null | String(origin).trim() === ""){// Check if origin is empty
    return{
      isValid : false,
      errorMessage: `Origin is empty. Current input: '${origin}`,
      validatedOrigin : null
    }
  }

  let parsedUrl;

  try{
    parsedUrl = new URL(origin);// check if valid origin via JS's built-in origin constructor
  } catch {
    return {
      isValid : false,
      errorMessage : `Entered origin must be valid. Current input: ${origin}`,
      validatedOrigin : null
    }
  }

  if(parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:"){// Check if origin has correct protocol
    return {
      isValid : false,
      errorMessage : `Origin must start with http:// or https://. Current input: ${origin}`,
      validatedOrigin : null
    }
  }

  if(!parsedUrl.hostname){// Check if origin has a hostname
    return {
      isValid : false,
      errorMessage: `origin must include a hostname`,
      validatedOrigin : null
    }
  }

  return {
    isValid : true,
    errorMessage: null,
    validatedOrigin : parsedUrl.origin
  }
}

export function validate(port, origin){
  let {isValid, errorMessage, validatedPort} = validatePort(port);
  if(!isValid) return {
    isValid : false,
    errorMessage : errorMessage,
    validatedPort : null
  }

  let validatedOrigin = '';
  ({isValid, errorMessage, validatedOrigin} = validateOrigin(origin));
  if(!isValid) return {
    isValid : false,
    errorMessage : errorMessage,
    validatedOrigin : null
  }

  return {
    isValid : true,
    errorMessage : null,
    validatedPort : validatedPort,
    validatedOrigin : validatedOrigin
  }
}