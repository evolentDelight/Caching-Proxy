import http from 'node:http';

function startServer(port, origin){
  const server = http.createServer(async (req, res) =>{
    console.log(`${req.method} ${req.url}`);

    res.statusCode = 200;
    res.end("Server is running");
  })

  server.listen(port, () => {
    console.log(`Caching proxy server running on port ${port}`);
    console.log(`Forwarding requests to ${origin}`);
  })
}

export { startServer };