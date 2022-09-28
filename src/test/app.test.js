const request = require('supertest')
const { app } = require('../../app')
const prisma = require('../prisma/prismaClient')
const { randEmail, randFullName } = require('@ngneat/falso')

/* This is our prisma function that sends the query to delete all records on the DB */
const deleteDbEntries = async () => {
  const deleteUsersTable = prisma.users.deleteMany()
  await prisma.$transaction([deleteUsersTable])
}

const generateRandomPayload = () => {
  const payload = {
    name: randFullName(),
    email: randEmail(),
    password: '123456',
    birthday: '2000/01/01',
    address: 'Test',
    jobTitle: 'Full Stack Web Developer'
  }
  return payload
}

describe('POST /users', () => {
  describe('given a name, password, email, birthday and address', () => {
    test('should create a user and respond with a 200 status code', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(generateRandomPayload())
      expect(response.statusCode).toBe(200)
      expect(response.body.data.user).toHaveProperty('name')
      expect(response.body.data.user.password).toBeFalsy()
    })
  })

  describe('given a name to update, or address, email', () => {
    test('should update the user and respond with a 204', async () => {
      const user = await prisma.users.create({ data: generateRandomPayload() })
      const response = await request(app)
        .patch(`/api/v1/users/${user.id}`)
        .send({
          name: 'updated data'
        })
      expect(response.statusCode).toBe(204)
    })
  })

  describe('given an id', () => {
    test('should delete the user with given id, update their status field to deleted and respond with a 200', async () => {
      const user = await prisma.users.create({
        data: generateRandomPayload()
      })
      const response = await request(app).delete(`/api/v1/users/${user.id}`)
      expect(response.statusCode).toBe(200)
    })
  })
})

/* Delete our data after the tests, this tests must run on a test DB */
afterAll(async () => {
  await deleteDbEntries()
})
