import { CreateUserDTO, UpdateUserDTO } from '#dtos/user_dtos'
import User from '#entities/user'

interface UserRepositoryContract {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  delete(id: string): Promise<void>
}

export default UserRepositoryContract
