"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.register = exports.login = void 0;
const argon2_1 = require("argon2");
const index_1 = require("../index");
const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        return res.json({ field: "email", email: "email should not be empty" });
    }
    if (!email.includes("@")) {
        return res.json({ field: "email", email: "email must contain @" });
    }
    if (!password) {
        return res.json({
            field: "password",
            password: "password should not be empty",
        });
    }
    const user = await index_1.prisma.author.findFirst({ where: { email } });
    if (!user) {
        return res.json({ field: "user", message: "no user found" });
    }
    const isPasswordValid = await (0, argon2_1.verify)(user.password, password);
    if (!isPasswordValid) {
        return res.json({ field: "user", message: "password didn't match" });
    }
    req.session.userId = user.id;
    return res.status(200).json(user);
};
exports.login = login;
const register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    const password = req.body.password;
    if (!name) {
        return res.json({ field: "name", email: "name should not be empty" });
    }
    if (!email) {
        return res.json({ field: "email", email: "email should not be empty" });
    }
    if (!email.includes("@")) {
        return res.json({ field: "email", email: "email must contain @" });
    }
    if (!password) {
        return res.json({
            field: "password",
            password: "password should not be empty",
        });
    }
    const hashedPassword = await (0, argon2_1.hash)(password);
    try {
        const author = await index_1.prisma.author.create({
            data: {
                name,
                email,
                phone_no,
                password: hashedPassword,
            },
        });
        req.session.userId = author.id;
        return res.json(author);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.json({
                field: "user",
                message: "an user with this email already exists",
            });
        }
    }
    return res.send(null);
};
exports.register = register;
const logout = async (req, res) => {
    const status = new Promise((resolve) => {
        res === null || res === void 0 ? void 0 : res.clearCookie("qid");
        req.session.destroy((err) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
    res.send(status);
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map