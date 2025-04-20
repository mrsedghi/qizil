// app/components/SearchBox.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-base-200 rounded-box p-6 mb-6 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-3">
        <FaSearch className="text-primary" />
        جستجوی اشعار
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی شعر یا شاعر..."
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          <FaSearch />
        </button>
      </form>
    </div>
  );
}
