// app/poets/[poetId]/poems/[poemId]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CopyToClipboard } from "./components/CopyToClipboard";
import { ShareButton } from "./components/ShareButton";
import { FontSizeControls } from "./components/FontSizeControls";
import { ToggleLineNumbers } from "./components/ToggleLineNumbers";
import {
  FiArrowRight,
  FiBookOpen,
  FiMusic,
  FiShare2,
  FiCopy,
  FiType,
  FiList,
  FiArrowLeft,
  FiHome,
} from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

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

const fetchPoemType = async (poemTypeId) => {
  if (!poemTypeId) return null;
  try {
    return await prisma.poemType.findUnique({
      where: { id: parseInt(poemTypeId) },
      // Only include relation fields that exist in your schema
      // Remove typeUrl if it's not a relation field
    });
  } catch (error) {
    console.error("Error fetching poem Type:", error);
    return null;
  }
};

const processPoemContent = (content) => {
  if (!content) return null;
  const allLines = content.split("\n").filter((line) => line.trim() !== "");
  const verses = [];

  for (let i = 0; i < allLines.length; i += 2) {
    const verseLines = [];
    if (allLines[i]) verseLines.push(allLines[i]);
    if (allLines[i + 1]) verseLines.push(allLines[i + 1]);
    if (verseLines.length > 0) verses.push(verseLines);
  }

  return verses.map((verse, index) => (
    <div key={index} className="mb-8 last:mb-0 group relative">
      <div className="verse-number absolute right-[48.5%] max-sm:-top-1 lg:top-1/2 transform -translate-y-1/2 transition-opacity duration-300">
        <span className="inline-flex items-center justify-center text-sm font-medium text-primary bg-primary/10 w-5 h-5 rounded-full">
          {index + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 hover:bg-base-200/50">
        {verse.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={`p-2 rounded-lg transition-all duration-200`}
          >
            <p
              className={`poem-line leading-relaxed max-sm:text-center ${
                lineIndex % 2 === 0 ? "lg:text-left" : "lg:text-right"
              }`}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  ));
};

export default async function PoemPage({ params }) {
  const { poemId, poetId } = params;
  const poem = await fetchPoem(poemId);
  const poemType = poem?.poemTypeId
    ? await fetchPoemType(poem.poemTypeId)
    : null;

  if (!poem) {
    return notFound();
  }

  const hasAudio = poem.audioFiles && poem.audioFiles.length > 0;

  console.log(poem.audioFiles);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* Header */}
      <header className="sticky top-0 z-20 rounded-t-xl right-[-1px] bg-base-100/90 backdrop-blur-md border-b border-base-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiQuillPenLine className="text-primary text-xl" />
              <h1 className="text-lg font-semibold">شعر {poem.title}</h1>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/poets/${poetId}/${poemType.typeUrl}`}
                className="btn btn-ghost btn-circle"
              >
                <FiArrowLeft className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li>
              <Link href="/" className="flex items-center gap-1">
                <FiHome className="text-sm" />
                <span>خانه</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/poets/${poem.poet.poetUrl}`}
                className="flex items-center gap-1"
              >
                {poem.poet.name}
              </Link>
            </li>
            <li>
              <Link
                href={`/poets/${poem.poet.poetUrl}/${poemType.typeUrl}`}
                className="flex items-center gap-1"
              >
                <span>{poemType.name}</span>
              </Link>
            </li>
            <li></li>
          </ul>
        </div>

        {/* Poet card */}
        <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 border border-base-300 mb-8">
          <div className="card-body p-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                  {poem.poet.imageUrl && (
                    <Image
                      src={poem.poet.imageUrl}
                      alt={poem.poet.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{poem.poet.name}</h2>
                <p className="text-sm opacity-80">{poem.title}</p>
                {poemType && (
                  <div className="mt-1">
                    <span className="badge badge-outline badge-sm">
                      {poemType.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Poem content */}
        <div className="bg-base-100 rounded-xl shadow-sm border-base-300 mb-8">
          <div className="sticky top-16 z-10 bg-base-100/90 backdrop-blur-sm p-3 border border-base-300 flex justify-center gap-2">
            <FontSizeControls />
            <ToggleLineNumbers />
            <CopyToClipboard text={poem.content} />
            <ShareButton
              title={poem.title}
              text={`شعر ${poem.title} از ${poem.poet.name}`}
              url={`/poets/${poetId}/poems/${poemId}`}
            />
          </div>

          <div className="py-6 rounded-b-xl border-t-base-100 border-[1px] border-base-300 poem-content">
            {processPoemContent(poem.content)}
          </div>
        </div>

        {/* Audio section - only if audio exists */}
        {hasAudio && (
          <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
            <div className="p-4 border-b border-base-300 flex items-center gap-2 bg-base-200/50">
              <FiMusic className="text-primary" />
              <h2 className="font-semibold">خوانش‌های صوتی</h2>
            </div>

            <div className="divide-y divide-base-300">
              {poem.audioFiles.map((audio) => (
                <div key={audio.id} className="p-4">
                  <div className="flex flex-col gap-3">
                    {audio.reciter && (
                      <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm">
                          {audio.reciter}
                        </span>
                      </div>
                    )}
                    {audio.url && (
                      <audio
                        controls
                        src={audio.url}
                        className="audio audio-primary w-full"
                        preload="none"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-sm text-base-content/60">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} گنجینه شعر آذربایجان</p>
        </div>
      </footer>
    </div>
  );
}
