import { supabase } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "فایلی دریافت نشد" }, { status: 400 });
    }

    // ایجاد نام منحصر به فرد برای فایل
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `poets/${fileName}`;

    // آپلود به Supabase Storage
    const { data, error } = await supabase.storage
      .from("poets-images")
      .upload(filePath, file);

    if (error) throw error;

    // دریافت URL عمومی
    const {
      data: { publicUrl },
    } = supabase.storage.from("poets-images").getPublicUrl(data.path);

    return Response.json({ url: publicUrl });
  } catch (error) {
    console.error("Error details:", error);
    return Response.json(
      { error: `خطا در آپلود عکس: ${error.message}` },
      { status: 500 }
    );
  }
}
