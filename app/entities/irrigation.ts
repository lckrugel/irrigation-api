import BaseEntityContract from '#contracts/base_entity'
import { CreateIrrigationDTO, IrrigationResponseDTO } from '#dtos/irrigation_dtos'
import crypto from 'node:crypto'

class Irrigation implements BaseEntityContract<Irrigation> {
  public id: string
  public pivotId: string
  public applicationAmount: number
  public irrigationDate: string
  public userId: string
  public createdAt: string
  public updatedAt: string

  constructor(data: CreateIrrigationDTO) {
    this.id = crypto.randomUUID()
    this.pivotId = data.pivotId
    this.applicationAmount = data.applicationAmount
    this.irrigationDate = data.irrigationDate
    this.userId = data.userId
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  serialize(): IrrigationResponseDTO {
    return {
      id: this.id,
      pivotId: this.pivotId,
      applicationAmount: this.applicationAmount,
      irrigationDate: this.irrigationDate,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  merge(data: Partial<Irrigation>): Irrigation {
    return Object.assign(this, data) as Irrigation
  }
}

export default Irrigation
