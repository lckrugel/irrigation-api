import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthMiddleware {
  constructor(protected authService: AuthService) {}

  async handle({ request, response }: HttpContext, next: NextFn) {
    const authHeader = request.header('authorization')
    if (!authHeader) {
      return response.unauthorized({
        message: 'Token de acesso não fornecido',
      })
    }

    const [bearer, token] = authHeader.split(' ')
    if (bearer !== 'Bearer' || !token) {
      return response.unauthorized({
        message: 'Formato de token inválido',
      })
    }

    const user = await this.authService.getAuthUser(token)
    if (!user) {
      return response.unauthorized({
        message: 'Token inválido ou expirado',
      })
    }
    request.authUser = user

    await next()
  }
}
