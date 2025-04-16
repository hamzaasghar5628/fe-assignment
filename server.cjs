const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Custom middleware for pagination
const paginationMiddleware = require('./json-server-middlewares.cjs');

server.use(middlewares);
server.use(paginationMiddleware);
server.use(router);

const port = 9000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
}); 