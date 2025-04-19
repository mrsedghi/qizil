import prisma from "../../../../lib/prisma";

// GET برای دریافت لیست شاعران
export async function GET() {
  try {
    const poets = await prisma.poet.findMany({
      select: {
        id: true,
        name: true,
        century: true,
        bio: true,
        imageUrl: true,
        poetUrl: true,
        poemTypes: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(poets);
  } catch (error) {
    console.error("Error fetching poets:", error);
    return Response.json(
      { error: "خطا در دریافت لیست شاعران" },
      { status: 500 }
    );
  }
}

// POST برای ایجاد شاعر جدید
export async function POST(request) {
  try {
    const { name, bio, century, imageUrl, poetUrl } = await request.json();

    // بررسی وجود لینک تکراری
    if (poetUrl) {
      const existingPoet = await prisma.poet.findFirst({
        where: {
          poetUrl: {
            equals: poetUrl,
            mode: "insensitive",
          },
        },
      });

      if (existingPoet) {
        return Response.json(
          { error: "این لینک قبلا استفاده شده است" },
          { status: 400 }
        );
      }
    }

    // ایجاد شاعر جدید
    const poet = await prisma.poet.create({
      data: {
        name,
        bio,
        century,
        imageUrl,
        poetUrl: poetUrl || generateSlug(name),
      },
    });

    return Response.json(poet);
  } catch (error) {
    console.error("Error creating poet:", error);
    return Response.json(
      { error: error.message || "خطا در ایجاد شاعر جدید" },
      { status: 500 }
    );
  }
}

function generateSlug(name) {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}
