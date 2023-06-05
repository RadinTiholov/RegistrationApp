const http = require('http');

class HTTPServer {
    constructor() {
        this.routes = [];
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(request, response) {
        const { url, method, rawHeaders  } = request;

        if (method === 'OPTIONS') {
            // Handle preflight request
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.writeHead(204);
            response.end();
            return;
        }

        // Parse request body
        let requestBody = '';
        request.on('data', (chunk) => {
            requestBody += chunk;
        });

        request.on('end', () => {
            request.body = requestBody;
            request.auth = rawHeaders[rawHeaders.indexOf('Authorization') + 1]

            let routeFound = false;

            for (const { path, method: routeMethod, handler } of this.routes) {
                if (path === url && routeMethod === method) {
                    handler(request, response);
                    routeFound = true;
                    break;
                } else if (path.includes(':id') && routeMethod === method) {
                    const pathParts = path.split('/');
                    const urlParts = url.split('/');

                    if (pathParts.length === urlParts.length) {
                        let params = {};
                        let match = true;

                        for (let i = 0; i < pathParts.length; i++) {
                            if (pathParts[i] !== urlParts[i] && !pathParts[i].startsWith(':')) {
                                match = false;
                                break;
                            } else if (pathParts[i].startsWith(':')) {
                                const paramName = pathParts[i].slice(1);
                                const paramValue = urlParts[i];
                                params[paramName] = paramValue;
                            }
                        }

                        if (match) {
                            request.params = params;
                            handler(request, response);
                            routeFound = true;
                            break;
                        }
                    }
                }
            }

            if (!routeFound) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('404 Not Found');
            }
        });
    }

    get(path, handler) {
        this.routes.push({ path, method: 'GET', handler });
    }

    post(path, handler) {
        this.routes.push({ path, method: 'POST', handler });
    }

    put(path, handler) {
        this.routes.push({ path, method: 'PUT', handler });
    }

    delete(path, handler) {
        this.routes.push({ path, method: 'DELETE', handler });
    }

    start(port) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

module.exports = HTTPServer;
