const HTTPServer = require('./httpServer');
const { PORT } = require('./common/constants');
const database = require('./data/database');
const userServices = require('./services/userServices');
const emailService = require('./services/emailService');

async function startServer() {
    const server = new HTTPServer();

    await database.ensureDatabaseAndTables();

    server.post('/api/users/register', handleRegister);
    server.post('/api/users/login', handleLogin);
    server.post('/api/users/re-send-email', handleReSendEmail);
    server.get('/api/users/confirm/:id', handleConfirmation);
    server.get('/api/users', handleRead);
    server.delete('/api/users', handleDelete);
    server.put('/api/users', handleUpdate);

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

async function handleConfirmation(req, res) {
    const userEmail = req.params.id;

    try {
        await emailService.confirm(userEmail);

        sendResponse(res, 200, 'Confirmed successfully!');
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

async function handleReSendEmail(req, res) {
    const user = JSON.parse(req.body);

    try {
        await emailService.sendRegistrationEmail(user.email, user.firstName);

        sendResponse(res, 200, 'Sent successfully!');
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

async function handleRead(req, res){
    try {
        const userAuth = await userServices.validateToken(req.auth);

        const user = await userServices.getUser(userAuth.email);

        sendResponse(res, 200, user);
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

async function handleUpdate(req, res) {
    try {
        const userAuth = await userServices.validateToken(req.auth);

        const body = JSON.parse(req.body);

        const user = await userServices.updateUser(userAuth.email, body.firstName, body.lastName);

        sendResponse(res, 200, user);
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

async function handleDelete(req, res) {
    try {
        const userAuth = await userServices.validateToken(req.auth);

        const user = await userServices.deleteUser(userAuth.email);

        sendResponse(res, 200, { message: 'Deleted successfully!' });
    } catch (error) {
        sendResponse(res, 400, { message: 'Something went wrong!' });
    }
}

function sendResponse(res, statusCode, data) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
}

startServer().catch((error) => console.error('An error occurred:', error));
