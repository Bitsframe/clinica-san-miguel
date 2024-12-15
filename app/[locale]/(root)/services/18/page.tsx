import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const locale = useLocale();

  return locale === "es" ? (
    <div className="mx-auto flex flex-col items-center gap-10 px-5 py-5 font-semibold text-black lg:w-4/5 xl:px-20">
  <h1 className="text-center text-6xl text-red-600">Prueba de ETS</h1>
  <div className="flex w-full flex-col lg:flex-row">
    <Image
      src="https://vsvueqtgulraaczqnnvh.supabase.co/storage/v1/object/public/services_images/STD%20test.png"
      width={1000}
      height={1000}
      alt="cover"
      className="aspect-square w-full bg-black/10 object-cover lg:w-1/3 lg:rounded-lg"
    />
    <div className="w-full space-y-8 bg-black/60 p-3 text-white lg:my-10 lg:w-2/3 lg:p-8">
      <h1 className="text-4xl font-semibold lg:text-6xl">Acerca de</h1>
      <p className="text-2xl font-light lg:text-3xl">
        Servicios confidenciales y completos de pruebas de ETS, enfatizando la detección temprana, el tratamiento y la educación para la salud sexual.
      </p>
    </div>
  </div>
  <p className="w-full text-2xl">
    Pruebas de enfermedades de transmisión sexual (ETS) en Clínica San Miguel
  </p>
  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-2xl font-bold text-red-600">
      ¿Qué son las Enfermedades de Transmisión Sexual?
    </h1>
    <p>
      Las enfermedades de transmisión sexual (ETS) son infecciones que pueden propagarse a través del contacto sexual con una persona infectada. Pueden causar una variedad de síntomas, desde leves hasta graves, y pueden transmitirse a través del contacto vaginal, anal u oral.
    </p>
    <p>
      En Clínica San Miguel, no necesitas hacer una cita. ¡Puedes venir a cualquiera de nuestras ubicaciones los 7 días de la semana!
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-2xl font-bold text-red-600">
      Pruebas de ETS:
    </h1>
    <p>
      Clínica San Miguel ofrece una variedad de pruebas de ETS, incluyendo:
    </p>
    <ul className="list-disc pl-5">
      <li>Pruebas de detección de gonorrea</li>
      <li>Pruebas de detección de sífilis</li>
      <li>Pruebas de detección de clamidia</li>
      <li>Pruebas de detección de VIH</li>
      <li>Pruebas de detección de virus del papiloma humano (VPH)</li>
      <li>Pruebas de detección de herpes simple</li>
    </ul>
    <p>
      Nuestros exámenes son rápidos, precisos y confidenciales. Los resultados pueden obtenerse en 24-48 horas.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-2xl font-bold text-red-600">
      Diagnóstico y Tratamiento:
    </h1>
    <p>
      Si das positivo en una prueba de ETS, nuestro equipo de médicos te proporcionará el tratamiento adecuado. El tratamiento para las ETS varía dependiendo del tipo de infección.
    </p>
    <p>
      En Clínica San Miguel, ofrecemos una variedad de opciones de tratamiento para las ETS, incluyendo:
    </p>
    <ul className="list-disc pl-5">
      <li>Medicamentos con receta</li>
      <li>Medicamentos inyectables en la clínica</li>
      <li>Terapias alternativas</li>
    </ul>
    <p>
      Trabajaremos contigo para encontrar el tratamiento que sea mejor para ti.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-2xl font-bold text-red-600">
      Enfermedades de Transmisión Sexual Más Comunes:
    </h1>
    <p>
      Las enfermedades de transmisión sexual más comunes en los Estados Unidos son:
    </p>
    <ul className="list-disc pl-5">
      <li>Gonorrea</li>
      <li>Sífilis</li>
      <li>Clamidia</li>
      <li>VIH</li>
      <li>VPH</li>
      <li>Herpes</li>
    </ul>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      Gonorrea:
    </h2>
    <p>
      La gonorrea es una infección bacteriana que puede causar una variedad de síntomas, incluyendo secreción vaginal o uretral, dolor al orinar y dolor testicular.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      Sífilis:
    </h2>
    <p>
      La sífilis es una infección bacteriana que puede causar una variedad de síntomas, incluyendo úlceras genitales, erupciones y pérdida de peso.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      Clamidia:
    </h2>
    <p>
      La clamidia es una infección bacteriana que puede causar una variedad de síntomas, incluyendo secreción vaginal o uretral, dolor al orinar y dolor pélvico.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      VIH:
    </h2>
    <p>
      El VIH es un virus que puede debilitar el sistema inmunológico. Si no se trata, el VIH puede causar SIDA.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      VPH:
    </h2>
    <p>
      El VPH es un virus que puede causar verrugas genitales y cáncer cervical.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      Herpes:
    </h2>
    <p>
      El herpes es un virus que puede causar llagas en los genitales u otras partes del cuerpo.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-2xl font-bold text-red-600">
      Tratamiento, Detección y Prevención:
    </h1>
    <p>
      El tratamiento para las ETS varía dependiendo del tipo de infección. En Clínica San Miguel, ofrecemos una variedad de opciones de tratamiento para las ETS, incluyendo medicamentos con receta, medicamentos de venta libre y terapias alternativas.
    </p>
    <p>
      La detección temprana es clave para un tratamiento efectivo de las ETS. Clínica San Miguel ofrece exámenes completos de ETS en todas las ubicaciones de Texas.
    </p>
    <p>
      La prevención de las ETS es importante. Hay varias cosas que puedes hacer para reducir tu riesgo de contraer una ETS, incluyendo:
    </p>
    <ul className="list-disc pl-5">
      <li>Ser sexualmente responsable</li>
      <li>Usar condones</li>
      <li>Limitar tus parejas sexuales</li>
    </ul>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h1 className="w-full text-3xl font-bold text-red-600">
      Preguntas Frecuentes
    </h1>
    <h2 className="w-full text-2xl font-bold text-red-600">
      ¿Cómo sé si tengo una ETS?
    </h2>
    <p>
      Los síntomas de las ETS pueden variar dependiendo del tipo de infección. Si tienes algún síntoma que te preocupe, es importante que te hagas una prueba.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      ¿Dónde puedo hacerme una prueba de ETS?
    </h2>
    <p>
      Clínica San Miguel ofrece exámenes completos de ETS en todas nuestras ubicaciones en Texas.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      ¿Cuánto cuesta una prueba de ETS?
    </h2>
    <p>
      El costo de una prueba de ETS puede variar dependiendo del tipo de prueba y del lugar donde se realice. En Clínica San Miguel, nuestras pruebas son asequibles y accesibles para todos.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      ¿Es confidencial la prueba de ETS?
    </h2>
    <p>
      Sí, tu prueba de ETS es confidencial. Tu información médica se mantendrá privada.
    </p>
  </section>

  <section className="w-full space-y-3 text-xl">
    <h2 className="w-full text-2xl font-bold text-red-600">
      ¿Qué pasa si mis pruebas resultan positivas para una ETS?
    </h2>
    <p>
      Si das positivo en una prueba de ETS, nuestro equipo de médicos te proporcionará el tratamiento adecuado. El tratamiento para las ETS varía dependiendo del tipo de infección.
    </p>
  </section>

  <h2 className="w-full text-2xl font-bold text-red-600">
    Atención Integral, Confidencial y Compasiva en Clínica San Miguel.
  </h2>
</div>

  ) : (
    <div className="mx-auto flex flex-col items-center gap-10 px-5 py-5 font-semibold text-black lg:w-4/5 xl:px-20">
      <h1 className="text-center text-6xl text-red-600">STD Test</h1>
      <div className="flex w-full flex-col lg:flex-row">
        <Image
          src="https://vsvueqtgulraaczqnnvh.supabase.co/storage/v1/object/public/services_images/STD%20test.png"
          width={1000}
          height={1000}
          alt="cover"
          className="aspect-square w-full object-contain bg-black/10 object-cover lg:w-1/3 lg:rounded-lg"
        />
        <div className="w-full space-y-8 bg-black/60 p-3 text-white lg:my-10 lg:w-2/3 lg:p-8">
          <h1 className="text-4xl font-semibold lg:text-6xl">About</h1>
          <p className="text-2xl font-light lg:text-3xl">
            Confidential and comprehensive STD testing services, emphasizing
            early detection, treatment, and education for sexual health.
          </p>
        </div>
      </div>
      <p className="w-full text-2xl">
      Sexually transmitted (STD) or (STD) testing at Clinica San Miguel
      </p>
      <section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-2xl font-bold text-red-600">
    What are Sexually Transmitted Diseases?
  </h1>
  <p>
    Sexually transmitted diseases (STDs) are infections that can be spread through sexual contact with an infected person. They can cause a variety of symptoms, from mild to severe, and can be transmitted through vaginal, anal, or oral contact.
  </p>
  <p>
    At Clinica San Miguel, you do not need to make an appointment. You can come to any of our locations 7 days a week!
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-2xl font-bold text-red-600">
    STD Tests:
  </h1>
  <p>
    Clinica San Miguel offers a variety of STD tests, including:
  </p>
  <ul className="list-disc pl-5">
    <li>Gonorrhea screening tests</li>
    <li>Syphilis Screening</li>
    <li>Chlamydia Screening</li>
    <li>HIV testing</li>
    <li>Human papillomavirus (HPV) testing</li>
    <li>Herpes simplex testing</li>
  </ul>
  <p>
    Our exams are fast, accurate, and confidential. Results can be obtained in 24-48 hours.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-2xl font-bold text-red-600">
    Diagnosis and Treatment:
  </h1>
  <p>
    If you test positive for an STD, our team of doctors will provide you with the appropriate treatment. Treatment for STDs varies depending on the type of infection.
  </p>
  <p>
    At Clinica San Miguel, we offer a variety of treatment options for STDs, including:
  </p>
  <ul className="list-disc pl-5">
    <li>Prescription medications</li>
    <li>Injectable medications in the clinic</li>
    <li>Alternative therapies</li>
  </ul>
  <p>
    We will work with you to find the treatment that is best for you.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-2xl font-bold text-red-600">
    Most Common Sexually Transmitted Diseases:
  </h1>
  <p>
    The most common sexually transmitted diseases in the United States are:
  </p>
  <ul className="list-disc pl-5">
    <li>Gonorrhea</li>
    <li>Syphilis</li>
    <li>Chlamydia</li>
    <li>HIV</li>
    <li>HPV</li>
    <li>Herpes</li>
  </ul>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Gonorrhea:
  </h2>
  <p>
    Gonorrhea is a bacterial infection that can cause a variety of symptoms, including vaginal or urethral discharge, painful urination, and testicular pain.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Syphilis:
  </h2>
  <p>
    Syphilis is a bacterial infection that can cause a variety of symptoms, including genital ulcers, rash, and weight loss.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Chlamydia:
  </h2>
  <p>
    Chlamydia is a bacterial infection that can cause a variety of symptoms, including vaginal or urethral discharge, painful urination, and pelvic pain.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    HIV:
  </h2>
  <p>
    HIV is a virus that can weaken the immune system. If left untreated, HIV can cause AIDS.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    HPV:
  </h2>
  <p>
    HPV is a virus which can cause genital warts and cervical cancer.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Herpes:
  </h2>
  <p>
    Herpes is a virus that can cause sores on the genitals or other parts of the body.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-2xl font-bold text-red-600">
    Treatment, Detection, and Prevention:
  </h1>
  <p>
    Treatment for STDs varies depending on the type of infection. At Clinica San Miguel, we offer a variety of treatment options for STDs, including prescription medications, over-the-counter medications, and alternative therapies.
  </p>
  <p>
    Early detection is key to effective STD treatment. Clinica San Miguel offers comprehensive STD screening at all Texas locations.
  </p>
  <p>
    STD prevention is important. There are a number of things you can do to reduce your risk of getting an STD, including:
  </p>
  <ul className="list-disc pl-5">
    <li>Be sexually responsible</li>
    <li>Use condoms</li>
    <li>Limit your sexual partners</li>
  </ul>
</section>

<section className="w-full space-y-3 text-xl">
  <h1 className="w-full text-3xl font-bold text-red-600">
    Frequently Asked Questions
  </h1>
  <h2 className="w-full text-2xl font-bold text-red-600">
    How do I know if I have an STD?
  </h2>
  <p>
    Symptoms of STDs can vary depending on the type of infection. If you have any symptoms that worry you, it is important to get tested.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Where can I get tested for an STD?
  </h2>
  <p>
    Clinica San Miguel offers comprehensive STD screening at all of our Texas locations.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    How much does an STD test cost?
  </h2>
  <p>
    The cost of an STD test can vary depending on the type of test and where it is performed. At Clinica San Miguel, our tests are affordable and accessible to everyone.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    Is the STD test confidential?
  </h2>
  <p>
    Yes, your STD test is confidential. Your medical information will be kept private.
  </p>
</section>

<section className="w-full space-y-3 text-xl">
  <h2 className="w-full text-2xl font-bold text-red-600">
    What happens if my tests come back positive for an STD?
  </h2>
  <p>
    If you test positive for an STD, our team of doctors will provide you with the appropriate treatment. Treatment for STDs varies depending on the type of infection.
  </p>
</section>

<h2 className="w-full text-2xl font-bold text-red-600">
  Comprehensive, Confidential, and Compassionate Care at Clinica San Miguel.
</h2>
</div>

  );
};

export default Home;
