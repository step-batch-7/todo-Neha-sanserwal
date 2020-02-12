class App {
  constructor(path) {
    this.filePath = path;
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware });
  }
  serve(req, res) {
    // eslint-disable-next-line no-console
    console.log('url:', req.url, '  ', 'method:', req.method);

    const matchingHandlers = this.routes.filter(route =>
      matchRoute(route, req)
    );
    const next = function(path) {
      const router = matchingHandlers.shift();
      router && router.handler(req, res, path, next);
    };
    next(this.filePath);
  }
}

const matchRoute = function(route, req) {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

module.exports = { App };
