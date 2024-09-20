const prisma = require("../prisma");



const seed = async () => {

const testuser = await prisma.user.create({
  data: {
    name: 'noah',
    email: 'noah@gmail.com',
    stocks: {
      create: [
        {tikr: 'AAPL'},
        {tikr: 'SPY'},
      ],
    },
    reviews: {
      create: [
        {
          content: 'recommend this stock',
          comments: {
            create: [
              { content: 'i agree'},
              { content: 'i disagree'}
            ],
          },
        },
      ],
    },
  },
});
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });