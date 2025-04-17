// app/poets/[poetId]/poems/[poemId]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CopyToClipboard } from "./components/CopyToClipboard";
import { ShareButton } from "./components/ShareButton";
import { FontSizeControls } from "./components/FontSizeControls";

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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Back Button */}
          <Link
            href={`/poets/${poem.poet.id}`}
            className="btn btn-ghost btn-sm w-fit mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            <div className="avatar">
              <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={poem.poet.imageUrl}
                  alt={poem.poet.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            </div>
            <p className="font-bold mt-2">{poem.poet.name}</p>
            <h1 className="text-2xl font-bold mt-2">{poem.title}</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <CopyToClipboard text={poem.content} />
            <ShareButton
              title={poem.title}
              text={`شعر ${poem.title} از ${poem.poet.name}`}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
            <FontSizeControls />
          </div>

          {/* Poem Content */}
          <div className="prose max-w-3xl mx-auto w-fit text-center poem-content">
            {poem.content.split("\n").map((paragraph, i) => (
              <p key={i} className="my-4 poem-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Audio Files Section */}
          {poem.audioFiles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6 text-center">
                خوانش‌های این شعر
              </h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                {poem.audioFiles.map((audio) => (
                  <div key={audio.id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <audio
                          controls
                          src={audio.url}
                          className="audio audio-primary flex-1 w-full"
                          preload="none"
                        />
                        {audio.reciter && (
                          <span className="text-sm sm:text-base">
                            خوانش: {audio.reciter}
                          </span>
                        )}
                      </div>
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
