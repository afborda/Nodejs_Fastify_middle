import { UserAlreadyExistsError } from './errors/user-already-exists.ts'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('shold be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Abner Fonseca',
      email: 'abner.borda@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shold hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Abner Fonseca',
      email: 'abner.borda@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'abner.borda@gmail.com'

    await sut.execute({
      name: 'Abner Fonseca',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Abner Fonseca',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
