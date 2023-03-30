import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface ListUserCheckInHistoryUseCaseRequest {
  userId: string
  page: number
}

interface ListUserCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[]
}
export class ListUserCheckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: ListUserCheckInHistoryUseCaseRequest): Promise<ListUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
