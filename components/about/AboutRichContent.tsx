"use client";

import {
  CircleDollarSign,
  Clock,
  Heart,
  Languages,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AboutSection } from "./parseAboutText";

type AboutRichContentProps = {
  sections: AboutSection[];
};

const FEATURE_ICONS: LucideIcon[] = [
  Stethoscope,
  Clock,
  Languages,
  CircleDollarSign,
  MapPin,
];

function FeaturesSection({
  heading,
  items,
  footer,
  badgeLabel,
}: {
  heading: string;
  items: string[];
  footer?: string;
  badgeLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10">
        <div className="lg:col-span-4 flex flex-col justify-center gap-4">
          {heading && (
            <>
              <span className="inline-flex w-fit items-center rounded-full bg-[#C1001F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C1001F]">
                {badgeLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins text-[#19192C] leading-tight">
                {heading}
              </h2>
              <div className="h-1 w-16 rounded-full bg-[#C1001F]" />
            </>
          )}
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <article
                key={index}
                className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-[#F8F5F0] p-5 transition-all hover:border-[#C1001F]/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C1001F] text-white shadow-sm transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1001F]/60">
                    0{index + 1}
                  </span>
                  <p className="text-sm sm:text-base font-medium text-[#19192C] font-inter leading-snug">
                    {item}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {footer && (
        <div className="border-t border-gray-100 bg-[#F8F5F0] px-6 sm:px-8 lg:px-10 py-5">
          <p className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed max-w-3xl">
            {footer}
          </p>
        </div>
      )}
    </section>
  );
}

function LocationsSection({
  heading,
  subheading,
  cities,
  footer,
}: {
  heading: string;
  subheading?: string;
  cities: string[];
  footer?: string;
}) {
  return (
    <section className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      <div className="bg-[#F8F5F0] px-6 sm:px-8 py-8 sm:py-10 space-y-3 border-b border-gray-100">
        {heading && (
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-base text-[#3D3D3C] font-inter">{subheading}</p>
        )}
      </div>

      {cities.length > 0 && (
        <div className="bg-white border-x border-b border-gray-100 px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-wrap gap-2.5">
            {cities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C1001F]/20 bg-[#C1001F]/5 px-4 py-2 text-sm font-medium text-[#19192C]"
              >
                <MapPin className="h-3.5 w-3.5 text-[#C1001F]" />
                {city}
              </span>
            ))}
          </div>
        </div>
      )}

      {footer && (
        <div className="border-x border-b border-gray-100 rounded-b-2xl bg-[#F8F5F0] px-6 sm:px-8 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10">
              <Search className="h-5 w-5 text-[#C1001F]" />
            </div>
            <p className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed">
              {footer}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function WellnessSection({
  heading,
  paragraphs,
  t,
}: {
  heading: string;
  paragraphs: string[];
  t: (key: string) => string;
}) {
  if (paragraphs.length === 0 && !heading) return null;

  const highlights = [
    { icon: Shield, label: t("wellness_quality") },
    { icon: Heart, label: t("wellness_compassion") },
    { icon: Sparkles, label: t("wellness_convenience") },
  ];

  return (
    <section className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#F8F5F0] p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-6">
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C] leading-tight">
              {heading}
            </h2>
          )}
          <div className="grid grid-cols-3 gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1001F] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#19192C]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessageSection({
  heading,
  paragraphs,
  t,
}: {
  heading: string;
  paragraphs: string[];
  t: (key: string) => string;
}) {
  if (paragraphs.length === 0 && !heading) return null;

  if (heading) {
    return <WellnessSection heading={heading} paragraphs={paragraphs} t={t} />;
  }

  return (
    <section className="rounded-xl bg-[#F8F5F0] border border-[#e8e4df] px-6 py-5 sm:px-8 sm:py-6 space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function TaglineBanner({ content }: { content: string }) {
  return (
    <section className="rounded-2xl border border-[#C1001F]/20 bg-[#F8F5F0] px-6 sm:px-10 py-8 sm:py-10 text-center shadow-sm">
      <p className="text-xl sm:text-2xl font-bold font-poppins text-[#C1001F] leading-snug">
        {content}
      </p>
    </section>
  );
}

export default function AboutRichContent({ sections }: AboutRichContentProps) {
  const t = useTranslations("about_page");

  if (sections.length === 0) return null;

  return (
    <div className="space-y-10 sm:space-y-14">
      {sections.map((section, index) => {
        switch (section.type) {
          case "features":
            return (
              <FeaturesSection
                key={index}
                heading={section.heading}
                items={section.items}
                footer={section.footer}
                badgeLabel={t("our_promise")}
              />
            );
          case "locations":
            return (
              <LocationsSection
                key={index}
                heading={section.heading}
                subheading={section.subheading}
                cities={section.cities}
                footer={section.footer}
              />
            );
          case "message":
            return (
              <MessageSection
                key={index}
                heading={section.heading}
                paragraphs={section.paragraphs}
                t={t}
              />
            );
          case "tagline":
            return <TaglineBanner key={index} content={section.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
