import BaseEntityContract from '#contracts/base_entity'
import { CreatePivotDTO, PivotResponseDTO } from '#dtos/pivot_dtos'
import crypto from 'node:crypto'

class Pivot implements BaseEntityContract<Pivot> {
  id: string
  description: string | null
  flowRate: number
  minApplicationDepth: number
  userId: string
  createdAt: string
  updatedAt: string

  constructor(data: CreatePivotDTO) {
    this.id = crypto.randomUUID()
    this.description = data.description ?? null
    this.flowRate = data.flowRate
    this.minApplicationDepth = data.minApplicationDepth
    this.userId = data.userId
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  serialize(): PivotResponseDTO {
    return {
      id: this.id,
      description: this.description,
      flowRate: this.flowRate,
      minApplicationDepth: this.minApplicationDepth,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  merge(data: Partial<Pivot>): Pivot {
    return Object.assign(this, data) as Pivot
  }
}

export default Pivot
