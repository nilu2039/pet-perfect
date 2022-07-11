import { Request, Response } from "express"
import { prisma } from "../index"

declare module "express-session" {
  interface Session {
    userId: string
  }
}

export const me = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.send(null)
  }

  const user = await prisma.author.findFirst({
    where: { id: req.session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone_no: true,
      createdAt: true,
      updatedAt: true,
      password: false,
    },
  })

  return res.json(user)
}

export const getAllAuthor = async (_: Request, res: Response) => {
  const authors = await prisma.author.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone_no: true,
      _count: {
        select: {
          Books: true,
        },
      },
    },
  })

  res.json(authors)
}

export const getAuthorById = async (req: Request, res: Response) => {
  const authorId = req?.params?.id

  const author = await prisma.author.findFirst({
    where: {
      id: authorId,
    },
    include: {
      Books: {
        include: {
          author: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  res.send(author)
}
