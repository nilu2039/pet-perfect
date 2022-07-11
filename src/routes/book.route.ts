import { Router } from "express"
import {
  getAllBooks,
  likeBooks,
  unlikeBooks,
} from "../controllers/book.controller"

const router = Router()

router.get("/books", getAllBooks)
router.put("/books/like/:id", likeBooks)
router.put("/books/unlike/:id", unlikeBooks)

export default router
