import User from '#entities/user'

declare module '@adonisjs/core/http' {
  interface Request {
    authUser?: User
  }
}
