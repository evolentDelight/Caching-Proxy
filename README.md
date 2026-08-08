# Caching Proxy

Caching Proxy is a command-line HTTP proxy server built with Node.js that forwards requests to an origin server and caches the responses locally.

When a request is made for the first time, the proxy retrieves the response from the origin server, stores it in the cache, and returns it to the client. Future requests for the same resource can then be served directly from the cache.

The proxy adds an `X-Cache` response header to indicate whether the response came from the origin server or the local cache.

- `X-Cache: MISS` - Response was retrieved from the origin server
- `X-Cache: HIT` - Response was retrieved from the local cache

[Link to the Roadmap Project Description](https://roadmap.sh/projects/caching-server)

# How To Use

## Download NodeJS

This application requires Node.js to run.

## Download the Main Application Files

Clone or download this repository into a suitable directory.

```bash
git clone https://github.com/evolentDelight/Caching-Proxy.git
cd Caching-Proxy
```

## Install Dependencies

Within the application directory, run:

```bash
npm install
```

To make the `caching-proxy` command available from the terminal, run:

```bash
npm link
```

## Run the Application

Start the caching proxy by providing:

- A port for the proxy server
- An origin server where requests will be forwarded

```bash
caching-proxy --port <port> --origin <origin>
```

For example:

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

The proxy server will then run locally on:

```text
http://localhost:3000
```

Requests sent to the local proxy will be forwarded to the configured origin server.

For example:

```bash
curl -i http://localhost:3000/products/1
```

The first request should retrieve the resource from the origin server and include:

```text
X-Cache: MISS
```

Running the same request again should retrieve the cached response and include:

```text
X-Cache: HIT
```

## Clear the Cache

To remove all responses currently stored in the cache:

```bash
caching-proxy --clear-cache
```

After clearing the cache, requesting a previously cached resource again will require the proxy to retrieve it from the origin server.

The response should therefore return:

```text
X-Cache: MISS
```

# Input Validation

The application validates both the entered port and origin before starting the proxy server.

The port must:

- Be a number
- Be a whole number
- Be between ports `1` and `65535`

The origin must:

- Be a valid URL
- Use either `http://` or `https://`
- Include a hostname

For example:

```bash
caching-proxy --port 3000 --origin https://example.com
```

# Supported Requests

The caching proxy currently supports:

```text
GET
```

Other HTTP request methods are rejected with:

```text
405 Method Not Allowed
```

# Cache Storage

Cached responses are stored locally inside the generated:

```text
.cache/
```

directory.

Each cached response contains:

- Response status code
- Response headers
- Time the response was cached
- Response body

Cache entries use a SHA-256 hash generated from the request method and target URL to identify cached resources.

The metadata and response body are stored separately.

Example:

```text
.cache/
├── <hash>.meta.json
└── <hash>.body
```

Please refrain from manually editing files inside the `.cache/` directory. Doing so may cause unexpected behavior when the proxy attempts to retrieve a cached response.

Use:

```bash
caching-proxy --clear-cache
```

instead when the cache needs to be cleared.

# Uninstall the Application

To remove the globally linked `caching-proxy` command:

```bash
npm unlink -g caching-proxy
```

After completion, the project directory can be deleted.

#### Notes

- Cached responses persist between proxy server sessions because they are stored on the local filesystem.
- The cache is automatically created when required.
- Only `GET` requests are currently supported.
- Responses maintain the status code, headers, and body returned by the origin server where applicable.
- The `X-Cache` header identifies whether a response was retrieved from the origin server or cache.