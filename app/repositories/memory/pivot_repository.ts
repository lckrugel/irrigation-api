import PivotRepositoryContract from '#contracts/repositories/pivot_repository'
import { CreatePivotDTO } from '#dtos/pivot_dtos'
import Pivot from '#entities/pivot'

class MemoryPivotRepository implements PivotRepositoryContract {
  private pivots: Pivot[] = []
  private pivotIDs: Set<string> = new Set()

  async create(data: CreatePivotDTO): Promise<Pivot> {
    const newPivot = new Pivot(data)
    if (this.pivotIDs.has(newPivot.id)) {
      throw new Error('Pivot with this ID already exists')
    }
    this.pivots.push(newPivot)
    this.pivotIDs.add(newPivot.id)
    return newPivot
  }

  async findById(id: string): Promise<Pivot | null> {
    return this.pivots.find((pivot) => pivot.id === id) ?? null
  }

  async findAll(): Promise<Pivot[]> {
    return this.pivots
  }

  async update(id: string, data: CreatePivotDTO): Promise<Pivot> {
    const pivotIndex = this.pivots.findIndex((pivot) => pivot.id === id)
    if (pivotIndex === -1) {
      throw new Error('Pivot not found')
    }
    const existingPivot = this.pivots[pivotIndex]
    const updatedPivot = existingPivot.merge({ ...data, updatedAt: new Date().toISOString() })
    this.pivots[pivotIndex] = updatedPivot
    return updatedPivot
  }

  async delete(id: string): Promise<void> {
    this.pivots = this.pivots.filter((pivot) => pivot.id !== id)
    this.pivotIDs.delete(id)
  }

  clear(): void {
    this.pivots = []
    this.pivotIDs.clear()
  }
}

export default new MemoryPivotRepository()
