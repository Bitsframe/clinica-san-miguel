// "use client";

// import { facebook, instagram, youtube } from "@/assets/images";
// import { Button } from "@/utils";
// import { IoIosArrowForward } from "react-icons/io";

// import Image from "next/image";
// import { Link } from "@/navigation";

// import StarRatings from "react-star-ratings";
// import { useTranslations } from "next-intl";
// import NewsletterSignup from "./NewsletterSignup";

// export const Footer = () => {
//   const t = useTranslations("common");

//   // const footerLink = [
//   //   { id: 1, name: t("link_privacy_policy"), route: "" },
//   //   { id: 2, name: t("link_terms_and_conditions"), route: "" },
//   //   { id: 3, name: t("link_accessibility_notice"), route: "" },
//   //   { id: 4, name: t("link_contact_us"), route: "/contact" },
//   // ];

//   const pages = [
//     { id: 1, name: t("link_home"), route: "/" },
//     { id: 2, name: t("link_about"), route: "/about" },
//     { id: 3, name: t("link_services"), route: "/services" },
//     { id: 6, name: t("link_contact"), route: "/contact" },
//     { id: 6, name: t("link_career"), route: "/career" },
//     { id: 6, name: t("link_specials"), route: "/specials" },
//   ];

//   const socialLinks = [
//     {
//       id: 1,
//       image: facebook,
//       route: "https://www.facebook.com/clinicasanmigueltx/",
//     },
//     {
//       id: 2,
//       image: instagram,
//       route: "https://www.instagram.com/san_miguel_clinic_",
//     },
//     {
//       id: 3,
//       image: youtube,
//       route: "https://www.youtube.com/channel/UC-89xwmnpU6ZEPSawRZKNIw",
//     },
//   ];

//   const ratings = 4.8;
//   const reviews = 40;

//   return (
//     <footer className="bg-[#19192C] w-full flex flex-col justify-center items-baseline">
//       <article className="w-full px-5">
//         <ul className="flex flex-wrap gap-10 justify-center items-center my-10">
//           {pages.map((page) => (
//             <Link href={page.route} key={page.id}>
//               <li className="text-[#F8F5F0] font-poppins  text-[16px]">
//                 {page.name}
//               </li>
//             </Link>
//           ))}
//         </ul>
//       </article>

//       <article className="flex flex-wrap gap-5 justify-between w-full border-b-[3px] border-[#ffffff] py-10 px-10">
//         <div className="flex order-1 md:order-1 flex-col items-center w-full md:w-auto md:items-start gap-2">
//           <h5 className="text-white font-poppins text-[16px] text-center md:text-left font-semibold">
//             {t("footer_connect_socials")}
//           </h5>
//           <ul className="flex gap-3 items-center justify-center">
//             {socialLinks.map((social) => (
//               <Link href={social.route} key={social.id}>
//                 <li className="w-[60px] h-[60px]">
//                   <Image
//                     src={social.image}
//                     alt={""}
//                     className="w-[60px] h-[60px] object-contain aspect-auto"
//                   />
//                 </li>
//               </Link>
//             ))}
//           </ul>
//         </div>

//         <div className="flex order-3 md:order-2 flex-col justify-center items-center w-full md:w-auto md:items-start">
//           <h5 className="text-white font-poppins text-[16px] font-semibold">
//             {t("footer_rating_review_title")}
//           </h5>

//           <div className="flex items-center justify-center gap-2">
//             <div className="flex flex-col items-center justify-center border-r-[2px] pr-3 border-[#ffffff]">
//               <h3 className="text-[25px] font-inter text-[#ffffff]">
//                 {reviews}+
//               </h3>
//               <p className="text-[#F8F5F0] font-inter text-[14px]">
//                 {t("footer_review_title")}
//               </p>
//             </div>

//             <div className="flex flex-col items-center justify-center">
//               <h3 className="text-[25px] font-inter text-[#ffffff]">
//                 {ratings}/5
//               </h3>
//               <StarRatings
//                 rating={ratings}
//                 starDimension="15px"
//                 starSpacing="1px"
//                 numberOfStars={5}
//                 starRatedColor="#C1001F"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col order-2 md:order-3 gap-3 justify-center w-full md:w-auto items-center md:items-start">
//           <h5 className="text-white font-poppins text-[16px] text-center md:text-left font-semibold">
//             {t("footer_news_letter_title")}
//           </h5>

//           <div className="flex gap-2">
//             <NewsletterSignup />
//           </div>
//         </div>
//       </article>

//       <article className="my-10 w-full">
//         <ul className="flex flex-wrap justify-evenly items-center ">
//           <li className="text-[#F8F5F0] order-2 md:order-1 font-poppins text-[16px]">
//             {t("footer_copyright_text")}
//           </li>
//           {/* <div className="flex flex-wrap gap-3 justify-evenly items-center ">
//             {footerLink.map((item) => (
//               <Link href={item.route} key={item.id}>
//                 <li className="text-[#F8F5F0] order-1 md:order-2 font-poppins text-[16px]">
//                   {item.name}
//                 </li>
//               </Link>
//             ))}
//           </div> */}
//         </ul>
//       </article>
//     </footer>
//   );
// };

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import logo from "@/assets/images/logo/logo.png";
import { Link } from "@/navigation";

export const Footer = () => {
  const t = useTranslations("common");

  const pages = [
    { id: 1, name: t("link_home"), route: "/" },
    { id: 2, name: t("link_about"), route: "/about" },
    { id: 3, name: t("link_services"), route: "/services" },
    { id: 4, name: t("link_contact"), route: "/contact" },
    { id: 5, name: t("link_career"), route: "/career" },
    { id: 6, name: t("link_specials"), route: "/specials" },
  ];

  const socialLinks = [
    { id: 1, icon: <FaFacebookF />, route: "https://www.facebook.com/clinicasanmigueltx/" },
    { id: 2, icon: <FaInstagram />, route: "https://www.instagram.com/san_miguel_clinic_" },
    { id: 3, icon: <FaYoutube />, route: "https://www.youtube.com/channel/UC-89xwmnpU6ZEPSawRZKNIw" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-[#0F172A] mt-12">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Logo and Newsletter */}
    <div className="space-y-4">
      <Image src={logo} alt="Logo" width={160} height={60} />
      <p className="font-semibold">Join our newsletter</p>
      <div className="flex items-center bg-[#F4F5F6] rounded-xl px-4 py-2 max-w-md w-full">
  <input
    type="email"
    placeholder="Enter your email"
     className="w-full bg-[#F4F5F6] text-[#606877] placeholder:text-[#606877] text-base outline-none border-none"
  />
  <button className="ml-2 w-10 h-10 bg-[#C1001F] text-white rounded-full flex items-center justify-center hover:bg-red-800 transition">
    <FiSend size={16} />
  </button>
</div>
    </div>

<div className="md:col-span-3 flex flex-col sm:flex-row gap-36 justify-end ml-6">

  {/* Quick Links */}
  <div>
    <h4 className="font-semibold mb-3">Quick Links</h4>
    <ul className="space-y-2 text-sm text-gray-700">
      {pages.map((page) => (
        <li key={page.id}>
          <Link href={page.route}>{page.name}</Link>
        </li>
      ))}
    </ul>
  </div>

  {/* Our Locations */}
  <div>
    <h4 className="font-semibold mb-3">Our Locations</h4>
    <ul className="space-y-2 text-sm text-gray-700">
      <li>Dallas</li>
      <li>Houston</li>
      <li>San Antonio</li>
      <li>See all 17 clinics</li>
    </ul>
  </div>

  {/* Socials */}
  <div>
    <h4 className="font-semibold mb-3">Socials</h4>
    <ul className="space-y-2 text-sm text-gray-700">
      {socialLinks.map((social) => (
        <li key={social.id} className="flex items-center gap-2">
          <a
            href={social.route}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            {social.icon}
            {social.route.includes("facebook") && "Facebook"}
            {social.route.includes("instagram") && "Instagram"}
            {social.route.includes("youtube") && "Youtube"}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>


    
  </div>

  <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
    <p>© 2025 Clinica San Miguel. All Rights Reserved.</p>
    <div className="space-x-4 mt-2 md:mt-0">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Accessibility Statement</a>
    </div>
  </div>
</footer>

  );
};
