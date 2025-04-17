// app/poets/[id]/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const prisma = new PrismaClient();

const fetchPoet = async (id) => {
  try {
    return await prisma.poet.findUnique({
      where: { id: parseInt(id) },
      include: {
        poems: {
          include: { audioFiles: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching poet:", error);
    return null;
  }
};

export default async function PoetPage({ params }) {
  const poet = await fetchPoet(params.id);

  if (!poet) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Back Button */}
          <Link
            href={`/`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            بازگشت به صفحه اصلی
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {poet.imageUrl && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={poet.imageUrl}
                  alt={poet.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            )}

            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{poet.name}</h1>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {poet.century && <span>{poet.century}</span>}
              </div>

              {poet.bio && (
                <p className="mt-4 text-gray-700 whitespace-pre-line">
                  {poet.bio}
                </p>
              )}
            </div>
          </div>

          {/* Add Poem Button */}
          <div className="mt-6">
            <Link
              href={`/poets/${poet.id}/add-poem`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              افزودن شعر جدید
            </Link>
          </div>

          {/* Poems List */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">اشعار</h2>

            {poet.poems.length === 0 ? (
              <p className="text-gray-500">هنوز شعری اضافه نشده است.</p>
            ) : (
              <div className="space-y-6 divide-y divide-gray-100">
                {poet.poems.map((poem) => (
                  <article key={poem.id} className="pt-6 first:pt-0">
                    <Link
                      href={`/poets/${poet.id}/poems/${poem.id}`}
                      className="group"
                    >
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {poem.title}
                      </h3>
                    </Link>

                    {/* Poem Preview */}
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
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
