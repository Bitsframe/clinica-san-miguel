import { Footer, Navbar } from "@/components";
import RenderTicker from "@/components/Navbar/RenderTicker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter()
  return (
    <main>
      <article className="h-[43px] w-full bg-[#19192C] flex justify-center items-center text-[12px] sm:text-[16px] text-center text-[#F8F5F0]">
        {/* {t("common:language_selection_description")} */}
        <RenderTicker />
      </article>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
