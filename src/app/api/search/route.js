// app/api/search/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const poetId = searchParams.get("poetId");

  if (!query) {
    return new Response(JSON.stringify([]), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const where = {
      content: {
        contains: query,
        mode: "insensitive",
      },
    };

    if (poetId) {
      where.poetId = poetId;
    }

    const results = await prisma.poem.findMany({
      where,
      include: {
        poet: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 50, // Limit results
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
