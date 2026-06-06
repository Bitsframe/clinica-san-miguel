import { career_cover } from "@/assets/images";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Opportunities } from "@/sections/Career/Opportunities";
import { Briefcase, HeartHandshake, TrendingUp, Users } from "lucide-react";

export default async function CareerPage() {
  const t = await getTranslations("career");

  const pillars = [
    {
      icon: HeartHandshake,
      title: t("pillar_1_title"),
      description: t("pillar_1_desc"),
    },
    {
      icon: Users,
      title: t("pillar_2_title"),
      description: t("pillar_2_desc"),
    },
    {
      icon: TrendingUp,
      title: t("pillar_3_title"),
      description: t("pillar_3_desc"),
    },
  ];

  return (
    <main className="w-full py-8 sm:py-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F]">
            {t("career_title")}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] leading-tight">
            {t("career_sub_title")}
          </h1>
          <p className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed">
            {t("career_description")}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-[#F8F5F0]">
          <Image
            src={career_cover}
            alt={t("career_sub_title")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1152px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#19192C]/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#19192C] shadow-sm">
              <Briefcase className="h-4 w-4 text-[#C1001F]" />
              {t("hero_badge")}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C1001F]/10">
                <Icon className="h-5 w-5 text-[#C1001F]" />
              </div>
              <h2 className="text-lg font-semibold font-poppins text-[#19192C]">
                {title}
              </h2>
              <p className="text-sm text-[#3D3D3C] font-inter leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
              {t("opportunities_title")}
            </h2>
            <p className="text-base text-[#6C7582] font-inter">
              {t("opportunities_subtitle")}
            </p>
          </div>
          <Opportunities />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-[#F8F5F0] px-6 sm:px-10 py-10 sm:py-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
            {t("cta_title")}
          </h2>
          <p className="text-base text-[#3D3D3C] font-inter max-w-xl mx-auto leading-relaxed">
            {t("cta_description")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#C1001F] px-8 py-3.5 text-sm font-semibold font-poppins text-white shadow-sm hover:bg-[#a30019] transition-colors"
          >
            {t("cta_button")}
          </Link>
        </div>
      </section>
    </main>
  );
}
