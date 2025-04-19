import prisma from "../../../../../lib/prisma";

export async function POST(request) {
  try {
    const { name, description, typeUrl, poetId } = await request.json();

    // بررسی وجود نوع شعر تکراری برای این شاعر
    const existingType = await prisma.poemType.findFirst({
      where: {
        name,
        poetId: parseInt(poetId),
      },
    });

    if (existingType) {
      return Response.json(
        { error: "این نوع شعر قبلاً برای این شاعر ثبت شده است" },
        { status: 400 }
      );
    }

    // ایجاد نوع شعر جدید
    const poemType = await prisma.poemType.create({
      data: {
        name,
        description,
        typeUrl: typeUrl || name.toLowerCase().replace(/\s+/g, "-"),
        poetId: parseInt(poetId),
      },
    });

    return Response.json(poemType);
  } catch (error) {
    console.error("Error creating poem type:", error);
    return Response.json(
      { error: error.message || "خطا در ایجاد نوع شعر" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const poets = await prisma.poet.findMany();
    return Response.json(poets);
  } catch (error) {
    return Response.json(
      { error: "خطا در دریافت لیست شاعران" },
      { status: 500 }
    );
  }
}
