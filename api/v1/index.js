const express = require('express');
var router = express.Router();
const phones = require('../../routes/phones');


router.get('/', (req, res) => {
    res.send('here in v1');
});

//passing the router to the routes files
phones.setup(router);

module.exports = router;
