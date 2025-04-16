// app/poets/add/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPoet() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    region: "آذربایجان",
    language: "ترکی",
    birthDate: "",
    deathDate: "",
    imageUrl: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/poets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/poets");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">اضافه کردن شاعر جدید</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">نام شاعر</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">زندگینامه</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-2 border rounded h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">تاریخ تولد</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">تاریخ وفات</label>
            <input
              type="date"
              value={formData.deathDate}
              onChange={(e) =>
                setFormData({ ...formData, deathDate: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ذخیره شاعر
        </button>
      </form>
    </div>
  );
}
