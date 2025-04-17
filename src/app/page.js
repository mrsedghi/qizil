// app/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function Home() {
  const poets = await prisma.poet.findMany({
    include: {
      poems: {
        take: 1, // فقط یک شعر برای پیش‌نمایش
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      name: "asc", // مرتب‌سازی بر اساس نام
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">شاعران آذربایجانی</h1>
        <Link
          href="/poets/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          افزودن شاعر جدید
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {poets.map((poet) => (
          <div
            key={poet.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                {poet.imageUrl ? (
                  <div className="relative w-16 h-16">
                    <Image
                      src={poet.imageUrl}
                      alt={poet.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    <Link
                      href={`/poets/${poet.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {poet.name}
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    قرن {poet.century}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
