// app/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaHistory, FaUser, FaBook, FaSearch } from "react-icons/fa";
import { GiQuillInk } from "react-icons/gi";

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
    <div className="min-h-screen bg-base-100">
      {/* App-like header */}
      <header className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-sm border-b border-base-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GiQuillInk className="text-primary text-2xl" />
            <h1 className="text-xl font-bold">شاعران آذربایجانی</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-circle">
              <FaSearch className="text-lg" />
            </button>
            <Link href="/poets/add" className="btn btn-primary btn-sm">
              <FaPlus />
              <span className="hidden sm:inline">شاعر جدید</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero section */}
        <section className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 sm:p-6 mb-8 md:mb-12">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                گنجینه شعر آذربایجان
              </h1>
              <p className="text-base sm:text-lg opacity-80 mb-4 sm:mb-6">
                کشف و بررسی آثار شاعران بزرگ آذربایجان از قرن یکم تا معاصر
              </p>
            </div>
          </div>
        </section>

        {/* Render poets grouped by sorted centuries */}
        {sortedCenturies.map((century) => (
          <section key={century} id={century} className="mb-16 scroll-mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">قرن {century}</h2>
                <span className="badge badge-primary badge-lg">
                  {poetsByCentury[century].length} شاعر
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {poetsByCentury[century].map((poet) => (
                <Link
                  href={`/poets/${poet.id}`}
                  key={poet.id}
                  className="group"
                  prefetch={true}
                >
                  <div className="card bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full">
                    <figure className="px-6 pt-6">
                      <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          {poet.imageUrl ? (
                            <Image
                              src={poet.imageUrl}
                              alt={poet.name}
                              width={96}
                              height={96}
                              className="object-cover"
                              priority={century === "معاصر"}
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral text-neutral-content flex items-center justify-center">
                              <FaUser className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                      </div>
                    </figure>
                    <div className="card-body items-center text-center p-4">
                      <h3 className="card-title group-hover:text-primary transition-colors line-clamp-2">
                        {poet.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="flex justify-between gap-4 flex-wrap p-10 bg-base-200 text-base-content rounded-t-2xl">
        <div className="flex flex-wrap gap-4">
          <Link href="/about" className="link link-hover">
            درباره ما
          </Link>
          <Link href="/contact" className="link link-hover">
            تماس با ما
          </Link>
          <Link href="/privacy" className="link link-hover">
            حریم خصوصی
          </Link>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <p>© 2023 گنجینه شعر آذربایجان - تمام حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
  );
}
