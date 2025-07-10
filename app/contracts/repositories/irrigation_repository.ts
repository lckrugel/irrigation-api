import { CreateIrrigationDTO } from '#dtos/irrigation_dtos'
import Irrigation from '#entities/irrigation'

interface IrrigationRepositoryContract {
  findAll(): Promise<Irrigation[]>
  findById(id: string): Promise<Irrigation | null>
  create(data: CreateIrrigationDTO): Promise<Irrigation>
  delete(id: string): Promise<void>
}

export default IrrigationRepositoryContract
