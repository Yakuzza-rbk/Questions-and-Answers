var express = require('express')
var router= express.Router()
var controller=require('../controllers')
router.get('/:id',controller.readQ)
router.put('/:id/updatehelp',controller.Updatehelp)
router.post('/product',controller.addQ)

module.exports = router