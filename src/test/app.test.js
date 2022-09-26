const request = require('supertest')
const { app } = require('../../app')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

/* This is our prisma function that sends the query to delete all records on the DB */
const deleteDbEntries = async () => {
  const deleteUsersTable = prisma.users.deleteMany()
  await prisma.$transaction([deleteUsersTable])
}

describe('POST /users', () => {
  describe('given a name, password, email, birthday and address', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).post('/api/v1/users').send({
        name: 'Test data',
        password: 'testdata',
        email: 'testdata@test.com',
        birthday: '2000/01/01',
        address: 'test'
      })
      expect(response.statusCode).toBe(200)
    })
  })
})

/* Delete our data after the tests, this tests must run on a test DB */
afterAll(async () => {
  await deleteDbEntries()
})
