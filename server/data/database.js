const sql = require('mssql');
const { DB_CONNECTION_STRING, DB_NAME } = require('../common/constants');

async function connectToDatabase() {
    try {
        await sql.connect(DB_CONNECTION_STRING);
        console.log('Connected to MS SQL');
    } catch (error) {
        console.log('Error connecting to MS SQL:', error);
    }
}

async function createDatabaseIfNotExists() {
    try {
        const databaseName = DB_NAME;
        const existsQuery = `SELECT COUNT(*) as count FROM sys.databases WHERE name = '${databaseName}'`;
        const result = await executeQuery(existsQuery);

        if (result.recordset[0].count === 0) {
            console.log(`Database '${databaseName}' does not exist. Creating...`);
            const createQuery = `CREATE DATABASE ${databaseName}`;
            await sql.query(createQuery);
            console.log(`Database '${databaseName}' created successfully.`);
        } else {
            console.log(`Database '${databaseName}' already exists.`);
        }
    } catch (error) {
        console.log('Error creating database:', error);
    }
}

async function createTablesIfNotExist() {
    try {
        const tableName = 'Users';
        const existsQuery = `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'`;
        const result = await executeQuery(existsQuery);

        if (result.recordset[0].count === 0) {
            console.log(`Table '${tableName}' does not exist. Creating...`);
            // Replace the following line with the appropriate SQL query to create the table
            const createQuery = `CREATE TABLE Users (
                [Id] INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
                [Email] NVARCHAR(255) UNIQUE NOT NULL,
                [FirstName] NVARCHAR(255) NOT NULL,
                [LastName] NVARCHAR(255) NOT NULL,
                [HashedPassword] NVARCHAR(255) NOT NULL,
				[IsValidated] BIT NOT NULL DEFAULT 0
              );`;

            await executeQuery(createQuery);
            console.log(`Table '${tableName}' created successfully.`);
        } else {
            console.log(`Table '${tableName}' already exists.`);
        }
    } catch (error) {
        console.log('Error creating table:', error);
    }
}

async function ensureDatabaseAndTables() {
    await connectToDatabase();
    await createDatabaseIfNotExists();
    await createTablesIfNotExist();
}

async function executeQuery(query, params) {
    try {
        const request = new sql.Request();
        if (params) {
            Object.keys(params).forEach(key => {
                request.input(key, params[key]);
            });
        }
        const result = await request.query(query);
        return result;
    } catch (error) {
        console.log('Error executing query:', error);
    }
}


async function closeConnection() {
    try {
        await sql.close();
        console.log('Connection closed');
    } catch (error) {
        console.log('Error closing connection:', error);
    }
}

module.exports = {
    connectToDatabase,
    executeQuery,
    closeConnection,
    ensureDatabaseAndTables
};
