// app/poets/[poetUrl]/[poemTypeUrl]/[order]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CopyToClipboard } from "./components/CopyToClipboard";
import { ShareButton } from "./components/ShareButton";
import { FontSizeControls } from "./components/FontSizeControls";
import { ToggleLineNumbers } from "./components/ToggleLineNumbers";
import {
  FiMusic,
  FiArrowLeft,
  FiHome,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";

const prisma = new PrismaClient();

const fetchPoem = async (poetUrl, poemTypeUrl, order) => {
  try {
    return await prisma.poem.findFirst({
      where: {
        poet: { poetUrl },
        poemType: { typeUrl: poemTypeUrl },
        order: parseInt(order),
      },
      include: {
        poet: true,
        audioFiles: true,
        poemType: true,
      },
    });
  } catch (error) {
    console.error("Error fetching poem:", error);
    return null;
  }
};

const fetchAdjacentPoems = async (poetUrl, poemTypeUrl, currentOrder) => {
  try {
    const [prevPoem, nextPoem] = await Promise.all([
      prisma.poem.findFirst({
        where: {
          poet: { poetUrl },
          poemType: { typeUrl: poemTypeUrl },
          order: { lt: parseInt(currentOrder) },
        },
        orderBy: { order: "desc" },
        select: {
          id: true,
          order: true,
          title: true,
          poet: { select: { poetUrl: true } },
          poemType: { select: { typeUrl: true } },
        },
      }),
      prisma.poem.findFirst({
        where: {
          poet: { poetUrl },
          poemType: { typeUrl: poemTypeUrl },
          order: { gt: parseInt(currentOrder) },
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          title: true,
          poet: { select: { poetUrl: true } },
          poemType: { select: { typeUrl: true } },
        },
      }),
    ]);

    return { prevPoem, nextPoem };
  } catch (error) {
    console.error("Error fetching adjacent poems:", error);
    return { prevPoem: null, nextPoem: null };
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
                lineIndex % 2 === 0
                  ? "lg:text-left md:text-left"
                  : "lg:text-right md:text-right"
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
  const { poetUrl, poemTypeUrl, order } = params;
  const poem = await fetchPoem(poetUrl, poemTypeUrl, order);

  if (!poem || !poem.poemType) {
    return notFound();
  }

  const { prevPoem, nextPoem } = await fetchAdjacentPoems(
    poetUrl,
    poemTypeUrl,
    order
  );
  const hasAudio = poem.audioFiles && poem.audioFiles.length > 0;

  const NavigationButton = ({ poem, direction }) => {
    if (!poem) return <div className="flex-1"></div>;

    return (
      <Link
        href={`/poets/${poem.poet.poetUrl}/${poem.poemType.typeUrl}/${poem.order}`}
        className={`btn btn-outline btn-sm flex-shrink-0 flex gap-0 items-center ${
          direction === "next" ? "ml-auto" : "mr-auto"
        }`}
      >
        {direction === "prev" ? (
          <>
            <FiChevronRight className="ml-1" />
            <span className="w-fit"> قبلی</span>
            <span className="line-clamp-1 text-right mr-2">{poem.title}</span>
          </>
        ) : (
          <>
            <span className="line-clamp-1 text-left ml-2">{poem.title}</span>
            <span className="w-fit"> بعدی</span>
            <FiChevronLeft className="mr-1" />
          </>
        )}
      </Link>
    );
  };

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
                href={`/poets/${poem.poet.poetUrl}/${poem.poemType.typeUrl}`}
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
                href={`/poets/${poem.poet.poetUrl}/${poem.poemType.typeUrl}`}
                className="flex items-center gap-1"
              >
                <span>{poem.poemType.name}</span>
              </Link>
            </li>
            <li></li>
          </ul>
        </div>

        {/* Navigation Buttons - Top */}
        <div className="flex justify-between w-full mb-6 gap-4">
          <div>
            {prevPoem && <NavigationButton poem={prevPoem} direction="prev" />}
          </div>
          <div>
            {nextPoem && <NavigationButton poem={nextPoem} direction="next" />}
          </div>
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
                <div className="mt-1">
                  <span className="badge badge-outline ">
                    {poem.poemType.name} {poem.order}
                  </span>
                </div>
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
              url={`/poets/${poem.poet.poetUrl}/${poem.poemType.typeUrl}/${poem.order}`}
            />
          </div>

          <div className="py-6 rounded-b-xl border-t-base-100 border-[1px] border-base-300 poem-content">
            {processPoemContent(poem.content)}
          </div>
        </div>

        {/* Audio section */}
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

        {/* Navigation Buttons - Bottom */}
        <div className="flex justify-between w-full mt-8 gap-4">
          <div>
            {prevPoem && <NavigationButton poem={prevPoem} direction="prev" />}
          </div>
          <div>
            {nextPoem && <NavigationButton poem={nextPoem} direction="next" />}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-base-content/60">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} گنجینه شعر آذربایجان</p>
        </div>
      </footer>
    </div>
  );
}
