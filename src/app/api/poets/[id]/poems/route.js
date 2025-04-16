import prisma from "../../../../../../lib/prisma";
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { title, content, audioFiles, tags } = await request.json();

    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        poetId: parseInt(id),
        audioFiles: {
          create: audioFiles.filter((a) => a.url), // فقط خوانش‌های با URL معتبر
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    return Response.json(poem);
  } catch (error) {
    return Response.json({ error: "خطا در ایجاد شعر جدید" }, { status: 500 });
  }
}
