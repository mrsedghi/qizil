// app/components/Header.jsx
import Link from "next/link";
import { FaHome, FaSearch, FaArrowRight } from "react-icons/fa";
import { GiQuillInk } from "react-icons/gi";

export default function Header({ backLink, title }) {
  return (
    <header className="sticky top-0 z-20 bg-base-100/90 backdrop-blur-lg border-b border-base-300 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href={backLink} className="btn btn-ghost btn-circle">
            <FaArrowRight className="text-lg rotate-180" />
          </Link>

          <div className="flex items-center gap-2">
            <GiQuillInk className="text-primary text-2xl" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title || "شعرستان"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle">
              <FaSearch className="text-lg" />
            </button>
            <Link href="/" className="btn btn-ghost btn-circle">
              <FaHome className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
