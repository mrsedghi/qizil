// lib/search.js
import prisma from "./prisma";

export async function searchPoetsAndPoems(query) {
  if (!query) return { poets: [], poems: [] };

  const [poets, poems] = await Promise.all([
    prisma.poet.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        poems: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
    prisma.poem.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        poet: true,
        poemType: true,
      },
      take: 20,
    }),
  ]);

  return { poets, poems };
}
