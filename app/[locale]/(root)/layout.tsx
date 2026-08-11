import { Footer, Navbar } from "@/components";
import RenderTicker from "@/components/Navbar/RenderTicker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <main>
      <article className="relative h-10 w-full overflow-hidden bg-[#19192C] text-[#F8F5F0] sm:h-11">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#19192C] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#19192C] to-transparent sm:w-16" />
        <RenderTicker />
      </article>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}