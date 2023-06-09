import { randomUUID } from 'node:crypto'
import { GymRepository } from './../gyms-repository'
import { Gym, Prisma } from '@prisma/client'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }
    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchManyByTitle(searchTitle: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(searchTitle))
      .slice((page - 1) * 20, page * 20)
  }
}
