require("dotenv").config();

// Create connection to database
var config = {
    server: process.env.SERVER,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER, // update me
            password: process.env.PASSWORD // update me
        }
    },
    options: {
        database: process.env.DATABASE
    }
}

module.exports = config;