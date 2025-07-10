export type CreateIrrigationDTO = {
  pivotId: string
  applicationAmount: number
  irrigationDate: string
  userId: string
}

export type IrrigationResponseDTO = {
  id: string
  pivotId: string
  applicationAmount: number
  irrigationDate: string
  userId: string
  createdAt: string
  updatedAt: string
}
