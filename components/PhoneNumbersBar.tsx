import { Phone } from "lucide-react";

const locations = [
  {
    city: "Dallas",
    tel: "+14698868060",
    display: "(469) 886-8060",
  },
  {
    city: "Houston",
    tel: "+18328490946",
    display: "(832) 849-0946",
  },
  {
    city: "San Antonio",
    tel: "+12102512809",
    display: "(210) 251-2809",
  },
] as const;

export default function PhoneNumbersBar() {
  return (
    <section
      aria-label="Clinic phone numbers by location"
      className="w-full border-b border-gray-100 bg-gradient-to-r from-[#FAFAFA] via-white to-[#FAFAFA]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {locations.map((location) => (
            <a
              key={location.city}
              href={`tel:${location.tel}`}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-gray-200/80 bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm transition-all hover:border-[#C1001F]/25 hover:shadow-md hover:shadow-[#C1001F]/5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10 text-[#C1001F] transition-colors group-hover:bg-[#C1001F] group-hover:text-white">
                <Phone className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <span className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left leading-tight">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6C7582] font-poppins sm:text-[11px]">
                  {location.city}
                </span>
                <span className="hidden sm:inline h-3 w-px bg-gray-200" aria-hidden />
                <span className="text-sm font-semibold text-[#19192C] font-poppins whitespace-nowrap group-hover:text-[#C1001F] transition-colors">
                  {location.display}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
