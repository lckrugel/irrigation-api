import type IrrigationRepositoryContract from '#contracts/repositories/irrigation_repository'
import PivotRepositoryContract from '#contracts/repositories/pivot_repository'
import { CreateIrrigationDTO, IrrigationResponseDTO } from '#dtos/irrigation_dtos'
import HttpException from '#exceptions/http_exception'
import MemoryIrrigationRepository from '#repositories/memory/irrigation_respository'
import MemoryPivotRepository from '#repositories/memory/pivot_repository'
import logger from '@adonisjs/core/services/logger'

export default class IrrigationService {
  constructor(
    private irrigationRepository: IrrigationRepositoryContract = MemoryIrrigationRepository,
    private pivotRepository: PivotRepositoryContract = MemoryPivotRepository
  ) {}

  async getAll(userId: string): Promise<IrrigationResponseDTO[]> {
    const irrigations = await this.irrigationRepository.findAll()

    return irrigations
      .filter((irrigation) => irrigation.userId === userId)
      .map((irrigation) => irrigation.serialize())
  }

  async create(data: CreateIrrigationDTO): Promise<IrrigationResponseDTO> {
    const pivot = await this.pivotRepository.findById(data.pivotId)
    if (!pivot) {
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (pivot.userId !== data.userId) {
      logger.warn(
        `Usuário ${data.userId} tentou criar irrigação para pivô ${data.pivotId} que não pertence a ele`
      )
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    const irrigation = await this.irrigationRepository.create(data)
    return irrigation.serialize()
  }

  async getByID(id: string, userId: string): Promise<IrrigationResponseDTO> {
    const irrigation = await this.irrigationRepository.findById(id)
    if (!irrigation) {
      throw new HttpException('Irrigação não encontrada', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (irrigation.userId !== userId) {
      logger.warn(`Usuário ${userId} tentou acessar irrigação ${id} que não pertence a ele`)
      throw new HttpException('Irrigação não encontrada', 404, 'E_ROW_NOT_FOUND')
    }
    return irrigation.serialize()
  }

  async delete(id: string, userId: string): Promise<void> {
    const irrigation = await this.irrigationRepository.findById(id)
    if (!irrigation) {
      throw new HttpException('Irrigação não encontrada', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (irrigation.userId !== userId) {
      logger.warn(`Usuário ${userId} tentou deletar irrigação ${id} que não pertence a ele`)
      throw new HttpException('Irrigação não encontrada', 404, 'E_ROW_NOT_FOUND')
    }
    return this.irrigationRepository.delete(id)
  }
}
