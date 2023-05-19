import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.slice(0, 115).concat('...'),
      }
    })
  })

  app.get('/:id', async (req, res) => {
    const { id } = req.params
    const memory = await prisma.memory.findUnique({
      where: {
        id: Number(id),
      },
    })
    res.send(memory)
  })

  app.post('/', async (req, res) => {
    const { title, content } = req.body
    const memory = await prisma.memory.create({
      data: {
        title,
        content,
      },
    })
    res.send(memory)
  })

  app.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, content } = req.body
    const memory = await prisma.memory.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    })
    res.send(memory)
  })

  app.delete('/:id', async (req, res) => {
    const { id } = req.params
    const memory = await prisma.memory.delete({
      where: {
        id: Number(id),
      },
    })
    res.send(memory)
  })
}
