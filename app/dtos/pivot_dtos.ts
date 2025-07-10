export type CreatePivotDTO = {
  description?: string
  flowRate: number
  minApplicationDepth: number
  userId: string
}

export type UpdatePivotDTO = {
  description?: string | null
  flowRate?: number
  minApplicationDepth?: number
}

export type PivotResponseDTO = {
  id: string
  description: string | null
  flowRate: number
  minApplicationDepth: number
  userId: string
  createdAt: string
  updatedAt: string
}
