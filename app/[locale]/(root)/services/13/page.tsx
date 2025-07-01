import { useLocale } from "next-intl";
import Image from "next/image";


const Home = () => {
  const locale = useLocale();

  return locale === "es" ? (
    <div className="mx-auto flex flex-col items-center gap-10 px-5 py-5 font-semibold text-black lg:w-4/5 xl:px-20">
      <h1 className="text-center text-6xl text-red-600">Cuidado Prenatal</h1>
      <div className="flex w-full flex-col lg:flex-row">
        <Image
          src="https://vsvueqtgulraaczqnnvh.supabase.co/storage/v1/object/public/services_images/Prenatal%20care.png?t=2024-02-11T07%3A01%3A56.078Z"
          width={1000}
          height={1000}
          alt="cover"
          className="aspect-square w-full bg-black/10 object-cover lg:w-1/3 lg:rounded-lg"
        />
        <div className="w-full space-y-8 bg-black/60 p-3 text-white lg:my-10 lg:w-2/3 lg:p-8">
          <h1 className="text-4xl font-semibold lg:text-6xl">Acerca de</h1>
          <p className="text-2xl font-light lg:text-3xl">
            Servicios dedicados de cuidado prenatal, ofreciendo orientación,
            monitoreo y apoyo para un embarazo saludable y un parto seguro.
          </p>
        </div>
      </div>
      <p className="w-full text-2xl">
        Clínica San Miguel: Cuidado Prenatal para la Salud de la Madre y el Bebé
      </p>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          ¿Qué es el cuidado prenatal?
        </h1>
        <p>
          El cuidado prenatal es la atención médica que una mujer recibe durante
          el embarazo. Es importante para la salud de la madre y el bebé.
          Durante las visitas prenatales, el médico o la enfermera:
        </p>
        <ul className="list-disc pl-5">
          <li>Monitorean la salud tuya y la de tu bebé.</li>
          <li>Te dan información sobre el embarazo.</li>
          <li>
            Recomiendan pruebas de laboratorio importantes para diagnosticar
            problemas de salud preventivos para ti y tu bebé.
          </li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          ¿Cuáles son las pruebas de laboratorio prenatales?
        </h1>
        <p>
          Las pruebas de laboratorio prenatales ayudan a determinar la salud de
          la madre y el bebé. Algunas de las pruebas más comunes incluyen:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <b>Prueba de sangre:</b> para verificar el tipo de sangre, nivel de
            hierro, conteo sanguíneo, glóbulos rojos y blancos, y la detección
            de enfermedades como la diabetes gestacional y la sífilis.
          </li>
          <li>
            <b>Uroanálisis:</b> para detectar infecciones urinarias y proteínas
            en la orina.
          </li>
          <li>
            <b>Pruebas prenatales no invasivas (NIPT):</b> para detectar
            anomalías cromosómicas en el bebé. Prueba de ácido fólico.
          </li>
          <li>
            <b>Prueba de embarazo (HCG)</b>
          </li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          ¿Qué son las ecografías prenatales?
        </h1>
        <p>
          Las ecografías prenatales son imágenes del bebé en el útero. Se usan
          para:
        </p>
        <ul className="list-disc pl-5">
          <li>Confirmar el embarazo.</li>
          <li>Determinar la edad gestacional del bebé.</li>
          <li>Evaluar el crecimiento y desarrollo del bebé.</li>
          <li>Detectar anomalías congénitas.</li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          ¿Por qué es importante tener cuidado de salud prenatal?
        </h1>
        <p>El cuidado de salud prenatal es importante para:</p>
        <ul className="list-disc pl-5">
          <li>
            Reducir el riesgo de complicaciones durante el embarazo y el parto.
          </li>
          <li>Garantizar un parto saludable.</li>
          <li>Detectar y tratar problemas de salud en la madre y el bebé.</li>
        </ul>
      </section>

      <h1 className="bold w-full text-3xl font-bold font text-red-600">Preguntas Frecuentes</h1>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          ¿Cuándo debo comenzar a recibir atención prenatal?
        </h2>
        <p>
          Idealmente, deberías comenzar a recibir atención prenatal tan pronto
          como sepas que estás embarazada.
        </p>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          ¿Con qué frecuencia debo tener visitas prenatales?
        </h2>
        <p>
          La frecuencia de las visitas prenatales dependerá de la salud tuya y
          de tu bebé. Las visitas suelen ocurrir mensualmente durante el primer
          y segundo trimestre, y cada dos semanas durante el tercer trimestre.
        </p>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          ¿Qué debo llevar a mis visitas prenatales?
        </h2>
        <p>A tus visitas prenatales, deberías llevar:</p>
        <ul className="list-disc pl-5">
          <li>Tu tarjeta de identificación.</li>
          <li>Tu historial médico.</li>
          <li>Una lista de los medicamentos que tomas.</li>
          <li>Cualquier pregunta que tengas.</li>
        </ul>
      </section>
      <h2 className="w-full text-2xl font-bold text-red-600">Guía experta: Cuidado parental personalizado para ti.</h2>

    </div>
  ) : (
    <div className="mx-auto flex flex-col items-center gap-10 px-5 py-5 font-semibold text-black lg:w-4/5 xl:px-20">
      <h1 className="text-center text-6xl text-red-600">Prenatal Care</h1>
      <div className="flex w-full flex-col lg:flex-row">
        <Image
          src="https://vsvueqtgulraaczqnnvh.supabase.co/storage/v1/object/public/services_images/Prenatal%20care.png?t=2024-02-11T07%3A01%3A56.078Z"
          width={1000}
          height={1000}
          alt="cover"
          className="aspect-square w-full bg-black/10 object-cover lg:w-1/3 lg:rounded-lg"
        />
        <div className="w-full space-y-8 bg-black/60 p-3 text-white lg:my-10 lg:w-2/3 lg:p-8">
          <h1 className="text-4xl font-semibold lg:text-6xl">About</h1>
          <p className="text-2xl font-light lg:text-3xl">
            Dedicated prenatal care services, offering guidance, monitoring, and
            support for a healthy pregnancy and safe delivery.
          </p>
        </div>
      </div>
      <p className="w-full text-2xl">
        San Miguel Clinic: Prenatal Care for the Health of Mother and Baby
      </p>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          What is Prenatal care ?
        </h1>
        <p>
          Prenatal care is the medical care a woman receives during pregnancy.
          It is important for the health of mother and baby. During prenatal
          visits, the doctor or nurse will:
        </p>
        <ul className="list-disc pl-5">
          <li>Monitor you and your baby&apos;s health.</li>
          <li>Give you information about the pregnancy.</li>
          <li>
            Recommend important blood tests to diagnose any preventive health
            issues for you and your baby.
          </li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          Which Are prenatal lab tests?
        </h1>
        <p>
          Prenatal lab tests help determine the health of the mother and baby.
          Some of the most common tests include:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <b>Blood test:</b> to check blood type, iron level, blood count, red
            and white blood cells, and the detection of diseases such as
            gestational diabetes and syphilis.
          </li>
          <li>
            <b>Urinalysis:</b> to detect urine infections and proteins in the
            urine.
          </li>
          <li>
            <b>Non-invasive prenatal testing (NIPT):</b> to detect chromosomal
            abnormalities in the baby. Folic acid test.
          </li>
          <li>
            <b>Pregnancy test (HCG)</b>
          </li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          What are prenatal ultrasounds?
        </h1>
        <p>
          Prenatal ultrasounds are images of the baby in the womb. They are used
          to:
        </p>
        <ul className="list-disc pl-5">
          <li>Confirm pregnancy.</li>
          <li>Determine the gestational age of the baby.</li>
          <li>Evaluate the growth and development of the baby.</li>
          <li>Detect congenital anomalies.</li>
        </ul>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h1 className="w-full text-2xl font-bold text-red-600">
          Why is it important to have prenatal health care?
        </h1>
        <p>Prenatal health care is important to:</p>
        <ul className="list-disc pl-5">
          <li>
            Reduce the risk of complications during pregnancy and childbirth.
          </li>
          <li>Ensure a healthy birth.</li>
          <li>Detect and treat health problems in mother and baby.</li>
        </ul>
      </section>

      <h1 className="bold w-full text-3xl font-bold font text-red-600">Frequently Asked Questions</h1>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          When should I start receiving prenatal care?
        </h2>
        <p>
          Ideally, you should start receiving prenatal care as soon as you know
          you are pregnant.
        </p>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          How often should I have prenatal visits?
        </h2>
        <p>
          The frequency of prenatal visits will depend on the health of you and
          your baby. Visits typically occur monthly during the first and second
          trimesters, and every two weeks during the third trimester.
        </p>
      </section>

      <section className="w-full space-y-3 text-xl">
        <h2 className="w-full text-2xl font-bold text-red-600">
          What should I bring to my prenatal visits?
        </h2>
        <p>To your prenatal visits, you should bring:</p>
        <ul className="list-disc pl-5">
          <li>Your ID card.</li>
          <li>Your medical history.</li>
          <li>A list of the medications you take.</li>
          <li>Any questions you have.</li>
        </ul>
      </section>
      <h2 className="w-full text-2xl font-bold text-red-600">Expert Guidance: Parental Care Tailored for You.</h2>
    </div>
  );
};

export default Home;
