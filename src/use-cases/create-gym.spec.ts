import { CreateGymUseCase } from './create-gym'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'

let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('shold be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Biblia de estudo',
      description: null,
      phone: null,
      latitude: -30.0513403,
      longitude: -51.1430101,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
