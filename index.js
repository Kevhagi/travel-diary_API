require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./src/routes')

const app = express()

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

app.get('/', function (req, res) {
    res.send({
        message: 'Hello World',
    });
});

app.listen(port, ()=>console.log(`Server jalan di PORT ${port}`))