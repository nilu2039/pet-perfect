"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const author_controller_1 = require("../controllers/author.controller");
const router = (0, express_1.Router)();
router.get("/authors", author_controller_1.getAllAuthor);
router.get("/author/:id", author_controller_1.getAuthorById);
router.get("/authors/me", author_controller_1.me);
exports.default = router;
//# sourceMappingURL=author.route.js.map