# Cache Directory

This folder is used by the caching proxy to store cached responses.

Each cached response is stored as two files:

- `<hash>.meta.json` - response metadata, such as status code and headers
- `<hash>.body` - raw response body

Generated cache files are ignored by Git.