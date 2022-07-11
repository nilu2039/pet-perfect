"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorById = exports.getAllAuthor = exports.me = void 0;
const index_1 = require("../index");
const me = async (req, res) => {
    if (!req.session.userId) {
        return res.send(null);
    }
    const user = await index_1.prisma.author.findFirst({
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
    });
    return res.json(user);
};
exports.me = me;
const getAllAuthor = async (_, res) => {
    const authors = await index_1.prisma.author.findMany({
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
    });
    res.json(authors);
};
exports.getAllAuthor = getAllAuthor;
const getAuthorById = async (req, res) => {
    var _a;
    const authorId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    const author = await index_1.prisma.author.findFirst({
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
    });
    res.send(author);
};
exports.getAuthorById = getAuthorById;
//# sourceMappingURL=author.controller.js.map