const mongoose = require('mongoose')

const BuyRequestSchema = mongoose.Schema({
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

const buy = mongoose.model('buyRequest', BuyRequestSchema)
module.exports = buy