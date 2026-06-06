type EndNoteProps = {
  end_tagline: string | null;
  note: string | null;
};

export default function EndNote({ end_tagline, note }: EndNoteProps) {
  if (!end_tagline && !note) return null;

  return (
    <section className="rounded-2xl border border-[#C1001F]/20 bg-[#F8F5F0] shadow-sm p-8 sm:p-10 space-y-2 max-w-3xl">
      {end_tagline && (
        <p className="text-xl sm:text-2xl font-bold font-poppins text-[#C1001F] leading-snug">
          {end_tagline}
        </p>
      )}
      {note && (
        <p className="text-sm sm:text-base text-[#3D3D3C] font-inter">{note}</p>
      )}
    </section>
  );
}
