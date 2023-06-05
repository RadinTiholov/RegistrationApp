const http = require('http');

class HTTPServer {
    constructor() {
        this.routes = [];
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(request, response) {
        const { url, method } = request;

        // Parse request body
        let requestBody = '';
        request.on('data', (chunk) => {
            requestBody += chunk;
        });

        request.on('end', () => {
            request.body = requestBody;

            let routeFound = false;

            for (const { path, method: routeMethod, handler } of this.routes) {
                if (path === url && routeMethod === method) {
                    handler(request, response);
                    routeFound = true;
                    break;
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