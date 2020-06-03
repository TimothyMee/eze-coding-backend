const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const config = require('./config')

const api = require('./api')


//establish db connection 
require('./lib/db')

const app = express()

//extract env variables 
const { port } = config

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//home request
app.get('/', (req, res) => {
	res.send('welcome delivey api')
	console.log('started')
})

app.use('/api', api)
app.listen(port, () => {
	console.log(`listening at port ${port}`)
})