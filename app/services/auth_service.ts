import HttpException from '#exceptions/http_exception'
import AuthConfig from '#config/auth'
import type UserRepositoryContract from '#contracts/repositories/user_repository'
import MemoryUserRepository from '#repositories/memory/user_repository'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '#entities/user'

export default class AuthService {
  private secret: string = AuthConfig.jwt.secret
  constructor(private userRepository: UserRepositoryContract = MemoryUserRepository) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new HttpException('Não autorizado', 401, 'E_UNAUTHORIZED')

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new HttpException('Não autorizado', 401, 'E_UNAUTHORIZED')

    const token = jsonwebtoken.sign({ userId: user.id }, this.secret, {
      expiresIn: '7d',
      subject: user.id,
    })

    return token
  }

  async getAuthUser(token: string): Promise<User | null> {
    const userId = this.verifyToken(token)
    if (!userId) return null
    return await this.userRepository.findById(userId)
  }

  verifyToken(token: string): string | null {
    try {
      const decoded = jsonwebtoken.verify(token, AuthConfig.jwt.secret)
      return decoded.sub as string
    } catch {
      return null
    }
  }
}
