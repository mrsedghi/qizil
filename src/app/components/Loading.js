// components/Loading.js
import { FaPenFancy } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <div className="animate-bounce flex justify-center">
          <FaPenFancy className="text-6xl text-primary" />
        </div>
        <h2 className="text-xl font-semibold mt-4">
          در حال بارگذاری شاعران...
        </h2>
        <progress className="progress progress-primary w-56 mt-4"></progress>
      </div>
    </div>
  );
}
