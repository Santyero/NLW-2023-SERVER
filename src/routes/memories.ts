import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

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
    const paramShemas = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramShemas.parse(req.params)
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    return memory
  })

  app.post('/', async (req, res) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, isPublic } = bodySchema.parse(req.body)
    return await prisma.memory.create({
      data: {
        content,
        isPublic,
        userId: req.user.sub,
      },
    })
  })

  app.put('/:id', async (req, res) => {
    const paramShemas = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramShemas.parse(req.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, coverUrl, isPublic } = bodySchema.parse(req.body)
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    return await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })
  })

  app.delete('/:id', async (req, res) => {
    const paramShemas = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramShemas.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== req.user.sub) {
      return res.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
