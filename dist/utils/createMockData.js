"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockData = void 0;
const faker_1 = require("@faker-js/faker");
const generateMockData = async (index, type, prisma) => {
    if (type === "author") {
        try {
            if (index === 0) {
                await prisma.author.create({
                    data: {
                        id: "62cad8b26f4525d05e8a6b89",
                        name: faker_1.faker.name.findName(),
                        email: faker_1.faker.internet.email(),
                        phone_no: faker_1.faker.phone.number("+91 91########"),
                        password: faker_1.faker.internet.password(20),
                        createdAt: faker_1.faker.datatype.datetime(),
                    },
                });
            }
            else {
                await prisma.author.create({
                    data: {
                        name: faker_1.faker.name.findName(),
                        email: faker_1.faker.internet.email(),
                        phone_no: faker_1.faker.phone.number("+91 91########"),
                        password: faker_1.faker.internet.password(20),
                        createdAt: faker_1.faker.datatype.datetime(),
                    },
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else if (type === "book") {
        try {
            await prisma.books.create({
                data: {
                    title: faker_1.faker.random.words(3),
                    likes: parseInt(faker_1.faker.random.numeric()),
                    authorId: "62cad8b26f4525d05e8a6b89",
                    createdAt: faker_1.faker.datatype.datetime(),
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.generateMockData = generateMockData;
//# sourceMappingURL=createMockData.js.map