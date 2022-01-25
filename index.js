const express = require('express')
const hataYakalayici = require('./middleware/hataMiddleware')
require('./db/dbConnection')
const hataMiddleware = require('./middleware/hataMiddleware')
const jwt = require('jsonwebtoken')

//ROUTES
const userRouter = require('./router/userRouter')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/users', userRouter)

app.get('/', (req, res) => {
    res.json({'mesaj':'hoş geldiniz'})
})

app.use(hataMiddleware)


app.listen(3000, () => {
    console.log("3000 portundan server ayaklandırıldı");
})