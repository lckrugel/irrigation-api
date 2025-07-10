import { IrrigationResponseDTO } from '#dtos/irrigation_dtos'
import AuthService from '#services/auth_service'
import IrrigationService from '#services/irrigation_service'
import PivotService from '#services/pivot_service'
import UserService from '#services/user_service'
import MemoryIrrigationRepository from '#repositories/memory/irrigation_respository'
import { test } from '@japa/runner'

test.group('Irrigation Tests', (group) => {
  let userId: string
  let token: string
  let pivotId: string
  let irrigationService: IrrigationService
  let unownedPivotId: string

  let irrigation: IrrigationResponseDTO

  group.setup(async () => {
    irrigationService = new IrrigationService()
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

    const pivotService = new PivotService()
    const pivot = await pivotService.create({
      description: 'Pivô Teste',
      flowRate: 10.5,
      minApplicationDepth: 5.0,
      userId,
    })
    pivotId = pivot.id

    const user2 = await userService.create({ ...data, email: 'user2@example.com' })
    const pivot2 = await pivotService.create({
      description: 'Pivô Grande de Teste',
      flowRate: 54.33,
      minApplicationDepth: 12,
      userId: user2.id,
    })
    unownedPivotId = pivot2.id
  })

  group.each.setup(async () => {
    irrigation = await irrigationService.create({
      pivotId,
      userId,
      irrigationDate: new Date().toISOString(),
      applicationAmount: 76.4,
    })
    return () => {
      MemoryIrrigationRepository.clear()
    }
  })

  test('Create Irrigation - should fail to create irrigation with invalid fields', async ({
    client,
  }) => {
    const response = await client
      .post('/irrigations')
      .json({})
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Dados inválidos',
      errors: {
        pivotId: ['ID do pivô deve ser um UUID'],
        irrigationDate: ['Data de irrigação deve ser uma data válida'],
        applicationAmount: ['Quantidade de aplicação deve ser um número'],
      },
    })
  })

  test('Create Irrigation - should fail to create a new irrigation with other users pivot', async ({
    client,
  }) => {
    const data = {
      pivotId: unownedPivotId,
      userId,
      irrigationDate: '2024-01-01T14:00:00Z',
      applicationAmount: 50.0,
    }

    const response = await client
      .post('/irrigations')
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Pivô não encontrado',
    })
  })

  test('Create Irrigation - should create a new irrigation', async ({ client }) => {
    const data = {
      pivotId,
      userId,
      irrigationDate: '2024-01-01T14:00:00Z',
      applicationAmount: 50.0,
    }

    const response = await client
      .post('/irrigations')
      .json(data)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Irrigação criada com sucesso',
      data: { ...data },
    })
  })

  test('Get Irrigation - should fail to get irrigation with invalid ID', async ({ client }) => {
    const invalidId = '123'
    const response = await client
      .get(`/irrigations/${invalidId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Irrigação não encontrada',
    })
  })

  test('Get Irrigation - should get an irrigation by ID', async ({ client }) => {
    const response = await client
      .get(`/irrigations/${irrigation.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Irrigação encontrada',
      data: { ...irrigation },
    })
  })

  test('List Irrigations - should list all irrigations for a user', async ({ client, assert }) => {
    const response = await client.get('/irrigations').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Irrigações listadas com sucesso',
      data: [irrigation],
    })
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 1)
  })

  test('Delete Irrigation - should fail to delete irrigation with invalid ID', async ({
    client,
  }) => {
    const response = await client
      .delete(`/irrigations/${unownedPivotId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Irrigação não encontrada',
    })
  })

  test('Delete Irrigation - should delete an irrigation by ID', async ({ client }) => {
    const response = await client
      .delete(`/irrigations/${irrigation.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Irrigação deletada com sucesso',
    })
  })
})
