var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const config = require('../utilities/config');

function getStudents(req, res) {
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
            var result = "";
            let arr = [];
            request.on('row', function(columns) {
                let obj = {

                }
                console.log(columns);
                columns.forEach(function(column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        result += column.value + " ";
                        column.metadata.colName
                        obj[column.metadata.colName] = column.value;
                    }
                });
                arr.push(obj);
                console.log(result);
                console.log(arr);
                result = "";
                res.send(arr).end();
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

}

function deleteStudent(req, res) {

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