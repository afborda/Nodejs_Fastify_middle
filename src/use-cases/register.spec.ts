import { UserAlreadyExistsError } from './errors/user-already-exists.ts'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { expect, describe, it } from 'vitest'
import { compare } from 'bcryptjs'

it('check id it works', () => {
  expect(2 + 2).toBe(4)
})

describe('Register use case', () => {
  it('shold be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Abner Fonseca',
      email: 'abner.borda@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shold hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'abner.borda@gmail.com'

    await registerUseCase.execute({
      name: 'Abner Fonseca',
      email,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Abner Fonseca',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
