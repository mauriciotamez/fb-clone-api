const { PrismaClient } = require('@prisma/client')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const filterObj = require('../utils/filterObj')

const { AppError } = require('../utils/appError')

/* Instantiate prisma client to make queries to our database */
const prisma = new PrismaClient()

// ------------------------------------------------------------------------------------------------

const createNewUser = async (req, res, next) => {
  try {
    /* Get the user data from the body */
    const {
      name,
      email,
      password,
      birthday,
      address,
      jobTitle,
      relationStatus
    } = req.body

    /* If the user does not send the mandatory fields that we require in our schema throw an error
       via our AppError class
    */
    if (!name || !email || !password || !birthday || !address) {
      return next(
        new AppError(
          400,
          'Need to provide a name, email, password, birthday and address, this are mandatory fields.'
        )
      )
    }

    /* Create a salt using bcrypt to hash our password */
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    /*  This function gets the fields from the body in a dynamic way in case the user chose to send optional fields */
    const getBodyFields = (obj) => {
      const newObj = {}
      Object.keys(obj).forEach((el) => {
        newObj[el] = obj[el]
      })
      newObj.password = hashedPassword
      return newObj
    }

    console.log(getBodyFields(req.body))

    /* Create a user using our getBodyFields function and passing req.body as the argument */
    const user = await prisma.users.create({
      data: getBodyFields(req.body),
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
        createdAt: true
      }
    })

    res.status(200).json({
      status: 'success',
      data: { user }
    })
  } catch (error) {
    console.log(error)
  }
}
// ------------------------------------------------------------------------------------------------

const updateUser = async (req, res, next) => {
  try {
    /* Get the id from the params ex. PATCH > https://localhost:4900/api/v1/users/1 > where 1 is the user ID we want to update */
    const { id } = req.params
    const data = filterObj(
      req.body,
      'name',
      'email',
      'password',
      'birthday',
      'address',
      'jobTitle',
      'relationStatus'
    )
    /* Query our database, the where clause checks for the id and status active */
    const user = await prisma.users.updateMany({
      where: { id: Number(id), status: 'active' },
      data: { ...data }
    })
    /* If the user does not exist send a 404 HTTP CODE and a message using our AppError class */
    if (!user) {
      return next(new AppError(404, 'Cannot update user, invalid ID.'))
    }

    res.status(204).json({
      status: 'success',
      data: { user }
    })
  } catch (error) {}
}

module.exports = { createNewUser, updateUser }
