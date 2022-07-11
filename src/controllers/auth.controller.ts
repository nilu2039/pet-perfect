import { hash, verify } from "argon2"
import { Request, Response } from "express"

import { prisma } from "../index"

export const login = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password

  if (!email) {
    return res.json({ field: "email", email: "email should not be empty" })
  }

  if (!(email as string).includes("@")) {
    return res.json({ field: "email", email: "email must contain @" })
  }

  if (!password) {
    return res.json({
      field: "password",
      password: "password should not be empty",
    })
  }

  const user = await prisma.author.findFirst({ where: { email } })

  if (!user) {
    return res.json({ field: "user", message: "no user found" })
  }

  const isPasswordValid = await verify(user.password, password)

  if (!isPasswordValid) {
    return res.json({ field: "user", message: "password didn't match" })
  }

  req.session.userId = user.id

  return res.status(200).json(user)
}

export const register = async (req: Request, res: Response) => {
  const name = req.body.name
  const email = req.body.email
  const phone_no = req.body.phone_no
  const password = req.body.password

  if (!name) {
    return res.json({ field: "name", email: "name should not be empty" })
  }

  if (!email) {
    return res.json({ field: "email", email: "email should not be empty" })
  }

  if (!(email as string).includes("@")) {
    return res.json({ field: "email", email: "email must contain @" })
  }

  if (!password) {
    return res.json({
      field: "password",
      password: "password should not be empty",
    })
  }

  const hashedPassword = await hash(password)

  try {
    const author = await prisma.author.create({
      data: {
        name,
        email,
        phone_no,
        password: hashedPassword,
      },
    })
    req.session.userId = author.id
    return res.json(author)
  } catch (error) {
    if (error.code === "P2002") {
      return res.json({
        field: "user",
        message: "an user with this email already exists",
      })
    }
  }
  return res.send(null)
}

export const logout = async (req: Request, res: Response) => {
  const status = new Promise((resolve) => {
    res?.clearCookie("qid")
    req.session.destroy((err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
  res.send(status)
}
