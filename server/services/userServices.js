const database = require('../data/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const { JWT_SECRET } = require('../common/constants');

async function register(email, firstName, lastName, password) {
    if (await checkUserExists(email)) {
        throw new Error('User already exists');
    }

    const query = `INSERT INTO Users (Email, FirstName, LastName, HashedPassword, IsValidated) 
                   VALUES (@email, @firstName, @lastName, @hashedPassword, @isValidated);`;

    const hashedPassword = hashPassword(password);

    await database.executeQuery(query, {
        email,
        firstName,
        lastName,
        hashedPassword,
        IsValidated: 0
    });

    await emailService.sendRegistrationEmail(email, firstName);

    return createSession(email);
}

async function login(email, password) {
    if (!await checkUserValidated(email)) {
        throw new Error('User is not validated!');
    }

    const hashedPassword = hashPassword(password);

    const query = `
        SELECT Id, Email, FirstName, LastName, HashedPassword, IsValidated
        FROM Users
        WHERE Email = @email AND HashedPassword = @hashedPassword;
    `;

    const result = await database.executeQuery(query, {
        email,
        hashedPassword
    });
    
    if (result.recordset.length === 0) {
        throw new Error('Invalid email or password');
    }

    return createSession(email);
}


async function checkUserExists(email) {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Email = @email;';
    const result = await database.executeQuery(query, { email });
    return result.recordset[0].count > 0;
}

async function checkUserValidated(email) {
    const query = `SELECT IsValidated as isValidated FROM Users WHERE email = @email;`;
    const result = await database.executeQuery(query, { email });
    return result.recordset[0].isValidated;
}

async function getUser(email) {
    const query = `SELECT FirstName as firstName, LastName as lastName, Email as email FROM Users WHERE email = @email;`;
    const result = await database.executeQuery(query, { email });

    return result.recordset[0];
}

async function deleteUser(email) {
    const query = `DELETE FROM Users WHERE Email = @email;`;
    const result = await database.executeQuery(query, { email });
}

async function updateUser(email, firstName, lastName){
    const query = `
    UPDATE Users
    SET FirstName = @firstName, LastName = @lastName
    WHERE Email = @email`;

    await database.executeQuery(query, { email, firstName, lastName });
}

function createSession(email) {
    const payload = {
        email
    };

    return jwt.sign(payload, JWT_SECRET);
}

function validateToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

function hashPassword(password) {
    const salt = 'asdafasdfasdfsdasdasd';
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'); // Generate the hash

    const hashedPassword = `pbkdf2$1000$${salt}$${hash}`; // Combine the salt and hash

    return hashedPassword;
}

module.exports = {
    register,
    login,
    validateToken,
    getUser,
    deleteUser,
    updateUser
};
