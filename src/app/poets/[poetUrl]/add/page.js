// app/poem-types/add/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPoemType() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    typeUrl: "",
    poetId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poets, setPoets] = useState([]);
  const router = useRouter();

  // دریافت لیست شاعران هنگام لود کامپوننت
  useEffect(() => {
    async function fetchPoets() {
      try {
        const res = await fetch("/api/poets");
        if (!res.ok) {
          throw new Error("Failed to fetch poets");
        }
        const data = await res.json();
        setPoets(data);
      } catch (error) {
        console.error("Error fetching poets:", error);
      }
    }
    fetchPoets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/poem-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("خطا در ذخیره نوع شعر");
      }

      router.push("/poem-types");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          افزودن نوع شعر جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام نوع شعر *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="مثال: غزل، قصیده، رباعی"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg h-32"
              placeholder="توضیحاتی درباره این نوع شعر..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              لینک اختصاصی
            </label>
            <input
              type="text"
              value={formData.typeUrl}
              onChange={(e) =>
                setFormData({ ...formData, typeUrl: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="مثال: ghazal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شاعر مرتبط *
            </label>
            <select
              value={formData.poetId}
              onChange={(e) =>
                setFormData({ ...formData, poetId: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- انتخاب شاعر --</option>
              {poets.map((poet) => (
                <option key={poet.id} value={poet.id}>
                  {poet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg text-white ${
                isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "در حال ذخیره..." : "ذخیره نوع شعر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
