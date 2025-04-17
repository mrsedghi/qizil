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
    poemType: "GHAZAL",
    audioFiles: [{ url: "", reciter: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/poets/${params.id}/poems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/poets/${params.id}`);
        router.refresh();
      } else {
        console.error("Error:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAudioField = () => {
    setFormData({
      ...formData,
      audioFiles: [...formData.audioFiles, { url: "", reciter: "" }],
    });
  };

  const removeAudioField = (index) => {
    const newAudioFiles = formData.audioFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, audioFiles: newAudioFiles });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          اضافه کردن شعر جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poem Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              عنوان شعر
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              placeholder="عنوان شعر را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              نوع شعر
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.poemType}
              onChange={(e) =>
                setFormData({ ...formData, poemType: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="GHAZAL">غزل</option>
              <option value="MASNAVI">مثنوی</option>
              <option value="GHASIDEH">قصیده</option>
              <option value="ROBBAEI">رباعی</option>
              <option value="DOBEITI">دوبیتی</option>
              <option value="HEJAI">هجایی</option>
              <option value="OTHER">سایر</option>
            </select>
          </div>

          {/* Poem Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              متن شعر
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-green-500 focus:border-transparent font-vazir text-lg leading-loose"
              required
              placeholder="متن شعر را با حفظ خطوط جدید وارد کنید"
            />
          </div>

          {/* Audio Files */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">
              خوانش‌های صوتی
            </h2>

            {formData.audioFiles.map((audio, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">
                    خوانش {index + 1}
                  </h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeAudioField(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      حذف
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 mb-1">
                      لینک فایل صوتی
                    </label>
                    <input
                      type="url"
                      value={audio.url}
                      onChange={(e) => {
                        const newAudioFiles = [...formData.audioFiles];
                        newAudioFiles[index].url = e.target.value;
                        setFormData({ ...formData, audioFiles: newAudioFiles });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">
                      نام خواننده
                    </label>
                    <input
                      type="text"
                      value={audio.reciter}
                      onChange={(e) => {
                        const newAudioFiles = [...formData.audioFiles];
                        newAudioFiles[index].reciter = e.target.value;
                        setFormData({ ...formData, audioFiles: newAudioFiles });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="نام خواننده"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAudioField}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              افزودن خوانش دیگر
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره شعر"}
          </button>
        </form>
      </div>
    </div>
  );
}
