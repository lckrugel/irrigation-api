export type CreateUserDTO = {
  email: string
  name: string
  password: string
}

export type UpdateUserDTO = {
  email?: string
  name?: string
  password?: string
}

export type UserResponseDTO = {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}
