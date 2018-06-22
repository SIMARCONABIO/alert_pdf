const express = require('express')
const router = express.Router()
const pdf= require('../controller/pdf.js')

router.get('/:zona/:DD/:MM/:YYYY', pdf.get)



module.exports = router
