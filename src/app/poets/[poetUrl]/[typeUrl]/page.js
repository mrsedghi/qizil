// app/poets/[poetUrl]/[typeUrl]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "../../../../../lib/prisma";
import { FaArrowLeft } from "react-icons/fa";

// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const poemTypes = await prisma.poemType.findMany({
    select: {
      poet: { select: { poetUrl: true } },
      typeUrl: true,
    },
    where: {
      typeUrl: { not: null },
    },
  });

  return poemTypes.map((type) => ({
    poetUrl: type.poet.poetUrl,
    typeUrl: type.typeUrl,
  }));
}

const fetchPoet = async (poetUrl) => {
  try {
    return await prisma.poet.findUnique({
      where: { poetUrl },
      select: {
        id: true,
        name: true,
        bio: true,
        century: true,
        imageUrl: true,
        poetUrl: true,
      },
    });
  } catch (error) {
    console.error("Error fetching poet:", error);
    return null;
  }
};

const fetchPoemType = async (poetId, typeUrl) => {
  try {
    return await prisma.poemType.findFirst({
      where: {
        poetId,
        typeUrl,
      },
      select: {
        id: true,
        name: true,
        description: true,
        typeUrl: true,
      },
    });
  } catch (error) {
    console.error("Error fetching poem type:", error);
    return null;
  }
};

const fetchPoems = async (poetId, poemTypeId) => {
  try {
    return await prisma.poem.findMany({
      where: {
        poetId,
        poemTypeId,
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching poems:", error);
    return [];
  }
};

export default async function PoemTypePage({ params }) {
  const { poetUrl, typeUrl } = params;

  if (!poetUrl || !typeUrl) {
    return notFound();
  }

  const poet = await fetchPoet(poetUrl);
  if (!poet) {
    return notFound();
  }

  const poemType = await fetchPoemType(poet.id, typeUrl);
  if (!poemType) {
    return notFound();
  }

  const poems = await fetchPoems(poet.id, poemType.id);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Back Button */}
          <div className="flex justify-end">
            <Link
              href={`/poets/${poet.poetUrl}`}
              className="btn btn-ghost btn-sm w-fit mb-6 -ml-2"
            >
              بازگشت به صفحه شاعر
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
            </Link>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              {poet.imageUrl ? (
                <div className="avatar">
                  <div className="w-32 sm:w-40 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-lg">
                    <Image
                      src={poet.imageUrl}
                      alt={poet.name}
                      width={160}
                      height={160}
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-32 sm:w-40 rounded-full bg-gradient-to-br from-primary to-secondary text-neutral-content shadow-lg">
                    <span className="text-4xl">{poet.name.charAt(0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Poet and Type Info Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {poet.name}
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary mt-2">
                    {poemType.name}
                  </h2>
                  {poet.century && (
                    <div className="badge badge-primary badge-lg mt-2">
                      قرن {poet.century}
                    </div>
                  )}
                </div>

                {/* Description Section */}
                {poemType.description && (
                  <div className="bg-base-200 rounded-box p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      درباره این مجموعه
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed text-justify text-gray-700 dark:text-gray-300">
                      {poemType.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-6"></div>

          {/* Poems List */}
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {poemType.name}
            </h2>

            {poems.length === 0 ? (
              <div className="alert alert-info shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>هنوز شعری برای این مجموعه ثبت نشده است.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:gap-4">
                {poems.map((poem) => (
                  <Link
                    href={`/poets/${poet.poetUrl}/${poemType.typeUrl}/${poem.order}`}
                    key={poem.order}
                    className="card bg-base-100 rounded-[8px] hover:bg-base-300/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="card-body p-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-medium">
                            غزل {poem.order}
                          </div>
                          <h3 className="card-title hover:text-primary transition-colors max-sm:text-[0.9rem]">
                            {poem.title}
                          </h3>
                        </div>
                        <FaArrowLeft className="ml-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
