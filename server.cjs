const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Custom middleware for pagination
const paginationMiddleware = require('./json-server-middlewares.cjs');

server.use(middlewares);
server.use(paginationMiddleware);
server.use(router);

const port = 9000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
}); 