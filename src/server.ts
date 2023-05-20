import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()
const PORT = 3333

app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes, { prefix: '/memories' })

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log('Server is running on port http://localhost:' + PORT + '/')
  })
