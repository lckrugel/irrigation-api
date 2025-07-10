import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import UserService from '#services/user_service'
import HttpException from '#exceptions/http_exception'
import z from 'zod/v4'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected userService: UserService
  ) {}

  async register({ request, response, logger }: HttpContext) {
    const rules = z.object({
      email: z.email({ error: 'Email inválido' }),
      password: z
        .string({ error: 'Senha deve ser uma string' })
        .min(6, { error: 'Senha deve ter pelo menos 6 caracteres' }),
      name: z
        .string({ error: 'Nome deve ser uma string' })
        .min(1, { error: 'Nome deve ter pelo menos 1 caractere' }),
    })

    const validation = rules.safeParse(request.body())
    if (!validation.success) {
      return response.status(400).json({
        message: 'Dados inválidos',
        errors: z.treeifyError(validation.error),
      })
    }

    try {
      const user = await this.userService.create(validation.data)
      return response.created({
        message: 'Usuário registrado com sucesso',
        user: user,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao registrar usuário')
      return response.internalServerError({
        message: 'Ocorreu um erro ao registrar usuário',
      })
    }
  }

  async login({ request, response, logger }: HttpContext) {
    const rules = z.object({
      email: z.email({ error: 'Email inválido' }),
      password: z
        .string({ error: 'Senha deve ser uma string' })
        .min(6, { error: 'Senha deve ter pelo menos 6 caracteres' }),
    })

    const validation = rules.safeParse(request.body())
    if (!validation.success) {
      return response.status(400).json({
        message: 'Dados inválidos',
        errors: z.treeifyError(validation.error),
      })
    }

    try {
      const token = await this.authService.login(validation.data.email, validation.data.password)
      return response.ok({
        message: 'Usuário autenticado com sucesso',
        token,
      })
    } catch (error) {
      if (error instanceof HttpException) throw error
      logger.error({ err: error }, 'Erro ao autenticar usuário')
      return response.internalServerError({
        message: 'Ocorreu um erro ao autenticar usuário',
      })
    }
  }
}
