const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fakePoets = [
  {
    name: "محمدحسین شهریار",
    bio: "شاعر پرآوازه آذربایجانی، خالق حیدربابایه سلام",
    birthDate: new Date("1906-02-02"),
    deathDate: new Date("1988-09-18"),
    region: "تبریز",
    language: "ترکی",
    imageUrl: "https://example.com/shahriar.jpg",
  },
  {
    name: "عمادالدین نسیمی",
    bio: "شاعر و عارف قرن 14 میلادی",
    birthDate: new Date("1369-01-01"),
    deathDate: new Date("1417-01-01"),
    region: "شاماخی",
    language: "ترکی",
    imageUrl: "https://example.com/nesimi.jpg",
  },
  {
    name: "محمود وارغون",
    bio: "شاعر معاصر آذربایجانی",
    birthDate: new Date("1956-05-10"),
    region: "باکو",
    language: "ترکی",
    imageUrl: "https://example.com/varghun.jpg",
  },
];

const fakePoems = [
  {
    title: "حیدر بابایه سلام",
    content:
      "حیدر بابا، ایلدیریملار شاخا سیندیرمیش...\nگونشین آلیب قاچا قاچا گئتمیش...",
    poetName: "محمدحسین شهریار", // Reference by name instead of ID
    audioFiles: [
      {
        url: "https://example.com/heydar-baba.mp3",
        reciter: "استاد شهریار",
        format: "mp3",
        duration: 185,
      },
    ],
    tags: ["حماسی", "محلی"],
  },
  {
    title: "آنا دیلیم",
    content: "آنا دیلیم، گونشیم، چراغیم...\nسندن آیری نئجه یاشاییم؟",
    poetName: "محمود وارغون", // Reference by name instead of ID
    audioFiles: [
      {
        url: "https://example.com/ana-dilim.mp3",
        reciter: "رضا ارحام صدر",
        format: "mp3",
        duration: 210,
      },
    ],
    tags: ["میهنی", "عاشقانه"],
  },
];

const fakeUsers = [
  {
    email: "user1@example.com",
    name: "علی محمدی",
    password: "$2a$10$xJw...", // پسورد هش شده
  },
];

const fakeComments = [
  {
    content: "این شعر رو همیشه دوست داشتم!",
    poemTitle: "حیدر بابایه سلام", // Reference by title instead of ID
    userEmail: "user1@example.com", // Reference by email instead of ID
  },
];

async function main() {
  // حذف داده‌های موجود (با ترتیب معکوس وابستگی‌ها)
  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.audioFile.deleteMany();
  await prisma.poem.deleteMany();
  await prisma.poet.deleteMany();
  await prisma.user.deleteMany();

  // 1. ایجاد کاربران اول
  const createdUsers = [];
  for (const user of fakeUsers) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }

  // 2. ایجاد شاعران
  const createdPoets = [];
  for (const poet of fakePoets) {
    const createdPoet = await prisma.poet.create({ data: poet });
    createdPoets.push(createdPoet);
  }

  // 3. ایجاد اشعار با یافتن شاعر بر اساس نام
  for (const poem of fakePoems) {
    const poet = createdPoets.find((p) => p.name === poem.poetName);
    if (!poet) {
      console.error(`شاعر با نام ${poem.poetName} یافت نشد`);
      continue;
    }

    const createdPoem = await prisma.poem.create({
      data: {
        title: poem.title,
        content: poem.content,
        poet: { connect: { id: poet.id } },
        audioFiles: {
          create: poem.audioFiles,
        },
        tags: {
          connectOrCreate: poem.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    // 4. ایجاد نظرات
    for (const comment of fakeComments.filter(
      (c) => c.poemTitle === poem.title
    )) {
      const user = createdUsers.find((u) => u.email === comment.userEmail);
      if (user) {
        await prisma.comment.create({
          data: {
            content: comment.content,
            poem: { connect: { id: createdPoem.id } },
            user: { connect: { id: user.id } },
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
