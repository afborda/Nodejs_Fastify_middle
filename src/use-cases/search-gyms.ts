import { Gym } from '@prisma/client'

import { GymRepository } from '@/repositories/gyms-repository'

interface SearchGynsUseCaseRequest {
  searchTitle: string
  page: number
}

interface SearchGynsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGynsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    searchTitle,
    page,
  }: SearchGynsUseCaseRequest): Promise<SearchGynsUseCaseResponse> {
    const gyms = await this.gymRepository.searchManyByTitle(searchTitle, page)
    return { gyms }
  }
}
