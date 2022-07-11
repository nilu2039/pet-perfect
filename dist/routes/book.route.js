"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const router = (0, express_1.Router)();
router.get("/books", book_controller_1.getAllBooks);
router.put("/books/like/:id", book_controller_1.likeBooks);
router.put("/books/unlike/:id", book_controller_1.unlikeBooks);
exports.default = router;
//# sourceMappingURL=book.route.js.map