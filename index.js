const express = require("express")
const port = 3000
const app = express()

const cors = require("cors")

const api = require("./api/students")

app.use(express.json())

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/students', (req, res) => {
    try {
        api.getStudents(req, res)
    } catch (error) {
        console.log(error.stack)
    }
})

app.post('/students', (req, res) => {
    try {
        api.insertStudent(req, res)
    } catch (error) {
        console.log(error.stack)
    }
})

app.put('/students/:id', (req, res) => {
    try {
        api.updateStudent(req, res)
    } catch (error) {
        console.log(error.stack)
    }
})

app.delete('/students/:id', (req, res) => {
    try {
        api.deleteStudent(req, res)
    } catch (error) {
        console.log(error.stack)
    }
})
app.listen(port, () => {
    console.log(`Server listning on port no ${port}`)
})