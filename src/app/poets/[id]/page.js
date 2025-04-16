// app/poets/[id]/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function PoetPage({ params }) {
  const poet = await prisma.poet.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      poems: {
        include: {
          audioFiles: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!poet) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {poet.imageUrl && (
              <img
                src={poet.imageUrl}
                alt={poet.name}
                className="w-32 h-32 rounded-full object-cover self-start"
              />
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{poet.name}</h1>
              <p className="text-gray-600 mt-1">
                {poet.region} • {poet.language}
              </p>

              {poet.birthDate && (
                <p className="text-gray-600 mt-1">
                  {poet.birthDate.toLocaleDateString("fa-IR")} -{" "}
                  {poet.deathDate?.toLocaleDateString("fa-IR") || "حاضر"}
                </p>
              )}

              <p className="mt-4 text-gray-700">{poet.bio}</p>
            </div>
          </div>
          <Link
            href={`/poets/${poet.id}/add-poem`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            افزودن شعر جدید
          </Link>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">اشعار</h2>

            <div className="space-y-6">
              {poet.poems.map((poem) => (
                <div key={poem.id} className="border-b border-gray-100 pb-6">
                  <Link href={`/poets/${poet.id}/poems/${poem.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                      {poem.title}
                    </h3>
                  </Link>

                  {/* نمایش بخشی از شعر (50 کلمه اول) */}
                  <div className="mt-2 prose max-w-none text-gray-700">
                    {poem.content
                      .split("\n")
                      .slice(0, 2)
                      .map((paragraph, i) => (
                        <p key={i} className="line-clamp-3">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
