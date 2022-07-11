import express from "express"
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"

import authorRoute from "./routes/author.route"
import authRoute from "./routes/auth.route"
import bookRoute from "./routes/book.route"
import { isAuth } from "./middleware/isAuth"

import { generateMockData } from "./utils/createMockData"

export const prisma = new PrismaClient()

const main = async () => {
  const { REDIS_PORT, REDIS_HOST, REDIS_PASS } = process.env

  const app = express()
  let redis = new Redis({
    port: parseInt(REDIS_PORT as string),
    host: REDIS_HOST,
    password: REDIS_PASS,
  })
  let RedisStore = connectRedis(session)

  app.use(express.json())

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  )

  try {
    await prisma.$connect()
  } catch (error) {
    console.log(error)
  }

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis }),
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET as string,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
    })
  )

  app.set("trust proxy", "1")

  app.use("/", authRoute)

  app.use("/", isAuth)

  app.use("/", authorRoute)
  app.use("/", bookRoute)

  await prisma.author.deleteMany()
  await prisma.books.deleteMany()

  console.log("inserting mock data")

  for (let i = 0; i < 20; i++) {
    await generateMockData(i, "author", prisma)
  }

  for (let i = 0; i < 20; i++) {
    await generateMockData(i, "book", prisma)
  }

  console.log("finished inserting mock data")

  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => console.log(`server running at port ${PORT}`))
}

main()
