import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredencialsError } from './errors/invalid-credentials-error'
import { UserRepository } from '@/repositories/users-repository'

interface AuthenticateUseCaseRequenst {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}
export class AuthenticateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequenst): Promise<AuthenticateUseCaseResponse> {
    // buscar usuario no banco pelo email
    // comparar senha

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredencialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredencialsError()
    }
  }
}
