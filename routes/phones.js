const PhoneController = require('../controllers/PhoneController')
let multer = require('multer')
const upload = multer(
	{ 
		dest: 'temp/' ,
		fileFilter : function(req, file, callback) { //file filter
			if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
				req.fileValidationError = 'Error occured while uploading file. Please upload only excel (.xlsx, xls) files'
				return callback(null, false, new Error('Error occured while uploading file. Please upload only excel (.xlsx, xls) files'))
			}
			callback(null, true)
		}
	}
)

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