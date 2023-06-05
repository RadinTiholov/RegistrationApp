const HTTPServer = require('./httpServer');
const { PORT } = require('./common/constants');

const server = new HTTPServer();

server.post('/api/users/register', (req, res) => {
    const user = JSON.parse(req.body);
    // Perform user registration logic with the provided user data
    console.log(user);
    // Respond with a success message
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User registered successfully!' }));
});

server.put('/api/users/:id', (req, res) => {

});

server.delete('/api/users/:id', (req, res) => {
    
});

server.start(PORT);
