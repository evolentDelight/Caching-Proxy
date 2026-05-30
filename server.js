import http from 'node:http';
import { getFromCache, saveToCache } from './cache.js';

async function handleRequest(req, res, origin){
  const cacheKey = `${req.method} ${req.url}`;

  const cachedResponse = await getFromCache(cacheKey);

  if(cachedResponse){
    sendResponse(res, cachedResponse, "HIT");
    return;
  }

  const originResponse = await fetchFromOrigin(req, origin);

  await saveToCache(cacheKey, originResponse);

  sendResponse(res, originResponse, "MISS");
}

function createForwardHeaders(reqHeaders){
  const headers = {...reqHeaders};

  delete headers.host;
  delete headers['accept-encoding'];

  return headers;
}

async function fetchFromOrigin(req, origin){
  const targetUrl = new URL(req.url, origin);

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: createForwardHeaders(req.headers),
  })

  const arrayBuffer = await response.arrayBuffer();
  const body = Buffer.from(arrayBuffer);

  const headers = {};

  for(const [key, value] of response.headers){
    if( key === "content-encoding" ) continue;
    if( key === "content-length" ) continue;

    headers[key] = value;
  }

  return {
    statusCode: response.status,
    headers,
    body
  }
}

function sendResponse(res, responseData, cacheStatus){
  res.statusCode = responseData.statusCode;

  for( const [key, value] of Object.entries(responseData.headers)){
    res.setHeader(key, value);
  }

  res.setHeader("X-Cache", cacheStatus);

  res.end(responseData.body);
}

export function startServer(port, origin){
  const server = http.createServer(async (req, res) =>{
    if( req.method !== 'GET' ){//If the request isn't GET, reject request
      res.statusCode = 405;
      res.setHeader("Allow", "GET");
      res.setHeader("Content-Type", "text/plain")
      res.end("Only GET requests are supported by this caching proxy");
      return;
    }

    try{
      await handleRequest(req, res, origin);
    } catch(error){
      res.statusCode = 500;
      res.end(`Proxy server error: ${error}`);
    }
  })

  server.listen(port, () => {
    console.log(`Caching proxy server running on port ${port}`);
    console.log(`Forwarding requests to ${origin}`);
  })
}