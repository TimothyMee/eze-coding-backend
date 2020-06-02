const PhoneController = require('../controllers/PhoneController')
module.exports.setup = (app) => {
	app.post(
		'/upload',
		[],
		PhoneController.upload
	)
}