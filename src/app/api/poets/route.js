import prisma from "../../../../lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const poet = await prisma.poet.create({ data });
    return Response.json(poet);
  } catch (error) {
    return Response.json({ error: "خطا در ایجاد شاعر جدید" }, { status: 500 });
  }
}
