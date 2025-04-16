// app/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Home() {
  const poets = await prisma.poet.findMany({
    include: {
      poems: {
        take: 1, // Get just 1 poem per poet for preview
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">شاعران آذربایجانی</h1>
      <Link
        href="/poets/add"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        افزودن شاعر جدید
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {poets.map((poet) => (
          <div
            key={poet.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                {poet.imageUrl && (
                  <img
                    src={poet.imageUrl}
                    alt={poet.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    <Link
                      href={`/poets/${poet.id}`}
                      className="hover:text-blue-600"
                    >
                      {poet.name}
                    </Link>
                  </h2>
                  <p className="text-gray-600">{poet.region}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-700 line-clamp-2">{poet.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
