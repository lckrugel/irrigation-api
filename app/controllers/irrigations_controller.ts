import HttpException from '#exceptions/http_exception'
import IrrigationService from '#services/irrigation_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import z from 'zod/v4'

@inject()
export default class IrrigationsController {
  constructor(protected irrigationService: IrrigationService) {}

  async index({ request, response, logger }: HttpContext) {
    const user = request.authUser!

    try {
      const irrigations = await this.irrigationService.getAll(user.id)
      return response.ok({ message: 'Irrigações listadas com sucesso', data: irrigations })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao listar irrigações')
      return response.internalServerError({
        message: 'Ocorreu um erro ao listar irrigações',
      })
    }
  }

  async show({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    const id = request.param('id')

    try {
      const irrigation = await this.irrigationService.getByID(id, user.id)
      return response.ok({ message: 'Irrigação encontrada', data: irrigation })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao buscar irrigação')
      return response.internalServerError({
        message: 'Ocorreu um erro ao buscar irrigação',
      })
    }
  }

  async store({ request, response, logger }: HttpContext) {
    const user = request.authUser!

    const rules = z.object({
      pivotId: z.uuid({ error: 'ID do pivô deve ser um UUID' }),
      description: z.string({ error: 'Descrição deve ser uma string' }).optional(),
      applicationAmount: z
        .number({ error: 'Quantidade de aplicação deve ser um número' })
        .positive({ error: 'Quantidade de aplicação deve ser positiva' }),
      irrigationDate: z.iso.datetime({ error: 'Data de irrigação deve ser uma data válida' }),
    })
    const validation = rules.safeParse(request.body())
    if (!validation.success) {
      return response.status(400).json({
        message: 'Dados inválidos',
        errors: z.flattenError(validation.error).fieldErrors,
      })
    }

    const data = validation.data
    try {
      const irrigation = await this.irrigationService.create({
        ...data,
        userId: user.id,
      })
      return response.created({
        message: 'Irrigação criada com sucesso',
        data: irrigation,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao criar pivôs')
      return response.internalServerError({
        message: 'Ocorreu um erro ao criar pivôs',
      })
    }
  }

  async destroy({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    const id = request.param('id')

    try {
      await this.irrigationService.delete(id, user.id)
      return response.ok({ message: 'Irrigação deletada com sucesso' })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao deletar irrigação')
      return response.internalServerError({
        message: 'Ocorreu um erro ao deletar irrigação',
      })
    }
  }
}
