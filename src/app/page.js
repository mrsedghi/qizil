// app/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

// ترتیب قرن‌ها از یکم تا معاصر
const centuryOrder = [
  "یکم",
  "دوم",
  "سوم",
  "چهارم",
  "پنجم",
  "ششم",
  "هفتم",
  "هشتم",
  "نهم",
  "دهم",
  "یازدهم",
  "دوازدهم",
  "سیزدهم",
  "چهاردهم",
  "معاصر",
];

export default async function Home() {
  const poets = await prisma.poet.findMany({
    include: {
      poems: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      century: "asc",
    },
  });

  // Group poets by century
  const poetsByCentury = poets.reduce((acc, poet) => {
    const century = poet.century;
    if (!acc[century]) {
      acc[century] = [];
    }
    acc[century].push(poet);
    return acc;
  }, {});

  // Sort centuries according to our predefined order
  const sortedCenturies = Object.keys(poetsByCentury).sort((a, b) => {
    return centuryOrder.indexOf(a) - centuryOrder.indexOf(b);
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">شاعران آذربایجانی</h1>
          <p className="text-opacity-80 mt-2">
            بر اساس قرن‌های مختلف دسته‌بندی شده‌اند
          </p>
        </div>
        <Link href="/poets/add" className="btn btn-primary">
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
          افزودن شاعر جدید
        </Link>
      </div>

      {/* Render poets grouped by sorted centuries */}
      {sortedCenturies.map((century) => (
        <div key={century} className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">قرن {century}</h2>
            <span className="badge badge-primary">
              {poetsByCentury[century].length} شاعر
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {poetsByCentury[century].map((poet) => (
              <Link href={`/poets/${poet.id}`} key={poet.id} className="group">
                <div className="flex flex-col items-center text-center gap-3 hover:transform hover:scale-105 transition-transform duration-200">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2 group-hover:ring-primary">
                      {poet.imageUrl ? (
                        <Image
                          src={poet.imageUrl}
                          alt={poet.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-focus text-neutral-content flex items-center justify-center">
                          <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {poet.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
