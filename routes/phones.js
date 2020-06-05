const PhoneController = require('../controllers/PhoneController')
let multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports.setup = (app) => {
	app.post(
		'/upload',
		[upload.single('products')],
		PhoneController.upload
	)
	app.get('/buy/search', PhoneController.searchBuy)
	app.get('/sell/search', PhoneController.searchSell)
	app.get('/phones/buy', PhoneController.getBuyRequest)
	app.get('/phones/sell', PhoneController.getSellRequest)
}