const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')

router.post('/', usersController.createNewUser)
router.patch('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)

module.exports = { usersRouter: router }
