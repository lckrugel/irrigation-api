import UserService from '#services/user_service'
import MemoryUserRepository from '#repositories/memory/user_repository'
import { test } from '@japa/runner'
import AuthService from '#services/auth_service'

test.group('Auth tests', (group) => {
  group.each.setup(() => {
    return () => {
      MemoryUserRepository.clear()
    }
  })

  test('Register - should fail registration with invalid fields', async ({ client }) => {
    const data = {
      email: 'invalid-email',
    }

    const response = await client.post('/auth/register').json(data)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Dados inválidos',
      errors: {
        email: ['Email inválido'],
        password: ['Senha deve ser uma string'],
        name: ['Nome deve ser uma string'],
      },
    })
  })

  test('Register - should fail registration with duplicated email', async ({ client }) => {
    const data = {
      email: 'example@mail.com',
      password: 'password123',
      name: 'Test User',
    }

    // Cria usuário com o mesmo email
    const userService = new UserService()
    await userService.create({
      email: data.email,
      password: '123456',
      name: 'Another User',
    })

    const response = await client.post('/auth/register').json(data)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Email já cadastrado',
      code: 'E_DUPLICATE',
    })
  })

  test('Register - should register a new user', async ({ client }) => {
    const data = {
      email: 'email@mail.com',
      password: 'password123',
      name: 'Test User',
    }

    const response = await client.post('/auth/register').json(data)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Usuário registrado com sucesso',
      user: {
        email: data.email,
        name: data.name,
      },
    })
  })

  test('Login - should fail login with invalid data', async ({ client }) => {
    const data = {
      email: 'invalid-email',
    }

    const response = await client.post('/auth/login').json(data)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Dados inválidos',
      errors: {
        email: ['Email inválido'],
        password: ['Senha deve ser uma string'],
      },
    })
  })

  test('Login - should fail login with invalid credentials', async ({ client }) => {
    const data = {
      email: 'user@mail.com',
      password: '123456',
    }

    const response = await client.post('/auth/login').json(data)

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Não autorizado',
      code: 'E_UNAUTHORIZED',
    })
  })

  test('Login - should login with valid credentials', async ({ client, assert }) => {
    const data = {
      email: 'user@mail.com',
      password: '123456',
    }
    const userService = new UserService()
    const user = await userService.create({
      email: data.email,
      password: data.password,
      name: 'Test User',
    })

    const response = await client.post('/auth/login').json(data)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Usuário autenticado com sucesso',
      token: response.body().token,
    })

    assert.isString(response.body().token)

    const authService = new AuthService()
    const verifiedUserId = await authService.verifyToken(response.body().token)
    assert.equal(verifiedUserId, user.id)
  })

  test('should fail to access protected route without token', async ({ client }) => {
    const response = await client.get('/pivots')

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Token de acesso não fornecido',
    })
  })
})
