// app/poets/[id]/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const prisma = new PrismaClient();

// Add this function to generate static params
export async function generateStaticParams() {
  const poets = await prisma.poet.findMany({
    select: { id: true },
  });
  return poets.map((poet) => ({
    id: poet.id.toString(),
  }));
}

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
  const { id } = await params;

  if (!id || isNaN(parseInt(id))) {
    return notFound();
  }

  const poet = await fetchPoet(id);

  if (!poet) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Rest of your existing JSX remains exactly the same */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Back Button */}
          <Link href={`/`} className="btn btn-ghost btn-sm w-fit mb-6 -ml-2">
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
            بازگشت به صفحه اصلی
          </Link>

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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={`/poets/${poet.id}/add-poem`}
              className="btn btn-success gap-2 flex-1 sm:flex-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              افزودن شعر جدید
            </Link>
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              مجموعه اشعار
            </h2>

            {poet.poems.length === 0 ? (
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
                  <span>هنوز شعری برای این شاعر ثبت نشده است.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {poet.poems.map((poem, i) => (
                  <Link
                    href={`/poets/${poet.id}/poems/${poem.id}`}
                    key={poem.id}
                    className="card bg-base-100 border border-base-200 hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="badge badge-primary badge-lg p-4 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="card-title text-lg sm:text-xl hover:text-primary transition-colors">
                            {poem.title}
                          </h3>
                          {poem.audioFiles.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{poem.audioFiles.length} خوانش</span>
                            </div>
                          )}
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
