/**
 * Per-city page copy.
 *
 * Every factual claim here is derived from data already in the Locations table
 * (addresses, hours, phone numbers) or from pricing stated elsewhere on the
 * site ($19 office visit, $220 immigration exam). No medical claims and no
 * prices beyond those two are asserted — if a price isn't confirmed, the copy
 * points the reader to the clinic rather than inventing a figure.
 */

export type CityCopy = {
  /** Opening paragraph — who we are in this city and where. */
  intro: string;
  /** What people come here for, and what it costs. */
  services: string;
  /** Practical detail: hours, walk-ins, languages, payment. */
  visiting: string;
};

type CityContent = { en: CityCopy; es: CityCopy };

const WALKIN_EN =
  "No appointment is needed. Walk in during opening hours and our bilingual front desk will get you checked in.";
const WALKIN_ES =
  "No necesita cita previa. Visítenos durante nuestro horario y nuestro personal bilingüe le atenderá en recepción.";

export const CITY_CONTENT: Record<string, CityContent> = {
  dallas: {
    en: {
      intro:
        "Clinica San Miguel operates three walk-in family medicine clinics across Dallas: Dallas East on East Northwest Highway near White Rock, Dallas NW on West Northwest Highway, and our Jefferson Boulevard location in Oak Cliff. Each is a full family practice serving patients of all ages, with English- and Spanish-speaking providers at every site.",
      services:
        "Our Dallas clinics handle everyday primary care alongside the paperwork visits people actually need: DOT physical exams for commercial drivers, school and sports physicals, and USCIS immigration medical exams performed by certified civil surgeons for $220. Office visits start at $19. On-site services include EKGs, ultrasounds, and bloodwork, so most visits are handled in a single trip.",
      visiting:
        "All three Dallas locations are open Monday through Friday from 10:00 am to 8:00 pm, and 10:00 am to 5:00 pm on Saturday and Sunday — including evenings and weekends, for people who cannot take time off during the workday. No insurance is required and pricing is transparent, paid at the visit.",
    },
    es: {
      intro:
        "Clínica San Miguel cuenta con tres clínicas de medicina familiar sin cita previa en Dallas: Dallas East sobre East Northwest Highway cerca de White Rock, Dallas NW sobre West Northwest Highway, y nuestra sucursal de Jefferson Boulevard en Oak Cliff. Cada una es una práctica familiar completa que atiende a pacientes de todas las edades, con proveedores que hablan inglés y español.",
      services:
        "Nuestras clínicas en Dallas atienden la medicina general del día a día junto con los exámenes que la gente realmente necesita: exámenes físicos DOT para conductores comerciales, exámenes físicos escolares y deportivos, y exámenes médicos de inmigración de USCIS realizados por médicos civiles certificados por $220. Las consultas comienzan desde $19. Realizamos electrocardiogramas, ultrasonidos y análisis de sangre en el mismo lugar.",
      visiting:
        "Las tres sucursales de Dallas abren de lunes a viernes de 10:00 am a 8:00 pm, y de 10:00 am a 5:00 pm los sábados y domingos — incluyendo tardes y fines de semana, para quienes no pueden faltar al trabajo. No se requiere seguro médico y los precios son transparentes, pagados en el momento de la visita.",
    },
  },

  houston: {
    en: {
      intro:
        "We run four walk-in clinics across the Houston area: Channelview on the East Freeway, Fondren Road in southwest Houston, Highway 6 North on the west side, and Veterans Memorial Drive in north Houston. Between them they cover most of the metro, and every location has English- and Spanish-speaking staff.",
      services:
        "Houston patients come to us for primary care, chronic condition management, women's health, children's healthcare, and the certification visits that are hard to schedule elsewhere — DOT physicals, school physicals, and USCIS immigration medical exams at $220 with a certified civil surgeon. Office visits start at $19, with EKG, ultrasound and lab work available on site.",
      visiting:
        "All four Houston clinics are open Monday through Friday, 10:00 am to 8:00 pm, and 10:00 am to 5:00 pm on Saturday and Sunday. No insurance and no appointment are required — walk in, and you will be seen. Payment is due at the visit with no hidden charges.",
    },
    es: {
      intro:
        "Contamos con cuatro clínicas sin cita previa en el área de Houston: Channelview sobre East Freeway, Fondren Road en el suroeste de Houston, Highway 6 North en el oeste, y Veterans Memorial Drive en el norte de Houston. Entre todas cubren la mayor parte del área metropolitana, y en cada sucursal hay personal que habla inglés y español.",
      services:
        "Nuestros pacientes en Houston nos visitan para medicina general, manejo de enfermedades crónicas, salud de la mujer, atención infantil y los exámenes de certificación difíciles de agendar en otro lugar: exámenes físicos DOT, exámenes escolares y exámenes médicos de inmigración de USCIS por $220 con un médico civil certificado. Las consultas comienzan desde $19, con electrocardiograma, ultrasonido y laboratorio disponibles en el mismo lugar.",
      visiting:
        "Las cuatro clínicas de Houston abren de lunes a viernes de 10:00 am a 8:00 pm, y de 10:00 am a 5:00 pm los sábados y domingos. No se requiere seguro ni cita previa — visítenos y será atendido. El pago se realiza en el momento de la consulta, sin cargos ocultos.",
    },
  },

  "san-antonio": {
    en: {
      intro:
        "Clinica San Miguel has three San Antonio clinics: Blanco Road in the north central area, Nacogdoches Road on the northeast side, and SW Military Drive on the south side. All three are walk-in family medicine practices with bilingual providers, serving patients from young children through seniors.",
      services:
        "Our San Antonio locations offer general medical consultations, preventive screenings, diabetes and blood pressure management, women's preventive care, and immigration medical exams performed by USCIS-certified civil surgeons for $220. Office visits are $19. Ultrasound, EKG and blood testing are available without a referral.",
      visiting:
        "All three clinics open Monday through Friday from 10:00 am to 8:00 pm and Saturday from 10:00 am to 5:00 pm. SW Military Drive is also open Sunday 10:00 am to 5:00 pm; Blanco Road and Nacogdoches Road are closed Sundays. No insurance required, and no appointment needed.",
    },
    es: {
      intro:
        "Clínica San Miguel tiene tres sucursales en San Antonio: Blanco Road en el área norte central, Nacogdoches Road en el noreste, y SW Military Drive en el sur. Las tres son clínicas de medicina familiar sin cita previa con proveedores bilingües, que atienden desde niños pequeños hasta adultos mayores.",
      services:
        "Nuestras sucursales de San Antonio ofrecen consultas médicas generales, exámenes preventivos, manejo de diabetes y presión arterial, atención preventiva para la mujer, y exámenes médicos de inmigración realizados por médicos civiles certificados por USCIS por $220. Las consultas cuestan $19. Ultrasonido, electrocardiograma y análisis de sangre están disponibles sin necesidad de referencia.",
      visiting:
        "Las tres clínicas abren de lunes a viernes de 10:00 am a 8:00 pm y los sábados de 10:00 am a 5:00 pm. SW Military Drive también abre los domingos de 10:00 am a 5:00 pm; Blanco Road y Nacogdoches Road cierran los domingos. No se requiere seguro ni cita previa.",
    },
  },

  "fort-worth": {
    en: {
      intro:
        "Two Clinica San Miguel clinics serve Fort Worth: our East Seminary Drive location on the south side, and River Oaks Boulevard to the northwest. Both are walk-in family medicine practices with English- and Spanish-speaking staff, treating patients of all ages.",
      services:
        "Fort Worth patients visit us for routine check-ups, chronic condition management, children's healthcare, and certification exams including DOT physicals, school physicals, and USCIS immigration medical exams at $220. Office visits start at $19, and on-site EKG, ultrasound and lab work mean most concerns are handled in one appointment-free visit.",
      visiting:
        "River Oaks Boulevard is open Monday through Friday from 10:00 am to 8:00 pm; East Seminary Drive runs 10:00 am to 5:00 pm. Both open Saturday and Sunday from 10:00 am to 5:00 pm. No insurance needed, and payment is taken at the visit.",
    },
    es: {
      intro:
        "Dos sucursales de Clínica San Miguel atienden Fort Worth: nuestra ubicación en East Seminary Drive en el sur, y River Oaks Boulevard al noroeste. Ambas son clínicas de medicina familiar sin cita previa con personal que habla inglés y español, y atienden a pacientes de todas las edades.",
      services:
        "Nuestros pacientes en Fort Worth nos visitan para chequeos de rutina, manejo de enfermedades crónicas, atención infantil y exámenes de certificación como los físicos DOT, exámenes escolares y exámenes médicos de inmigración de USCIS por $220. Las consultas comienzan desde $19, y realizamos electrocardiograma, ultrasonido y laboratorio en el mismo lugar.",
      visiting:
        "River Oaks Boulevard abre de lunes a viernes de 10:00 am a 8:00 pm; East Seminary Drive de 10:00 am a 5:00 pm. Ambas abren sábados y domingos de 10:00 am a 5:00 pm. No se requiere seguro y el pago se realiza en la visita.",
    },
  },

  arlington: {
    en: {
      intro:
        "Our Arlington clinic sits on East Park Row Drive, centrally placed between Dallas and Fort Worth and convenient for patients across the mid-cities. It is a full walk-in family medicine practice with bilingual providers, treating everyone from young children to seniors.",
      services:
        "The Arlington clinic covers primary care, preventive screenings, diabetes and hypertension management, women's health, and the certification visits people need for work and school — DOT physicals, school physicals, and USCIS immigration medical exams for $220 with a certified civil surgeon. Office visits start at $19, with EKG, ultrasound and blood testing available on site.",
      visiting:
        "Open Monday through Friday from 10:00 am to 8:00 pm, and Saturday and Sunday from 10:00 am to 5:00 pm — seven days a week, including evenings. " +
        WALKIN_EN,
    },
    es: {
      intro:
        "Nuestra clínica en Arlington se encuentra sobre East Park Row Drive, ubicada entre Dallas y Fort Worth y conveniente para pacientes de toda la zona intermedia. Es una práctica de medicina familiar sin cita previa con proveedores bilingües, que atiende desde niños pequeños hasta adultos mayores.",
      services:
        "La clínica de Arlington cubre medicina general, exámenes preventivos, manejo de diabetes e hipertensión, salud de la mujer, y los exámenes que la gente necesita para el trabajo y la escuela: físicos DOT, exámenes escolares y exámenes médicos de inmigración de USCIS por $220 con un médico civil certificado. Las consultas comienzan desde $19, con electrocardiograma, ultrasonido y análisis de sangre disponibles en el lugar.",
      visiting:
        "Abierto de lunes a viernes de 10:00 am a 8:00 pm, y sábados y domingos de 10:00 am a 5:00 pm — siete días a la semana, incluyendo tardes. " +
        WALKIN_ES,
    },
  },

  pasadena: {
    en: {
      intro:
        "Our Pasadena clinic is on Shaver Street, serving Pasadena and the surrounding southeast Houston communities. It is a walk-in family medicine practice staffed by English- and Spanish-speaking providers, open to patients of every age.",
      services:
        "Pasadena patients come to us for general consultations, chronic condition care, children's healthcare, women's preventive screenings, and certification exams including DOT physicals and USCIS immigration medical exams at $220. Office visits start at $19. EKG, ultrasound and bloodwork are handled in-clinic.",
      visiting:
        "Open Monday through Friday, 10:00 am to 8:00 pm, and Saturday and Sunday from 10:00 am to 5:00 pm. " +
        WALKIN_EN,
    },
    es: {
      intro:
        "Nuestra clínica de Pasadena está sobre Shaver Street, atendiendo a Pasadena y las comunidades del sureste de Houston. Es una práctica de medicina familiar sin cita previa con proveedores que hablan inglés y español, abierta a pacientes de todas las edades.",
      services:
        "Nuestros pacientes en Pasadena nos visitan para consultas generales, atención de enfermedades crónicas, salud infantil, exámenes preventivos para la mujer y exámenes de certificación como los físicos DOT y los exámenes médicos de inmigración de USCIS por $220. Las consultas comienzan desde $19. Realizamos electrocardiograma, ultrasonido y análisis de sangre en la clínica.",
      visiting:
        "Abierto de lunes a viernes de 10:00 am a 8:00 pm, y sábados y domingos de 10:00 am a 5:00 pm. " +
        WALKIN_ES,
    },
  },

  spring: {
    en: {
      intro:
        "Our Spring clinic sits directly on Interstate 45, north of Houston, making it straightforward to reach from Spring, The Woodlands and the surrounding north Harris County communities. It is a walk-in family medicine practice with bilingual staff.",
      services:
        "The Spring clinic provides primary care, preventive screenings, diabetes and blood pressure management, children's healthcare, and certification visits including DOT physicals, school physicals, and USCIS immigration medical exams for $220. Office visits start at $19, with on-site EKG, ultrasound and laboratory testing.",
      visiting:
        "Open Monday through Friday from 10:00 am to 8:00 pm, and Saturday and Sunday from 10:00 am to 5:00 pm. " +
        WALKIN_EN,
    },
    es: {
      intro:
        "Nuestra clínica de Spring se encuentra directamente sobre la Interestatal 45, al norte de Houston, lo que facilita llegar desde Spring, The Woodlands y las comunidades del norte del condado de Harris. Es una clínica de medicina familiar sin cita previa con personal bilingüe.",
      services:
        "La clínica de Spring ofrece medicina general, exámenes preventivos, manejo de diabetes y presión arterial, atención infantil y exámenes de certificación como los físicos DOT, exámenes escolares y exámenes médicos de inmigración de USCIS por $220. Las consultas comienzan desde $19, con electrocardiograma, ultrasonido y laboratorio en el lugar.",
      visiting:
        "Abierto de lunes a viernes de 10:00 am a 8:00 pm, y sábados y domingos de 10:00 am a 5:00 pm. " +
        WALKIN_ES,
    },
  },

  fresno: {
    en: {
      intro:
        "Our Fresno clinic is located on Highway 6 in Fort Bend County, serving Fresno, Arcola and the surrounding communities south of Houston. It is a walk-in family medicine practice with English- and Spanish-speaking providers.",
      services:
        "Fresno patients visit for everyday primary care, preventive screenings, chronic condition management, children's healthcare, and certification exams including DOT physicals and USCIS immigration medical exams at $220. Office visits start at $19, and EKG, ultrasound and blood testing are available without a referral.",
      visiting:
        "Open Monday through Friday from 10:00 am to 8:00 pm, and Saturday and Sunday from 10:00 am to 5:00 pm. " +
        WALKIN_EN,
    },
    es: {
      intro:
        "Nuestra clínica de Fresno está ubicada sobre la Highway 6 en el condado de Fort Bend, atendiendo a Fresno, Arcola y las comunidades al sur de Houston. Es una práctica de medicina familiar sin cita previa con proveedores que hablan inglés y español.",
      services:
        "Nuestros pacientes en Fresno nos visitan para medicina general, exámenes preventivos, manejo de enfermedades crónicas, atención infantil y exámenes de certificación como los físicos DOT y los exámenes médicos de inmigración de USCIS por $220. Las consultas comienzan desde $19, y el electrocardiograma, ultrasonido y análisis de sangre están disponibles sin referencia.",
      visiting:
        "Abierto de lunes a viernes de 10:00 am a 8:00 pm, y sábados y domingos de 10:00 am a 5:00 pm. " +
        WALKIN_ES,
    },
  },

  "farmers-branch": {
    en: {
      intro:
        "Our Farmers Branch clinic is on South Josey Lane, convenient for patients across Farmers Branch, Carrollton and northwest Dallas. It is a full walk-in family medicine practice with bilingual providers treating patients of all ages.",
      services:
        "The Farmers Branch clinic handles primary care, preventive screenings, diabetes and hypertension management, women's health, children's healthcare, and certification visits including DOT physicals, school physicals, and USCIS immigration medical exams for $220. Office visits start at $19, with EKG, ultrasound and lab work on site.",
      visiting:
        "Open Monday through Friday from 10:00 am to 8:00 pm, and Saturday and Sunday from 10:00 am to 5:00 pm. " +
        WALKIN_EN,
    },
    es: {
      intro:
        "Nuestra clínica de Farmers Branch está sobre South Josey Lane, conveniente para pacientes de Farmers Branch, Carrollton y el noroeste de Dallas. Es una práctica completa de medicina familiar sin cita previa con proveedores bilingües que atienden a pacientes de todas las edades.",
      services:
        "La clínica de Farmers Branch atiende medicina general, exámenes preventivos, manejo de diabetes e hipertensión, salud de la mujer, atención infantil y exámenes de certificación como los físicos DOT, exámenes escolares y exámenes médicos de inmigración de USCIS por $220. Las consultas comienzan desde $19, con electrocardiograma, ultrasonido y laboratorio en el lugar.",
      visiting:
        "Abierto de lunes a viernes de 10:00 am a 8:00 pm, y sábados y domingos de 10:00 am a 5:00 pm. " +
        WALKIN_ES,
    },
  },
};

export function getCityCopy(citySlug: string, locale: string): CityCopy | null {
  const entry = CITY_CONTENT[citySlug];
  if (!entry) return null;
  return locale === "es" ? entry.es : entry.en;
}
