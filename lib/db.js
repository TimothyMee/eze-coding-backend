var mongoose = require('mongoose')
const config = require('../config')


mongoose.connect(config.dbURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
	console.log('mongodb connected successfully')
})

mongoose.connection.on('disconnected', () => {
	console.log('mongodb disconnected successfully')
	process.exit(1)
})

mongoose.connection.on('error', () => {
	console.log('an error occured when connecting to the db')
	process.exit(1)
})
