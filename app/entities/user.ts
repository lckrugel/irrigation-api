import BaseEntityContract from '#contracts/base_entity'
import { CreateUserDTO, UserResponseDTO } from '#dtos/user_dtos'
import crypto from 'node:crypto'

class User implements BaseEntityContract<User> {
  id: string
  email: string
  name: string
  password: string
  createdAt: string
  updatedAt: string

  constructor(data: CreateUserDTO) {
    this.id = crypto.randomUUID()
    this.email = data.email
    this.name = data.name
    this.password = data.password
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  serialize(): UserResponseDTO {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  merge(data: Partial<User>): User {
    return Object.assign(this, data) as User
  }
}

export default User
