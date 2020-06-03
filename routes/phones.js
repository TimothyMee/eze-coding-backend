const PhoneController = require('../controllers/PhoneController')
let multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports.setup = (app) => {
	app.post(
		'/upload',
		[upload.single('products')],
		PhoneController.upload
	)
	app.get('/search', PhoneController.search)
}