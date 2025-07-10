import type PivotRepositoryContract from '#contracts/repositories/pivot_repository'
import { CreatePivotDTO, PivotResponseDTO, UpdatePivotDTO } from '#dtos/pivot_dtos'
import HttpException from '#exceptions/http_exception'
import MemoryPivotRepository from '#repositories/memory/pivot_repository'
import logger from '@adonisjs/core/services/logger'

export default class PivotService {
  constructor(private pivotRepository: PivotRepositoryContract = MemoryPivotRepository) {}

  async getAll(userId: string): Promise<PivotResponseDTO[]> {
    const pivots = await this.pivotRepository.findAll()
    return pivots.filter((pivot) => pivot.userId === userId).map((pivot) => pivot.serialize())
  }

  async create(data: CreatePivotDTO): Promise<PivotResponseDTO> {
    const pivot = await this.pivotRepository.create(data)
    return pivot.serialize()
  }

  async getByID(id: string, userId: string): Promise<PivotResponseDTO> {
    const pivot = await this.pivotRepository.findById(id)
    if (!pivot) {
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (pivot.userId !== userId) {
      logger.warn(`Usuário ${userId} tentou acessar pivô ${id} que não pertence a ele`)
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    return pivot.serialize()
  }

  async update(id: string, data: UpdatePivotDTO, userId: string): Promise<PivotResponseDTO> {
    let pivot = await this.pivotRepository.findById(id)
    if (!pivot) {
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (pivot.userId !== userId) {
      logger.warn(`Usuário ${userId} tentou atualizar pivô ${id} que não pertence a ele`)
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    pivot = await this.pivotRepository.update(id, data)
    return pivot.serialize()
  }

  async delete(id: string, userId: string): Promise<void> {
    const pivot = await this.pivotRepository.findById(id)
    if (!pivot) {
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    // Retorna erro genérico, mas loga o erro no servidor
    if (pivot.userId !== userId) {
      logger.warn(`Usuário ${userId} tentou deletar pivô ${id} que não pertence a ele`)
      throw new HttpException('Pivô não encontrado', 404, 'E_ROW_NOT_FOUND')
    }
    return this.pivotRepository.delete(id)
  }
}
