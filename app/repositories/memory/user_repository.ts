import UserRepositoryContract from '#contracts/repositories/user_repository'
import { CreateUserDTO, UpdateUserDTO } from '#dtos/user_dtos'
import User from '#entities/user'

class MemoryUserRepository implements UserRepositoryContract {
  private users: User[] = []
  private userIDs: Set<string> = new Set()
  private userEmails: Set<string> = new Set()

  async create(data: CreateUserDTO): Promise<User> {
    const newUser = new User(data)

    if (this.userIDs.has(newUser.id)) {
      throw new Error('User with this ID already exists')
    }
    if (this.userEmails.has(newUser.email)) {
      throw new Error('User with this email already exists')
    }
    this.users.push(newUser)
    this.userIDs.add(newUser.id)
    this.userEmails.add(newUser.email)

    return newUser
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findAll(): Promise<User[]> {
    return this.users
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    const existingUser = this.users[userIndex]
    if (data.email && this.userEmails.has(data.email) && data.email !== existingUser.email) {
      throw new Error('Email already exists')
    }

    const updatedUser = existingUser.merge({ ...data, updatedAt: new Date().toISOString() })
    this.users[userIndex] = updatedUser
    return updatedUser
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id)
    this.userIDs.delete(id)
    this.userEmails.delete(this.users.find((user) => user.id === id)?.email ?? '')
  }
}

export default new MemoryUserRepository()
