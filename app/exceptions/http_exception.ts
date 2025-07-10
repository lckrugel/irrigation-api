import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class HttpException extends Exception {
  constructor(message: string, status: number, code?: string) {
    super(message, { status, code: code })
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  async report(error: this, { logger }: HttpContext) {
    if (error.status >= 500) logger.error({ err: error }, 'Unexpected server error')
  }
}
