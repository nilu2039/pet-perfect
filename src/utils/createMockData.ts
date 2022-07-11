import { PrismaClient, Prisma } from "@prisma/client"
import { faker } from "@faker-js/faker"

export const generateMockData = async (
  index: number,
  type: "author" | "book",
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  if (type === "author") {
    try {
      if (index === 0) {
        await prisma.author.create({
          data: {
            id: "62cad8b26f4525d05e8a6b89",
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone_no: faker.phone.number("+91 91########"),
            password: faker.internet.password(20),
            createdAt: faker.datatype.datetime(),
          },
        })
      } else {
        await prisma.author.create({
          data: {
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone_no: faker.phone.number("+91 91########"),
            password: faker.internet.password(20),
            createdAt: faker.datatype.datetime(),
          },
        })
      }
    } catch (error) {
      console.log(error)
    }
  } else if (type === "book") {
    try {
      await prisma.books.create({
        data: {
          title: faker.random.words(3),
          likes: parseInt(faker.random.numeric()),
          authorId: "62cad8b26f4525d05e8a6b89",
          createdAt: faker.datatype.datetime(),
        },
      })
      // console.log(book)
    } catch (error) {
      console.log(error)
    }
  }
}
