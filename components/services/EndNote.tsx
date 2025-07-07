"use client";

type EndNoteProps = {
  end_tagline: string | null;
  note: string | null;
};

export default function EndNote({ end_tagline, note }: EndNoteProps) {
  if (!end_tagline && !note) return null;

  return (
    <section className="bg-white shadow rounded-lg p-6 border space-y-4">
      {end_tagline && (
        <p className="text-lg font-semibold text-[#C1001F]">{end_tagline}</p>
      )}

      {note && (
        <p className="text-sm text-gray-700">{note}</p>
      )}
    </section>
  );
}
