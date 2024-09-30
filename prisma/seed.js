const prisma = require("../prisma");
const bcrypt = require("bcrypt");

const seed = async () => {
  const hashedPassword = await bcrypt.hash('test', 10);

  const testuser = await prisma.user.create({
    data: {
      name: 'noah',
      username: 'nowh',
      email: 'noah@gmail.com',
      password: hashedPassword, // Store hashed password
      stocks: {
        create: [
          { tikr: 'AAPL' },
          { tikr: 'SPY' },
        ],
      },
      reviews: {
        create: [
          {
            content: 'recommend this stock',
            comments: {
              create: [
                { content: 'i agree' },
                { content: 'i disagree' },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded user:', testuser);
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });