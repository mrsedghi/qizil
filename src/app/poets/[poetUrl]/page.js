// app/poets/[poetUrl]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "../../../../lib/prisma";

export async function generateStaticParams() {
  const poets = await prisma.poet.findMany({
    select: { poetUrl: true },
  });
  return poets.map((poet) => ({
    poetUrl: poet.poetUrl,
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

const fetchPoemTypes = async (poetId) => {
  try {
    return await prisma.poemType.findMany({
      where: {
        poetId: poetId,
      },
      include: {
        _count: {
          select: { poems: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching poem types:", error);
    return [];
  }
};

export default async function PoetPage({ params }) {
  const poetUrl = params.poetUrl;

  if (!poetUrl) {
    return notFound();
  }

  const poet = await fetchPoet(poetUrl);

  if (!poet) {
    return notFound();
  }

  const poemTypes = await fetchPoemTypes(poet.id);
  console.log(poet);
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Back Button */}
          <div className="flex justify-end">
            <Link href={`/`} className="btn btn-ghost btn-sm w-fit mb-6 -ml-2">
              بازگشت به صفحه اصلی
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

            {/* Poet Info Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {poet.name}
                  </h1>
                  {poet.century && (
                    <div className="badge badge-primary badge-lg mt-2">
                      قرن {poet.century}
                    </div>
                  )}
                </div>

                {/* Bio Section */}
                {poet.bio && (
                  <div className="bg-base-200 rounded-box p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      درباره شاعر
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed text-justify text-gray-700 dark:text-gray-300">
                      {poet.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-6"></div>

          {/* Poem Types List */}
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
              اثرلر
            </h2>

            {poemTypes.length === 0 ? (
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
                  <span>هنوز نوع شعری برای این شاعر ثبت نشده است.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {poemTypes.map((poemType) => (
                  <Link
                    href={`/poets/${poet.poetUrl}/${poemType.typeUrl}`}
                    key={poemType.id}
                    className="card bg-base-100 border border-base-200 hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex justify-between items-start">
                        <div className="w-3/5">
                          <h3 className="card-title text-lg sm:text-xl hover:text-primary transition-colors">
                            {poemType.name}
                          </h3>
                          {poemType.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {poemType.description}
                            </p>
                          )}
                        </div>
                        <div className="badge badge-outline">
                          {poemType._count.poems} شعر
                        </div>
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
