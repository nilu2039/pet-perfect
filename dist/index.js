"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const author_route_1 = __importDefault(require("./routes/author.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const isAuth_1 = require("./middleware/isAuth");
const createMockData_1 = require("./utils/createMockData");
exports.prisma = new client_1.PrismaClient();
const main = async () => {
    const { REDIS_PORT, REDIS_HOST, REDIS_PASS } = process.env;
    const app = (0, express_1.default)();
    let redis = new ioredis_1.default({
        port: parseInt(REDIS_PORT),
        host: REDIS_HOST,
        password: REDIS_PASS,
    });
    let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        credentials: true,
        origin: "http://localhost:3000",
    }));
    try {
        await exports.prisma.$connect();
    }
    catch (error) {
        console.log(error);
    }
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new RedisStore({ client: redis }),
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        },
    }));
    app.set("trust proxy", "1");
    app.use("/", auth_route_1.default);
    app.use("/", isAuth_1.isAuth);
    app.use("/", author_route_1.default);
    app.use("/", book_route_1.default);
    await exports.prisma.author.deleteMany();
    await exports.prisma.books.deleteMany();
    console.log("inserting mock data");
    for (let i = 0; i < 20; i++) {
        await (0, createMockData_1.generateMockData)(i, "author", exports.prisma);
    }
    for (let i = 0; i < 20; i++) {
        await (0, createMockData_1.generateMockData)(i, "book", exports.prisma);
    }
    console.log("finished inserting mock data");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`server running at port ${PORT}`));
};
main();
//# sourceMappingURL=index.js.map