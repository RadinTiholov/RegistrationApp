const HTTPServer = require('./httpServer');
const { PORT } = require('./common/constants');
const database = require('./data/database');
const userServices = require('./services/userServices');

async function startServer() {
    const server = new HTTPServer();

    await database.ensureDatabaseAndTables();

    server.post('/api/users/register', handleRegister);
    server.post('/api/users/login', handleLogin);
    server.put('/api/users/:id', handleUpdate);
    server.delete('/api/users/:id', handleDelete);

    server.start(PORT);
}

async function handleRegister(req, res) {
    const user = JSON.parse(req.body);

    try {
        var jwt = await userServices.register(user.email, user.firstName, user.lastName, user.password);

        sendResponse(res, 200, {email: user.email, token: jwt});
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

async function handleLogin(req, res) {
    const user = JSON.parse(req.body);

    try {
        var jwt = await userServices.login(user.email, user.password);

        sendResponse(res, 200, {email: user.email, token: jwt});
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

function handleUpdate(req, res) {

}

function handleDelete(req, res) {

}

function sendResponse(res, statusCode, data) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
}

startServer().catch((error) => console.error('An error occurred:', error));
