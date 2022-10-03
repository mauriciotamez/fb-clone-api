const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')

/* Utils */
const { upload } = require('../utils/multer')

router.post('/', upload.single('postImg'), usersController.createUser)
router.patch('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)

module.exports = { usersRouter: router }
