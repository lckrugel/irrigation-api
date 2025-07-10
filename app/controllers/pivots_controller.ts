import type { HttpContext } from '@adonisjs/core/http'
import HttpException from '#exceptions/http_exception'
import { inject } from '@adonisjs/core'
import PivotService from '#services/pivot_service'
import { z } from 'zod/v4'

@inject()
export default class PivotsController {
  constructor(protected pivotService: PivotService) {}

  async index({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    try {
      const pivots = await this.pivotService.getAll(user.id)
      return response.ok({
        message: 'Pivôs listados com sucesso',
        data: pivots,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao listar pivôs')
      return response.internalServerError({
        message: 'Ocorreu um erro ao listar pivôs',
      })
    }
  }

  async store({ request, response, logger }: HttpContext) {
    const user = request.authUser!

    const rules = z.object({
      description: z.string({ error: 'Descrição deve ser uma string' }).optional(),
      flowRate: z
        .number({ error: 'Taxa de vazão deve ser um número' })
        .positive({ error: 'Taxa de vazão deve ser positiva' }),
      minApplicationDepth: z
        .number({ error: 'Profundidade mínima de aplicação deve ser um número' })
        .positive({ error: 'Profundidade mínima de aplicação deve ser positiva' }),
    })

    const validation = rules.safeParse(request.body())
    if (!validation.success) {
      return response.status(400).json({
        message: 'Dados inválidos',
        errors: z.treeifyError(validation.error),
      })
    }

    const data = validation.data
    try {
      const pivot = await this.pivotService.create({ ...data, userId: user.id })
      return response.created({
        message: 'Pivô criado com sucesso',
        data: pivot,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao criar pivô')
      return response.internalServerError({
        message: 'Ocorreu um erro ao criar pivô',
      })
    }
  }

  async show({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    const pivotId = request.param('id')

    try {
      const pivot = await this.pivotService.getByID(pivotId, user.id)
      return response.ok({
        message: 'Pivô encontrado',
        data: pivot,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao buscar pivô')
      return response.internalServerError({
        message: 'Ocorreu um erro ao buscar pivô',
      })
    }
  }

  async update({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    const pivotId = request.param('id')

    const rules = z.object({
      description: z.string({ error: 'Descrição deve ser uma string' }).nullable().optional(),
      flowRate: z
        .number({ error: 'Taxa de vazão deve ser um número' })
        .positive({ error: 'Taxa de vazão deve ser positiva' })
        .optional(),
      minApplicationDepth: z
        .number({ error: 'Profundidade mínima de aplicação deve ser um número' })
        .positive({ error: 'Profundidade mínima de aplicação deve ser positiva' })
        .optional(),
    })

    const validation = rules.safeParse(request.body())
    if (!validation.success) {
      return response.status(400).json({
        message: 'Dados inválidos',
        errors: z.treeifyError(validation.error),
      })
    }

    const data = validation.data
    try {
      const pivot = await this.pivotService.update(pivotId, data, user.id)
      return response.ok({
        message: 'Pivô atualizado com sucesso',
        data: pivot,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao atualizar pivô')
      return response.internalServerError({
        message: 'Ocorreu um erro ao atualizar pivô',
      })
    }
  }

  async destroy({ request, response, logger }: HttpContext) {
    const user = request.authUser!
    const pivotId = request.param('id')

    try {
      await this.pivotService.delete(pivotId, user.id)
      return response.ok({
        message: 'Pivô deletado com sucesso',
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao deletar pivô')
      return response.internalServerError({
        message: 'Ocorreu um erro ao deletar pivô',
      })
    }
  }
}
