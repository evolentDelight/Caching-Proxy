import fs from 'node:fs/promises';
import path from 'node:path';
import crypto, { verify } from 'node:crypto';

const CACHE_DIR = path.join(process.cwd(), '.cache');

async function verifyCacheDir(){
  await fs.mkdir(CACHE_DIR, { recursive: true});
}

function createCacheHash(key){
  return crypto.createHash('sha256').update(key).digest('hex');
}

function createCacheFilePaths(key){
  const hash = createCacheHash(key);

  return {
    metaPath : path.join(CACHE_DIR, `${hash}.meta.json`),
    bodyPath : path.join(CACHE_DIR, `${hash}.body`)
  }
}

export async function getFromCache(key){
  await verifyCacheDir();

  const { metaPath, bodyPath } = createCacheFilePaths(key);

  try {
    const metaFile = await fs.readFile(metaPath, 'utf8');
    const body = await fs.readFile(bodyPath);

    const metadata = JSON.parse(metaFile);

    return {
      statusCode : metadata.statusCode,
      headers : metadata.headers,
      body
    }
  } catch (error){
    if(error.code === "ENOENT") {// Error NO ENTry
      return null;
    }

    throw error;
  }
}

export async function saveToCache(key, responseData){
  await verifyCacheDir();

  const { metaPath, bodyPath } = createCacheFilePaths(key);

  const metadata = {
    cacheKey : key,
    statusCode : responseData.statusCode,
    headers : responseData.headers,
    createdAt : new Date().toISOString()
  }

  await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf8');
  await fs.writeFile(bodyPath, responseData.body);

}

export async function clearCache(){
  await verifyCacheDir();

  const files = await fs.readdir(CACHE_DIR);

  for( const file of files) {
    if (file.endsWith('.meta.json') || file.endsWith('.body')){
      await fs.rm(path.join(CACHE_DIR, file), {force: true})
    }
  }
}