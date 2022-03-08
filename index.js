require('dotenv').config()
const express = require('express')
const router = require('./src/routes')

const app = express()

const port = 5000

app.use(express.json())
app.use('/api/v1/', router)

app.listen(port, ()=>console.log(`Server jalan di PORT ${port}`))