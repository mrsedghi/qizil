// app/poets/[id]/add-poem/page.js
"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddPoem() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audioFiles: [{ url: "", reciter: "" }],
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/poets/${params.id}/poems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        router.push(`/poets/${params.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">اضافه کردن شعر جدید</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">عنوان شعر</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">متن شعر (با حفظ خطوط جدید)</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-2 border rounded h-48 font-vazir text-lg leading-loose"
            required
          />
        </div>

        <div>
          <label className="block mb-1">تگ‌ها (با کاما جدا کنید)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="مثال: غزل,عاشقانه,حماسی"
          />
        </div>

        {formData.audioFiles.map((audio, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <h3 className="font-medium">خوانش {index + 1}</h3>
            <div>
              <label className="block mb-1">لینک فایل صوتی</label>
              <input
                type="url"
                value={audio.url}
                onChange={(e) => {
                  const newAudioFiles = [...formData.audioFiles];
                  newAudioFiles[index].url = e.target.value;
                  setFormData({ ...formData, audioFiles: newAudioFiles });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">نام خواننده</label>
              <input
                type="text"
                value={audio.reciter}
                onChange={(e) => {
                  const newAudioFiles = [...formData.audioFiles];
                  newAudioFiles[index].reciter = e.target.value;
                  setFormData({ ...formData, audioFiles: newAudioFiles });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              audioFiles: [...formData.audioFiles, { url: "", reciter: "" }],
            })
          }
          className="text-blue-600 hover:text-blue-800"
        >
          + افزودن خوانش دیگر
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ذخیره شعر
        </button>
      </form>
    </div>
  );
}
