// app/poets/[poetId]/poems/[poemId]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function PoemPage({ params }) {
  const poem = await prisma.poem.findUnique({
    where: {
      id: parseInt(params.poemId),
    },
    include: {
      poet: true,
      audioFiles: true,
      tags: true,
    },
  });

  if (!poem) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <Link
            href={`/poets/${poem.poet.id}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            &larr; بازگشت به صفحه شاعر
          </Link>

          <div className="flex flex-col w-full justify-center items-center">
            <img
              src={poem.poet.imageUrl}
              alt={poem.poet.name}
              className="w-20 h-20 rounded-full object-cover "
            />
            <p className=" font-bold text-gray-900 mt-1">{poem.poet.name}</p>
            <h1 className="text-2xl  text-gray-900">{poem.title}</h1>

            <div className="mt-6 whitespace-pre-line prose max-w-none text-gray-800 text-lg">
              {poem.content.split("\n").map((paragraph, i) => (
                <p key={i} className="my-4 leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {poem.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {poem.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {poem.audioFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                خوانش‌های این شعر
              </h2>
              <div className="space-y-4">
                {poem.audioFiles.map((audio) => (
                  <div key={audio.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <audio controls src={audio.url} className="flex-1" />
                      <span className="text-gray-700">
                        خوانش: {audio.reciter}
                      </span>
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
