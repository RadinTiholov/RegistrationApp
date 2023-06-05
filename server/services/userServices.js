const database = require('../data/database');
const crypto = require('crypto');

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
}

async function checkUserExists(email) {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Email = ?;';
    const result = await database.executeQuery(query, [email]);
    return result[0].count > 0;
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'); // Generate the hash

    const hashedPassword = `pbkdf2$1000$${salt}$${hash}`; // Combine the salt and hash

    return hashedPassword;
}

module.exports = {
    register
};
