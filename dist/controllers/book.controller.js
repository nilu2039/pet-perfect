"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeBooks = exports.likeBooks = exports.getAllBooks = void 0;
const index_1 = require("../index");
const getAllBooks = async (req, res) => {
    const cursor = req.query.cursor;
    const sortByLikes = req.query.sortByLikes;
    const skip = req.query.skip;
    let parsedSkip;
    if (typeof skip === "string") {
        parsedSkip = parseInt(skip);
    }
    const prismaConf = {
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
    };
    if (cursor && !sortByLikes) {
        const books = await index_1.prisma.books.findMany(Object.assign(Object.assign({}, prismaConf), { where: { createdAt: { lt: cursor } }, orderBy: { createdAt: "desc" }, take: 5 }));
        res.status(200).json(books);
    }
    else if (sortByLikes) {
        if (!skip) {
            const books = await index_1.prisma.books.findMany(Object.assign(Object.assign({}, prismaConf), { orderBy: { likes: "desc" }, skip: 0, take: 5 }));
            res.json(books);
        }
        else {
            const books = await index_1.prisma.books.findMany(Object.assign(Object.assign({}, prismaConf), { orderBy: { likes: "desc" }, skip: parsedSkip, take: 5 }));
            res.json(books);
        }
    }
    else {
        const books = await index_1.prisma.books.findMany(Object.assign(Object.assign({}, prismaConf), { orderBy: { createdAt: "desc" }, take: 5 }));
        res.json(books);
    }
};
exports.getAllBooks = getAllBooks;
const likeBooks = async (req, res) => {
    const id = req.params.id;
    const user = await index_1.prisma.books.findFirst({
        where: {
            id,
        },
    });
    let isAlreadyLiked = false;
    user === null || user === void 0 ? void 0 : user.authorIds.forEach((i) => {
        if (i.authorId === req.session.userId && i.value === 1) {
            isAlreadyLiked = true;
        }
    });
    if (isAlreadyLiked) {
        return res.json({ field: "book", message: "user already liked the book" });
    }
    try {
        const book = await index_1.prisma.books.update({
            where: { id },
            data: {
                likes: {
                    increment: 1,
                },
                authorIds: {
                    push: { authorId: req.session.userId, value: 1 },
                },
            },
        });
        return res.status(200).json(book);
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.json({
                field: "book",
                message: "no book found with the provided id",
            });
        }
    }
    return res.send(null);
};
exports.likeBooks = likeBooks;
const unlikeBooks = async (req, res) => {
    const id = req.params.id;
    const user = await index_1.prisma.books.findFirst({
        where: {
            id,
        },
    });
    let isAlreadyUnLiked = false;
    user === null || user === void 0 ? void 0 : user.authorIds.forEach((i) => {
        if (i.authorId === req.session.userId && i.value === -1) {
            isAlreadyUnLiked = true;
        }
    });
    if (isAlreadyUnLiked) {
        return res.json({
            field: "book",
            message: "user already un-liked the book",
        });
    }
    try {
        const book = await index_1.prisma.books.update({
            where: { id },
            data: {
                likes: {
                    decrement: 1,
                },
                authorIds: {
                    push: { authorId: req.session.userId, value: -1 },
                },
            },
        });
        return res.status(200).json(book);
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.json({
                field: "book",
                message: "no book found with the provided id",
            });
        }
    }
    return res.send(null);
};
exports.unlikeBooks = unlikeBooks;
//# sourceMappingURL=book.controller.js.map