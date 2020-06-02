const mongoose = require('mongoose')

const SellRequestSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	storage: {
		type: String,
		required: true
	},
	grade: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		default: false
	}
}, {
	timestamps: true
})

const sell = mongoose.model('sellRequest', SellRequestSchema)
module.exports = sell