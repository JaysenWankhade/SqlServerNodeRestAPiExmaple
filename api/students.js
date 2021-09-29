var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const config = require('../utilities/config');

function getStudents(req, res) {

    //res.send([]).end();
    var connection = new Connection(config);

    connection.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Connection success');
        }
    })

    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            let request = new Request(
                'select * from students;',
                function(err, rowCount, rows) {
                    if (err) {} else {
                        console.log(rowCount + ' row(s) returned');
                    }
                });
            // Print the rows read
            let arr = [];
            request.on('row', function(columns) {
                let obj = {

                }
                columns.forEach(function(column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        column.metadata.colName
                        obj[column.metadata.colName] = column.value;
                    }
                });
                arr.push(obj);
            });

            request.on('requestCompleted', () => {
                res.json(arr).end();
            });
            // Execute SQL statement
            connection.execSql(request);
        }
    });

    connection.on('end', () => {
        console.log('Connection closed');
        connection.close();
    })
}

function insertStudent(req, res) {
    const connection = new Connection(config);

    connection.connect((err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            console.log("Connection Success")
        }
    })

    connection.on('connect', (err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            console.log("i was called")
            let request = new Request(
                `insert into students OUTPUT INSERTED.Id values(@id, @name);`,
                (err, rowCount, rows) => {
                    if (err) {
                        console.log(err.stack)
                        errorHandller(res)
                    }
                    if (rowCount === 1) {
                        res.send({
                            status: "success",
                            id: req.body.id
                        }).end()
                    }
                }
            )

            request.addParameter('id', TYPES.Int, req.body.id);
            request.addParameter('name', TYPES.VarChar, req.body.name);

            connection.execSql(request)
        }
    })

    connection.on('end', () => {
        console.log('Connection closed');
        connection.close();
    })
}

function updateStudent(req, res) {
    const connection = new Connection(config);

    connection.connect((err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            console.log("Connection Success")
        }
    })

    connection.on('connect', (err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            let request = new Request(
                `update students set name=@name where id=@id;`,
                (err, rowCount, rows) => {
                    if (err) {
                        console.log(err.stack)
                        errorHandller(res)
                    }
                    if (rowCount === 1) {
                        res.send({
                            status: "success",
                            id: req.body.id
                        }).end()
                    }
                }
            )

            request.addParameter('id', TYPES.Int, req.params.id);
            request.addParameter('name', TYPES.VarChar, req.body.name);

            connection.execSql(request)
        }
    })

    connection.on('end', () => {
        console.log('Connection closed');
        connection.close();
    })
}

function deleteStudent(req, res) {
    const connection = new Connection(config);

    connection.connect((err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            console.log("Connection Success")
        }
    })

    connection.on('connect', (err) => {
        if (err) {
            console.log(err.stack)
            errorHandller(res)
            throw err;
        } else {
            let request = new Request(
                `delete from students where id=@id;`,
                (err, rowCount, rows) => {
                    if (err) {
                        console.log(err.stack)
                        errorHandller(res)
                    }
                    if (rowCount === 1) {
                        res.send({
                            status: "success",
                            id: req.body.id
                        }).end()
                    }
                }
            )

            request.addParameter('id', TYPES.Int, req.params.id);

            connection.execSql(request)
        }
    })

    connection.on('end', () => {
        console.log('Connection closed');
        connection.close();
    })
}

function errorHandller(res) {
    res.send({
        status: "failed"
    }).end()
}

let api = {}
api.getStudents = getStudents;
api.insertStudent = insertStudent;
api.updateStudent = updateStudent;
api.deleteStudent = deleteStudent;
module.exports = api;