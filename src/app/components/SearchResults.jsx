// components/SearchResults.jsx
"use client";

import {
  FaSearch,
  FaBook,
  FaUser,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchResults({ query, results }) {
  const router = useRouter();
  const { poets, poems } = results;

  const highlightText = (text) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
    );
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
      <div key={index} className="mb-4 last:mb-0 group relative">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          {verse.map((line, lineIndex) => (
            <div key={lineIndex} className={`p-2 rounded-lg`}>
              <p
                className={`poem-line leading-relaxed text-center ${
                  lineIndex % 2 === 0 ? "md:text-left" : "md:text-right"
                }`}
                dangerouslySetInnerHTML={{ __html: highlightText(line) }}
              />
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Search Header with Back Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="bg-base-200 rounded-box px-6 py-3 shadow-sm">
              <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
                <FaSearch className="text-primary" />
                نتایج جستجو برای "{query}"
              </h1>
            </div>
            <button
              onClick={() => router.back()}
              className="btn btn-ghost gap-2"
            >
              بازگشت
              <FaArrowRight className="rotate-180" />
            </button>
          </div>

          {/* Search Results */}
          <div className="space-y-8">
            {/* Poets Section */}
            {poets.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-3">
                    <FaUser className="text-primary" />
                    شاعران
                  </h2>
                  <span className="badge badge-primary">
                    {poets.length} نتیجه
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {poets.map((poet) => (
                    <Link
                      href={`/poets/${poet.poetUrl}`}
                      key={poet.id}
                      className="rounded-xl p-4 bg-base-200 hover:bg-base-300 transition border border-base-300/50 hover:border-primary/30"
                    >
                      <div className="flex flex-col justify-center items-center gap-3">
                        <div className="avatar">
                          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            {poet.imageUrl ? (
                              <Image
                                src={poet.imageUrl}
                                alt={poet.name}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-neutral text-neutral-content flex items-center justify-center">
                                <FaUser className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <h3
                            className="card-title hover:text-primary transition-colors text-lg"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(poet.name),
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Poems Section */}
            {poems.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-3">
                    <FaBook className="text-primary" />
                    اشعار
                  </h2>
                  <span className="badge badge-primary">
                    {poems.length} نتیجه
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>
                <div className="space-y-6">
                  {poems.map((poem) => (
                    <div
                      key={poem.order}
                      className="bg-base-200 hover:bg-base-300 rounded-box p-6 transition shadow-sm border border-base-300/50 hover:border-primary/30"
                    >
                      <Link
                        href={`/poets/${poem.poet.poetUrl}/${poem.poemType.typeUrl}/${poem.order}`}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                className="text-lg font-semibold"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(poem.title),
                                }}
                              />
                              <p className="text-primary mt-1">
                                از{" "}
                                <span
                                  className="hover:underline"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(poem.poet.name),
                                  }}
                                />
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="badge badge-outline badge-sm">
                                {poem.poemType.name}
                              </span>
                            </div>
                          </div>

                          <div className="bg-base-100 p-4 rounded-box">
                            <FaQuoteLeft className="text-gray-400 mb-3" />
                            {processPoemContent(poem.content)}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {poets.length === 0 && poems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold">نتیجه‌ای یافت نشد</h3>
                <p className="text-gray-500 mt-2">
                  هیچ شاعر یا شعری با عبارت "{query}" یافت نشد
                </p>
                <button
                  onClick={() => router.back()}
                  className="btn btn-primary mt-6 gap-2"
                >
                  <FaArrowRight className="rotate-180" />
                  بازگشت به صفحه اصلی
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
