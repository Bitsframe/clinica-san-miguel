export type City = {
  slug: string;
  name: string;
  nameEs: string;
};

/** The 9 cities Clinica San Miguel operates in, keyed by the `city` column on Locations. */
export const CITIES: City[] = [
  { slug: "dallas", name: "Dallas", nameEs: "Dallas" },
  { slug: "houston", name: "Houston", nameEs: "Houston" },
  { slug: "san-antonio", name: "San Antonio", nameEs: "San Antonio" },
  { slug: "fort-worth", name: "Fort Worth", nameEs: "Fort Worth" },
  { slug: "arlington", name: "Arlington", nameEs: "Arlington" },
  { slug: "farmers-branch", name: "Farmers Branch", nameEs: "Farmers Branch" },
  { slug: "fresno", name: "Fresno", nameEs: "Fresno" },
  { slug: "pasadena", name: "Pasadena", nameEs: "Pasadena" },
  { slug: "spring", name: "Spring", nameEs: "Spring" },
];

const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export function getCityBySlug(slug: string): City | undefined {
  return CITY_BY_SLUG.get(slug);
}
