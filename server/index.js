const HTTPServer = require('./httpServer');
const { PORT } = require('./common/constants');
const database = require('./data/database');
const userServices = require('./services/userServices');

async function startServer() {
    const server = new HTTPServer();

    await database.ensureDatabaseAndTables();

    server.post('/api/users/register', async (req, res) => {
        const user = JSON.parse(req.body);

        try {
            await userServices.register(user.email, user.firstName, user.lastName, user.password);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered successfully!' }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Something went wrong!' }));
        }
    });

    server.put('/api/users/:id', (req, res) => {

    });

    server.delete('/api/users/:id', (req, res) => {

    });

    server.start(PORT);
}

startServer().catch((error) => console.error('An error occurred:', error));
