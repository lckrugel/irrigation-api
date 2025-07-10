import AuthService from '#services/auth_service'
import UserService from '#services/user_service'
import MemoryPivotRepository from '#repositories/memory/pivot_repository'
import { test } from '@japa/runner'
import PivotService from '#services/pivot_service'
import { PivotResponseDTO } from '#dtos/pivot_dtos'

test.group('Pivot tests', (group) => {
  let userId: string
  let token: string
  let pivotService: PivotService

  let pivot: PivotResponseDTO

  group.setup(async () => {
    pivotService = new PivotService()
    const userService = new UserService()
    const data = {
      email: 'user@example.com',
      password: 'password123',
      name: 'Test User',
    }
    const user = await userService.create(data)
    userId = user.id

    const authService = new AuthService()
    token = await authService.login(data.email, data.password)
  })

  group.each.setup(async () => {
    pivot = await pivotService.create({
      description: 'Pivô Teste',
      flowRate: 10.5,
      minApplicationDepth: 5.0,
      userId,
    })
    return () => {
      MemoryPivotRepository.clear()
    }
  })

  test('Create Pivot - should fail to create pivot with invalid fields', async ({ client }) => {
    const data = {}

    const response = await client
      .post('/pivots')
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Dados inválidos',
      errors: {
        flowRate: ['Taxa de vazão deve ser um número'],
        minApplicationDepth: ['Profundidade mínima de aplicação deve ser um número'],
      },
    })
  })

  test('Create Pivot - should create a new pivot', async ({ client }) => {
    const data = {
      description: 'Pivô Teste',
      flowRate: 10.5,
      minApplicationDepth: 5.0,
    }

    const response = await client
      .post('/pivots')
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Pivô criado com sucesso',
      data: {
        ...data,
      },
    })
  })

  test('List Pivots - should return a list of pivots', async ({ client, assert }) => {
    const response = await client.get('/pivots').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.lengthOf(response.body().data, 1)
    response.assertBodyContains({
      message: 'Pivôs listados com sucesso',
      data: [pivot],
    })
  })

  test('Get Pivot - should fail to get pivot with invalid ID', async ({ client }) => {
    const invalidId = 'invalid-id'

    const response = await client
      .get(`/pivots/${invalidId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Pivô não encontrado',
      code: 'E_ROW_NOT_FOUND',
    })
  })

  test('Get Pivot - should return a pivot by ID', async ({ client }) => {
    const response = await client
      .get(`/pivots/${pivot.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Pivô encontrado',
      data: pivot,
    })
  })

  test('Update Pivot - should fail to update pivot with invalid fields', async ({ client }) => {
    const data = {
      flowRate: 'invalid',
      minApplicationDepth: -5,
      description: 9999,
    }

    const response = await client
      .put(`/pivots/${pivot.id}`)
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Dados inválidos',
      errors: {
        flowRate: ['Taxa de vazão deve ser um número'],
        minApplicationDepth: ['Profundidade mínima de aplicação deve ser positiva'],
        description: ['Descrição deve ser uma string'],
      },
    })
  })

  test('Update Pivot - should update a pivot', async ({ client }) => {
    const data = {
      flowRate: 33.33,
      minApplicationDepth: 13.4,
      description: 'Pivô Atualizado',
    }

    const response = await client
      .put(`/pivots/${pivot.id}`)
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Pivô atualizado com sucesso',
      data: {
        ...data,
        id: pivot.id,
      },
    })
  })

  test('Delete Pivot - should fail to delete pivot with invalid ID', async ({ client }) => {
    const invalidId = 'invalid-id'

    const response = await client
      .delete(`/pivots/${invalidId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Pivô não encontrado',
      code: 'E_ROW_NOT_FOUND',
    })
  })

  test('Delete Pivot - should delete a pivot', async ({ client }) => {
    const response = await client
      .delete(`/pivots/${pivot.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Pivô deletado com sucesso',
    })
  })
})
