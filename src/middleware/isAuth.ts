import { Request, Response, NextFunction } from "express"

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.send("not authenticated")
    throw new Error("not authenticated")
  }
  return next()
}
