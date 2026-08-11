import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET = "Hero_section";

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: files, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "name", order: "asc" } });

    if (error || !files) {
      return NextResponse.json({ urls: [] });
    }

    const imageFiles = files.filter(f =>
      /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name)
    );

    const urls = imageFiles.map(f => ({
      url: supabaseAdmin.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      alt: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    }));

    return NextResponse.json({ urls }, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ urls: [] });
  }
}
