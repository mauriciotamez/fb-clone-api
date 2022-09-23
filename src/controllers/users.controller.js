const { PrismaClient } = require('@prisma/client')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const { AppError } = require('../utils/appError')

/* Instantiate prisma client to make queries to our database */
const prisma = new PrismaClient()

// ------------------------------------------------------------------------------------------------

exports.createNewUser = async (req, res, next) => {
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

    /* Send the response with an 201 HTTP CODE in case of a successful POST request */
    res.status(200).json({
      status: 'success',
      data: { user }
    })
  } catch (error) {
    console.log(error)
  }
}
