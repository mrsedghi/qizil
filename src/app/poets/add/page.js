// app/poets/add/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddPoet() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    century: "",
    imageFile: null,
    poetUrl: "", // اضافه کردن فیلد لینک اختصاصی
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const centuries = [
    "یکم",
    "دوم",
    "سوم",
    "چهارم",
    "پنجم",
    "ششم",
    "هفتم",
    "هشتم",
    "نهم",
    "دهم",
    "یازدهم",
    "دوازدهم",
    "سیزدهم",
    "چهاردهم",
    "معاصر",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("لطفا فقط فایل تصویری انتخاب کنید");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("حجم فایل باید کمتر از ۲ مگابایت باشد");
        return;
      }

      setFormData({ ...formData, imageFile: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePoetUrl = (name) => {
    return name.replace(/\s+/g, "-").toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.century) {
      alert("لطفا نام شاعر و قرن را وارد کنید");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = "";

      // آپلود عکس اگر وجود دارد
      if (formData.imageFile) {
        const formDataImg = new FormData();
        formDataImg.append("file", formData.imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataImg,
        });

        if (!uploadResponse.ok) {
          throw new Error("خطا در آپلود عکس");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // تولید لینک اختصاصی اگر وارد نشده
      const finalPoetUrl = formData.poetUrl || generatePoetUrl(formData.name);

      // ذخیره اطلاعات شاعر
      const response = await fetch("/api/poets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          century: formData.century,
          imageUrl: imageUrl,
          poetUrl: finalPoetUrl, // اضافه کردن لینک اختصاصی
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در ذخیره اطلاعات شاعر");
      }

      router.push(`poets/${poetUrl}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "خطایی رخ داده است");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">افزودن شاعر جدید</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            بازگشت
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام شاعر *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="نام کامل شاعر"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قرن قمری *
              </label>
              <select
                value={formData.century}
                onChange={(e) =>
                  setFormData({ ...formData, century: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- انتخاب قرن --</option>
                {centuries.map((century) => (
                  <option key={century} value={century}>
                    قرن {century}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              لینک اختصاصی
            </label>
            <div className="flex items-center">
              <span className="mr-2 text-gray-500">qizil.com/poets/</span>
              <input
                type="text"
                value={formData.poetUrl}
                onChange={(e) =>
                  setFormData({ ...formData, poetUrl: e.target.value })
                }
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="لینک-اختصاصی"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              اگر خالی بگذارید به صورت خودکار ایجاد می‌شود
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              زندگینامه
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="خلاصه‌ای از زندگی و آثار شاعر..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عکس شاعر
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">برای آپلود کلیک کنید</span>{" "}
                    یا فایل را بکشید و رها کنید
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (حداکثر ۲MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
              </label>

              {previewImage && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={previewImage}
                    alt="پیش‌نمایش عکس شاعر"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ذخیره...
                </span>
              ) : (
                "ذخیره شاعر"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
