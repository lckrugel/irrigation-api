import IrrigationRepositoryContract from '#contracts/repositories/irrigation_repository'
import { CreateIrrigationDTO } from '#dtos/irrigation_dtos'
import Irrigation from '#entities/irrigation'

class MemoryIrrigationRepository implements IrrigationRepositoryContract {
  private irrigations: Irrigation[] = []
  private irrigationIDs: Set<string> = new Set()

  async create(data: CreateIrrigationDTO): Promise<Irrigation> {
    const newIrrigation = new Irrigation(data)
    if (this.irrigationIDs.has(newIrrigation.id)) {
      throw new Error('Irrigation with this ID already exists')
    }
    this.irrigations.push(newIrrigation)
    this.irrigationIDs.add(newIrrigation.id)
    return newIrrigation
  }

  async findById(id: string): Promise<Irrigation | null> {
    return this.irrigations.find((irrigation) => irrigation.id === id) ?? null
  }

  async findAll(): Promise<Irrigation[]> {
    return this.irrigations
  }

  async delete(id: string): Promise<void> {
    this.irrigations = this.irrigations.filter((irr) => irr.id !== id)
    this.irrigationIDs.delete(id)
  }
}

export default new MemoryIrrigationRepository()
