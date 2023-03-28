import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { User } from '@prisma/client'
import { UserRepository } from '@/repositories/users-repository'

interface GetUserProfileUseCaseRequenst {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequenst): Promise<GetUserProfileUseCaseResponse> {
    // buscar usuario no banco pelo email
    // comparar senha

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
