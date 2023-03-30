import { SearchGynsUseCase } from './search-gyms'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let SearchGymsRepository: InMemoryGymRepository
let sut: SearchGynsUseCase

describe('Search Gyns use case', () => {
  beforeEach(async () => {
    SearchGymsRepository = new InMemoryGymRepository()
    sut = new SearchGynsUseCase(SearchGymsRepository)
  })

  it('shold be able to list gyns', async () => {
    await SearchGymsRepository.create({
      title: 'Biblia de estudo',
      description: null,
      phone: null,
      latitude: -30.0513403,
      longitude: -51.1430101,
    })

    await SearchGymsRepository.create({
      title: 'Cavaco',
      description: null,
      phone: null,
      latitude: -25.1387521,
      longitude: -50.2092778,
    })

    const { gyms } = await sut.execute({
      searchTitle: 'Biblia',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Biblia de estudo' }),
    ])
  })

  it('shold be able list paginate gyn search', async () => {
    for (let i = 1; i <= 22; i++) {
      await SearchGymsRepository.create({
        title: `Biblia Gym-${i}`,
        description: null,
        phone: null,
        latitude: -25.1387521,
        longitude: -50.2092778,
      })
    }

    const { gyms } = await sut.execute({
      searchTitle: 'Biblia',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Biblia Gym-21' }),
      expect.objectContaining({ title: 'Biblia Gym-22' }),
    ])
  })
})
