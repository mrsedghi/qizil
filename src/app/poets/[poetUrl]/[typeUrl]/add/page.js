//app/poets/[poetUrl]/[typeUrl]/add/page.js

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSnackbar } from "@/app/hooks/useSnackbar";

export default function AddPoem() {
  const params = useParams();
  const router = useRouter();
  const [poet, setPoet] = useState(null);
  const [poemType, setPoemType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: 0,
    audioFiles: [{ url: "", reciter: "", format: "mp3", duration: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch poet and poem type data from API
        const response = await fetch(
          `/api/poets/${params.poetUrl}/${params.typeUrl}/add`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (!data.poet || !data.poemType) {
          router.push("/404");
          return;
        }

        setPoet(data.poet);
        setPoemType(data.poemType);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.poetUrl, params.typeUrl, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!poet || !poemType) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/poets/${params.poetUrl}/${params.typeUrl}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Show error message from response or default message
        const errorMessage = data.error || "Failed to create poem";
        showSnackbar(errorMessage, { variant: "error" });

        return;
      }

      if (data) {
        showSnackbar("شعر با موفقیت اضافه شد", { variant: "success" });
        router.push(`/poets/${params.poetUrl}/${params.typeUrl}`);
      }
    } catch (error) {
      console.error("Error creating poem:", error);
      showSnackbar("خطایی در ارتباط با سرور رخ داد", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAudioField = () => {
    setFormData({
      ...formData,
      audioFiles: [
        ...formData.audioFiles,
        { url: "", reciter: "", format: "mp3", duration: 0 },
      ],
    });
  };

  const removeAudioField = (index) => {
    const newAudioFiles = formData.audioFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, audioFiles: newAudioFiles });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!poet || !poemType) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Data not found
          </h1>
          <p className="text-gray-600">
            The requested poet or poem type could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          اضافه کردن شعر جدید
        </h1>
        <p className="text-gray-600 mb-6">
          برای شاعر: {poet.name} - نوع شعر: {poemType.name}
        </p>

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

          {/* Poem Order */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ترتیب نمایش
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="عدد ترتیب نمایش"
            />
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
                      <span className="text-red-500">*</span>
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
                      <span className="text-red-500">*</span>
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
                  <div className="grid grid-cols-2 gap-4"></div>
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
