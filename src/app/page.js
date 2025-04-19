// app/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import prisma from "../../lib/prisma";
import { FaHome, FaSearch, FaBook, FaUser } from "react-icons/fa";
import { GiQuillInk } from "react-icons/gi";
import { RiAncientGateFill } from "react-icons/ri";

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

async function getPoets() {
  try {
    return await prisma.poet.findMany({
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
  } catch (error) {
    console.error("Error fetching poets:", error);
    return [];
  }
}

export default async function Home() {
  const poets = await getPoets();

  const poetsByCentury = poets.reduce((acc, poet) => {
    const century = poet.century;
    if (!acc[century]) {
      acc[century] = [];
    }
    acc[century].push(poet);
    return acc;
  }, {});

  const sortedCenturies = Object.keys(poetsByCentury).sort((a, b) => {
    return centuryOrder.indexOf(a) - centuryOrder.indexOf(b);
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <div className="avatar">
                <div className="w-32 sm:w-40 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-lg bg-gradient-to-br from-primary to-secondary">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <GiQuillInk className="text-5xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* App Info Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    شعرستان
                  </h1>
                  <h2 className="text-xl sm:text-2xl text-primary mt-2">
                    گنجینه شعر آذربایجان
                  </h2>
                </div>

                {/* Description Section */}
                <div className="bg-base-200 rounded-box p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    درباره شعرستان
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-justify text-gray-700 dark:text-gray-300">
                    مجموعه کامل اشعار شاعران آذربایجانی از قرن یکم تا معاصر
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-6"></div>

          {/* Search Section */}
          <div className="bg-base-200 rounded-box p-6 mb-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-3">
              <FaSearch className="text-primary" />
              جستجوی اشعار
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="جستجوی شعر یا شاعر..."
                className="input input-bordered w-full"
              />
              <button className="btn btn-primary">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Centuries List */}
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-3">
              <RiAncientGateFill className="text-primary" />
              شاعران بر اساس قرن
            </h2>

            {sortedCenturies.map((century) => (
              <div key={century} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold">قرن {century}</h3>
                  <span className="badge badge-primary badge-lg">
                    {poetsByCentury[century].length} شاعر
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {poetsByCentury[century].map((poet) => (
                    <Link
                      href={`/poets/${poet.poetUrl}`}
                      key={poet.poetUrl}
                      className="card bg-base-100 border border-base-200 hover:border-primary transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              {poet.imageUrl ? (
                                <Image
                                  src={poet.imageUrl}
                                  alt={poet.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral text-neutral-content flex items-center justify-center">
                                  <FaUser className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="card-title hover:text-primary transition-colors">
                              {poet.name}
                            </h3>
                            {poet.poems?.length > 0 && (
                              <div className="text-sm text-gray-500 mt-1">
                                {poet.poems.length} مجموعه شعری
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
