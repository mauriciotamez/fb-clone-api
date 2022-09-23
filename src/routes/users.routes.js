const express = require('express')
const router = express.Router()

const { createNewUser } = require('../controllers/users.controller')

router.post('/', createNewUser)

module.exports = { usersRouter: router }
