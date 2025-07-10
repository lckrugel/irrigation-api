import type UserRepositoryContract from '#contracts/repositories/user_repository'
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '#dtos/user_dtos'
import HttpException from '#exceptions/http_exception'
import bcrypt from 'bcryptjs'
import MemoryUserRepository from '#repositories/memory/user_repository'

export default class UserService {
  constructor(private userRepository: UserRepositoryContract = MemoryUserRepository) {}

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll()
    return users.map((user) => user.serialize())
  }

  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new HttpException('Email já cadastrado', 400, 'E_DUPLICATE')
    }
    const hash = bcrypt.hashSync(data.password, 10)
    return this.userRepository.create({ ...data, password: hash })
  }

  async getByID(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new HttpException('Usuário não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    return user
  }

  async getByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new HttpException('Usuário não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    return user
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    let user = await this.userRepository.findById(id)
    if (!user) {
      throw new HttpException('Usuário não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    const { password, ...userDTO } = await this.userRepository.update(id, data)
    return userDTO
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new HttpException('Usuário não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    return this.userRepository.delete(id)
  }
}
