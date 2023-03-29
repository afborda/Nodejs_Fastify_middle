import { MaxNumberOfCheckInsError } from './errors/max-number-off-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckIn } from '@prisma/client'
import { GymRepository } from '@/repositories/gyms-repository'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
  userLatitute: number
  userLongitute: number
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}
export class CheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymRepository: GymRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitute,
    userLongitute,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitute, longitude: userLongitute },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) throw new MaxNumberOfCheckInsError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
