export type AboutContentBlock =
  | { type: "heading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

export type AboutSection =
  | {
      type: "features";
      heading: string;
      items: string[];
      footer?: string;
    }
  | {
      type: "locations";
      heading: string;
      subheading?: string;
      cities: string[];
      footer?: string;
    }
  | {
      type: "message";
      heading: string;
      paragraphs: string[];
    }
  | {
      type: "tagline";
      content: string;
    };

export function splitTitle(title: string | null | undefined) {
  if (!title) return { eyebrow: "", headline: "" };

  const parts = title
    .split(/\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return { eyebrow: parts[0], headline: parts.slice(1).join(" ") };
  }

  return { eyebrow: "", headline: parts[0] ?? "" };
}

function isQuestionHeading(line: string) {
  return line.length <= 90 && line.endsWith("?");
}

function parseCities(text: string): string[] {
  return text
    .replace(/\band surrounding communities\.?/i, "")
    .split("•")
    .map((city) => city.trim())
    .filter(Boolean);
}

function isLocationLine(text: string) {
  return /\bTX\b/.test(text) || text.includes("•");
}

function isSectionTitleLine(line: string) {
  if (line.endsWith("?") || line.endsWith(":")) return false;
  if (isLocationLine(line)) return false;
  return /\b(across texas|our priority|is our priority|serving patients|tu salud|clínicas en|patients across|health is|salud es)\b/i.test(
    line
  );
}

function isFeatureItem(line: string) {
  if (line.endsWith(".") || line.endsWith("?") || line.endsWith(":")) return false;
  if (line.length > 100) return false;
  if (isLocationLine(line)) return false;
  if (isSectionTitleLine(line)) return false;
  return line.split(" ").length <= 8;
}

function isSectionHeading(line: string) {
  if (line.length > 90) return false;
  if (line.endsWith("?")) return true;
  if (line.endsWith(":")) return false;
  if (isSectionTitleLine(line)) return true;
  if (isFeatureItem(line)) return false;
  if (!line.endsWith(".") && line.split(" ").length <= 8) return true;
  return false;
}

export function parseAboutText(text: string | null | undefined): AboutContentBlock[] {
  if (!text) return [];

  const blocks = text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  const result: AboutContentBlock[] = [];

  for (const block of blocks) {
    const lines = block
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) continue;

    if (lines.length === 1) {
      const line = lines[0];
      result.push(
        isSectionHeading(line)
          ? { type: "heading", content: line }
          : { type: "paragraph", content: line }
      );
      continue;
    }

    if (lines.every(isFeatureItem)) {
      result.push({ type: "list", items: lines });
      continue;
    }

    if (isSectionHeading(lines[0])) {
      result.push({ type: "heading", content: lines[0] });
      const rest = lines.slice(1);
      if (rest.every(isFeatureItem)) {
        result.push({ type: "list", items: rest });
      } else {
        result.push({ type: "paragraph", content: rest.join(" ") });
      }
      continue;
    }

    result.push({ type: "paragraph", content: lines.join(" ") });
  }

  return result;
}

/** Merge feature lines that follow a question heading into one list block. */
export function coalesceFeatureLists(
  blocks: AboutContentBlock[]
): AboutContentBlock[] {
  const result: AboutContentBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    result.push(block);

    if (block.type === "heading" && isQuestionHeading(block.content)) {
      const items: string[] = [];
      i++;

      while (i < blocks.length) {
        const next = blocks[i];
        const text =
          next.type === "paragraph" || next.type === "heading"
            ? next.content
            : null;

        if (text && isFeatureItem(text) && !isLocationLine(text)) {
          items.push(text);
          i++;
          continue;
        }

        if (next.type === "list") {
          items.push(...next.items);
          i++;
          continue;
        }

        break;
      }

      if (items.length > 0) {
        result.push({ type: "list", items });
      }
      continue;
    }

    i++;
  }

  return result;
}

export function groupAboutSections(blocks: AboutContentBlock[]): AboutSection[] {
  const sections: AboutSection[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "heading") {
      const heading = block.content;
      i++;

      const featureItems: string[] = [];
      const paragraphs: string[] = [];
      let subheading: string | undefined;

      while (i < blocks.length && blocks[i].type !== "heading") {
        const current = blocks[i];
        if (current.type === "list") {
          featureItems.push(...current.items);
        } else if (current.type === "paragraph") {
          if (isFeatureItem(current.content) && !isLocationLine(current.content)) {
            featureItems.push(current.content);
          } else if (
            current.content.endsWith(":") &&
            current.content.length < 80
          ) {
            subheading = current.content;
          } else {
            paragraphs.push(current.content);
          }
        }
        i++;
      }

      if (isQuestionHeading(heading) && featureItems.length > 0) {
        sections.push({
          type: "features",
          heading,
          items: featureItems,
          footer: paragraphs[0],
        });
        if (paragraphs.length > 1) {
          sections.push({
            type: "message",
            heading: "",
            paragraphs: paragraphs.slice(1),
          });
        }
        continue;
      }

      const locationParagraph = paragraphs.find(isLocationLine);
      if (locationParagraph || heading.toLowerCase().includes("texas")) {
        const cities = locationParagraph ? parseCities(locationParagraph) : [];
        const footerParagraphs = paragraphs.filter((p) => p !== locationParagraph);
        sections.push({
          type: "locations",
          heading,
          subheading,
          cities,
          footer: footerParagraphs.join(" "),
        });
        continue;
      }

      sections.push({
        type: "message",
        heading,
        paragraphs,
      });
      continue;
    }

    if (block.type === "paragraph") {
      if (isLocationLine(block.content)) {
        sections.push({
          type: "locations",
          heading: "",
          cities: parseCities(block.content),
        });
      } else {
        sections.push({ type: "message", heading: "", paragraphs: [block.content] });
      }
      i++;
      continue;
    }

    if (block.type === "list") {
      sections.push({
        type: "features",
        heading: "",
        items: block.items,
      });
      i++;
    }
  }

  const normalized: AboutSection[] = [];

  for (const section of sections) {
    if (section.type !== "message" || section.paragraphs.length === 0) {
      normalized.push(section);
      continue;
    }

    const last = section.paragraphs[section.paragraphs.length - 1];
    const isTagline =
      last.length <= 100 &&
      (/\b(choose|elige|feel better|siéntete|sana más|heal faster)\b/i.test(last) ||
        last.split(".").filter(Boolean).length >= 2);

    if (isTagline && section.paragraphs.length > 1) {
      normalized.push({
        ...section,
        paragraphs: section.paragraphs.slice(0, -1),
      });
      normalized.push({ type: "tagline", content: last });
    } else if (isTagline && !section.heading) {
      normalized.push({ type: "tagline", content: last });
    } else {
      normalized.push(section);
    }
  }

  return normalized.filter((section) => {
    if (section.type === "message") {
      if (section.paragraphs.every(isLocationLine)) return false;
      return section.heading || section.paragraphs.length > 0;
    }
    if (section.type === "features") {
      return section.items.length > 0;
    }
    if (section.type === "locations") {
      return section.cities.length > 0 || section.heading;
    }
    return true;
  });
}

export function extractIntro(blocks: AboutContentBlock[]) {
  if (blocks.length === 0) return { intro: "", rest: [] };

  const [first, ...rest] = blocks;
  if (first.type === "paragraph") {
    return { intro: first.content, rest };
  }

  return { intro: "", rest: blocks };
}
