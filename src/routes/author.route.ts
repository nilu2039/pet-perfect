import { Router } from "express"
import {
  getAllAuthor,
  getAuthorById,
  me,
} from "../controllers/author.controller"

const router = Router()

router.get("/authors", getAllAuthor)
router.get("/author/:id", getAuthorById)
router.get("/authors/me", me)

export default router
