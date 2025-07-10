import { CreatePivotDTO, UpdatePivotDTO } from '#dtos/pivot_dtos'
import Pivot from '#entities/pivot'

interface PivotRepositoryContract {
  findById(id: string): Promise<Pivot | null>
  findAll(): Promise<Pivot[]>
  create(data: CreatePivotDTO): Promise<Pivot>
  update(id: string, data: UpdatePivotDTO): Promise<Pivot>
  delete(id: string): Promise<void>
}

export default PivotRepositoryContract
