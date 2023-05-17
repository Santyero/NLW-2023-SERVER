import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { User } from './interfaces/User'

const app = fastify()
const PORT = 3333
const prisma = new PrismaClient()

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log('Server is running on port http://localhost:' + PORT + '/')
  })

app.get('/', (_req, res) => {
  res.send({
    message: 'Server of NLW 2023 🚀',
  })
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.send(users)
})

app.post('/users', async (req: FastifyRequest, res: FastifyReply) => {
  const { name, email, password } = req.body as User

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  })
  res.send(user)
})
