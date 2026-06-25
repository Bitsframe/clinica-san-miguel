const SUPABASE_OBJECT_PUBLIC = "/storage/v1/object/public/";
const SUPABASE_RENDER_PUBLIC = "/storage/v1/render/image/public/";

/** Supabase Storage object URLs (often multi-MB originals) break Next.js image optimization. */
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(".supabase.co") && url.includes(SUPABASE_OBJECT_PUBLIC);
}

/**
 * Resize via Supabase Storage transforms so the browser (and Next.js) fetch KBs, not MBs.
 * Returns the original URL when it is not a Supabase public object URL.
 */
export function getSupabaseImageUrl(
  url: string,
  options: { width?: number; quality?: number } = {}
): string {
  if (!url || !isSupabaseStorageUrl(url)) {
    return url;
  }

  const width = options.width ?? 640;
  const quality = options.quality ?? 75;
  const withoutQuery = url.split("?")[0];
  const renderUrl = withoutQuery.replace(
    SUPABASE_OBJECT_PUBLIC,
    SUPABASE_RENDER_PUBLIC
  );

  return `${renderUrl}?width=${width}&quality=${quality}`;
}
