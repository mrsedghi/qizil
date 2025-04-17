// app/api/poets/[id]/poems/route.js
import prisma from "../../../../../../lib/prisma";

export async function POST(request, { params }) {
  try {
    // دریافت پارامترهای URL
    const { id } = params;

    // دریافت داده‌های JSON از درخواست
    const {
      title,
      content,
      audioFiles = [],
      poemType = "GHAZAL",
    } = await request.json();

    // اعتبارسنجی داده‌های ورودی
    if (!title || !content) {
      return Response.json(
        { error: "عنوان و متن شعر الزامی هستند" },
        { status: 400 }
      );
    }

    // فیلتر کردن خوانش‌های معتبر
    const validAudioFiles = audioFiles.filter((a) => a?.url && a?.reciter);

    // ایجاد شعر جدید
    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        poemType, // استفاده از مقدار دریافتی یا پیش‌فرض
        poetId: parseInt(id),
        audioFiles: {
          create: validAudioFiles,
        },
      },
      include: {
        audioFiles: true,
      },
    });

    return Response.json(
      {
        success: true,
        data: poem,
        message: "شعر با موفقیت ایجاد شد",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating poem:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "خطا در ایجاد شعر جدید",
      },
      { status: 500 }
    );
  }
}
