"use client";
import Image from "next/image";
import { styles } from "@/app/[locale]/styles";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { TableRow } from "@/@types/database.types";
type SpecialPictureRow = Pick<
  TableRow<"special_picture">,
  "id" | "file_path" | "title" | "created_at"
>;

const Special = ({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ Fake async for Next.js compatibility
}) => {
  const [specials, setSpecials] = useState<
    Array<{
      id: number;
      title: string;
      imageUrl: string;
    }>
  >([]);

  useEffect(() => {
    let mounted = true;
    const fetchSpecials = async () => {
      const { data, error } = await supabase
        .from("special_picture")
        .select("id,file_path,title,created_at")
        .eq("display", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load specials:", error.message);
        return;
      }

      const mapped = (data ?? []).map((row: SpecialPictureRow) => {
        const { data: publicUrl } = supabase.storage
          .from("special_picture")
          .getPublicUrl(row.file_path);

        return {
          id: row.id,
          title: row.title ?? "Special",
          imageUrl: publicUrl.publicUrl,
        };
      });

      if (mounted) setSpecials(mapped);
    };

    fetchSpecials();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-10">
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>Specials</h1>
          <h1 className={`${styles.sectionHeadText} text-customGray`}>Latest specials</h1>
        </div>

        <article className="bg-[#19192C] rounded-[20px] w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] h-full p-14 flex flex-col justify-center items-center gap-4">
          {specials.map((poster) => (
            <article
              className="flex flex-col gap-3 items-center justify-center"
              key={poster.id}
            >
              <h2 className="text-[25px] sm:text-[30px] md:text-[40px] lg:text-[48px] text-[#ffffff] text-center font-poppins">
                {poster.title}
              </h2>
              <div className="w-[340px] md:w-[500px] lg:w-[700px]">
                <Image
                  src={poster.imageUrl}
                  alt={poster.title || "Special"}
                  width={700}
                  height={700}
                  sizes="(min-width:1024px) 700px, (min-width:768px) 500px, 340px"
                  className="rounded-[20px] h-auto w-full"
                />
              </div>
            </article>
          ))}
        </article>
      </section>

      {/* <div className="w-full flex justify-center">
        <Services />
      </div>
      <Locations /> */}
      {/* <Testimonials headingFlag={true} mode={"light"} /> */}
    </main>
  );
};

export default Special;
