// app/components/Footer.jsx
import Link from "next/link";
import { GiQuillInk } from "react-icons/gi";

export default function Footer() {
  return (
    <footer className="mt-16 bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GiQuillInk className="text-primary text-2xl" />
            <span className="text-xl font-bold">شعرستان</span>
          </div>

          <div className="grid grid-flow-col gap-6">
            <Link href="/about" className="link link-hover hover:text-primary">
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="link link-hover hover:text-primary"
            >
              تماس با ما
            </Link>
            <Link
              href="/privacy"
              className="link link-hover hover:text-primary"
            >
              حریم خصوصی
            </Link>
          </div>
        </div>

        <div className="divider my-4"></div>

        <div className="text-center text-sm opacity-80">
          <p>
            © {new Date().getFullYear()} گنجینه دیجیتال شعر آذربایجان - تمام
            حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  );
}
