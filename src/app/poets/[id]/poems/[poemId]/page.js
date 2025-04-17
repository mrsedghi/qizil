// app/poets/[poetId]/poems/[poemId]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

const fetchPoem = async (poemId) => {
  try {
    return await prisma.poem.findUnique({
      where: { id: parseInt(poemId) },
      include: {
        poet: true,
        audioFiles: true,
      },
    });
  } catch (error) {
    console.error("Error fetching poem:", error);
    return null;
  }
};

export default async function PoemPage({ params }) {
  const poem = await fetchPoem(params.poemId);

  if (!poem) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Back Button */}
          <Link
            href={`/poets/${poem.poet.id}`}
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
            بازگشت به صفحه شاعر
          </Link>

          {/* Poem Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
              <Image
                src={poem.poet.imageUrl}
                alt={poem.poet.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <p className="font-bold text-gray-900">{poem.poet.name}</p>
            <h1 className="text-[12pt]  font-bold text-gray-900 mt-2">
              {poem.title}
            </h1>
          </div>

          {/* Poem Content */}
          <div className="prose max-w-3xl mx-auto text-gray-800 text-lg w-fit">
            {poem.content.split("\n").map((paragraph, i) => (
              <p
                key={i}
                className="my-4 text-[1.4rem] leading-loose text-center"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Audio Files Section */}
          {poem.audioFiles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                خوانش‌های این شعر
              </h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                {poem.audioFiles.map((audio) => (
                  <div
                    key={audio.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <audio
                        controls
                        src={audio.url}
                        className="flex-1 w-full"
                        preload="none"
                      />
                      {audio.reciter && (
                        <span className="text-gray-700 text-sm sm:text-base">
                          خوانش: {audio.reciter}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
