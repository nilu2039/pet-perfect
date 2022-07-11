import { Prisma } from "@prisma/client"
import { Request, Response } from "express"
import { prisma } from "../index"

export const getAllBooks = async (req: Request, res: Response) => {
  const cursor = req.query.cursor
  const sortByLikes = req.query.sortByLikes
  const skip = req.query.skip

  let parsedSkip

  if (typeof skip === "string") {
    parsedSkip = parseInt(skip)
  }

  const prismaConf: Prisma.BooksFindManyArgs = {
    select: {
      id: true,
      author: {
        select: {
          name: true,
        },
      },
      likes: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      authorId: false,
    },
  }

  //when only cursor present pagination will be based on createdAt
  if (cursor && !sortByLikes) {
    const books = await prisma.books.findMany({
      ...prismaConf,
      where: { createdAt: { lt: cursor as string } },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    res.status(200).json(books)
  }

  // it will sort by likes in descending order
  else if (sortByLikes) {
    if (!skip) {
      const books = await prisma.books.findMany({
        ...prismaConf,
        orderBy: { likes: "desc" },
        skip: 0,
        take: 5,
      })
      res.json(books)
    } else {
      const books = await prisma.books.findMany({
        ...prismaConf,
        orderBy: { likes: "desc" },
        skip: parsedSkip,
        take: 5,
      })
      res.json(books)
    }
  }
  //will sort by descending order based on createdAt
  else {
    const books = await prisma.books.findMany({
      ...prismaConf,
      orderBy: { createdAt: "desc" },
      take: 5,
    })
    res.json(books)
  }
}

export const likeBooks = async (req: Request, res: Response) => {
  const id = req.params.id

  const user = await prisma.books.findFirst({
    where: {
      id,
    },
  })

  let isAlreadyLiked = false

  user?.authorIds.forEach((i) => {
    if (i.authorId === req.session.userId && i.value === 1) {
      isAlreadyLiked = true
    }
  })

  if (isAlreadyLiked) {
    return res.json({ field: "book", message: "user already liked the book" })
  }

  try {
    const book = await prisma.books.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
        authorIds: {
          push: { authorId: req.session.userId, value: 1 },
        },
      },
    })
    return res.status(200).json(book)
  } catch (error) {
    if (error.code === "P2025") {
      return res.json({
        field: "book",
        message: "no book found with the provided id",
      })
    }
  }
  return res.send(null)
}

export const unlikeBooks = async (req: Request, res: Response) => {
  const id = req.params.id

  const user = await prisma.books.findFirst({
    where: {
      id,
    },
  })

  let isAlreadyUnLiked = false

  user?.authorIds.forEach((i) => {
    if (i.authorId === req.session.userId && i.value === -1) {
      isAlreadyUnLiked = true
    }
  })

  if (isAlreadyUnLiked) {
    return res.json({
      field: "book",
      message: "user already un-liked the book",
    })
  }

  try {
    const book = await prisma.books.update({
      where: { id },
      data: {
        likes: {
          decrement: 1,
        },
        authorIds: {
          push: { authorId: req.session.userId, value: -1 },
        },
      },
    })
    return res.status(200).json(book)
  } catch (error) {
    if (error.code === "P2025") {
      return res.json({
        field: "book",
        message: "no book found with the provided id",
      })
    }
  }
  return res.send(null)
}
