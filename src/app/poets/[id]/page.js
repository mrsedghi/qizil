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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Back Button */}
          <Link href={`/`} className="btn btn-ghost btn-sm w-fit">
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
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {poet.imageUrl ? (
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image
                    src={poet.imageUrl}
                    alt={poet.name}
                    width={128}
                    height={128}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-32 rounded-full bg-neutral-focus text-neutral-content">
                  <span className="text-3xl">{poet.name.charAt(0)}</span>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold">{poet.name}</h1>
              {poet.century && (
                <div className="badge badge-primary">{poet.century}</div>
              )}

              {poet.bio && (
                <p className="mt-4 whitespace-pre-line">{poet.bio}</p>
              )}
            </div>
          </div>

          {/* Add Poem Button */}
          <div className="mt-6">
            <Link
              href={`/poets/${poet.id}/add-poem`}
              className="btn btn-success"
            >
              افزودن شعر جدید
            </Link>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Poems List */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">اشعار</h2>

            {poet.poems.length === 0 ? (
              <div className="alert alert-info">
                <span>هنوز شعری اضافه نشده است.</span>
              </div>
            ) : (
              <div className="space-y-6">
                {poet.poems.map((poem, i) => (
                  <div
                    key={poem.id}
                    className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4">
                      <Link href={`/poets/${poet.id}/poems/${poem.id}`}>
                        <h3 className="card-title hover:text-primary transition-colors">
                          غزل شماره {i + 1} : {poem.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
