import { InvalidCredencialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'Abner Fonseca',
      email: 'abner.fonseca@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'abner.fonseca@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'abner.fonseca@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'Abner Fonseca',
      email: 'abner.fonseca@gmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'abner.fonseca@gmail.com',
        password: '12345666',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })
})
