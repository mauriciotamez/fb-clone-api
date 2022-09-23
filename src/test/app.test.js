const request = require('supertest')
const { app } = require('../../app')

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
