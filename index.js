const express = require("express")
const port = 3000
const app = express()

const api = require("./api/students")

app.use(express.json())

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

app.listen(port, () => {
    console.log(`Server listning on port no ${port}`)
})