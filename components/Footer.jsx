import { sitedata } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Button from "./Button";

const footerLinks = [
  { name: "Claim Your Business", url: "/claim-a-restaurant" },
  { name: "About Us", url: "/about" },
  { name: "Privacy Policy", url: "/privacy-policy" },
  { name: "Terms & Conditions", url: "/terms" },
  { name: "Advertise With Us", url: "/advertising" },
  { name: "Chef", url: "/individual-chef-page" },
];
const Footer = () => {
  return (
    <footer className="bg-black">
      <div className=" text-white py-12 px-4 md:px-16 page-width">
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* Left Section: Branding & Newsletter */}
            <div className="flex flex-col space-y-6 md:basis-1/2 basis-full max-md:w-full">
              {/* Logo & Brand Name */}
              <div className="flex items-center">
                <div className="relative">
                  <Link href={"/"}>
                    <Image
                      src="/Cheffington-white.png"
                      alt="Cheffington Logo"
                      width={400}
                      height={196}
                      objectFit="contain"
                    />
                  </Link>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h3 className="text-[#FF8400] font-black lg:text-4xl text-3xl uppercase">
                  Eat the Newsletter
                </h3>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    suppressHydrationWarning
                    className="bg-gray-300 text-black px-4 py-3 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button title="Sign Up" type="submit" />
                </form>
              </div>
            </div>

            {/* Right Section: Links & Socials */}
            <div className="flex flex-col md:items-end gap-3 sm:w-1/3 w-full ">
              <ul className="flex flex-col gap-3">
                {footerLinks.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.url}
                      className="hover:text-[#FF8400] text-[#FFF1E1] transition-colors font-bold text-xl"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
                <li className="flex gap-4 mt-4 text-xl mr-6">
                  {sitedata?.social?.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="hover:text-[#FF8400] transition-colors cursor-pointer"
                    >
                      {item.icon === "FaInstagram" && <FaInstagram size={24} />}
                      {item.icon === "FaLinkedin" && <FaLinkedin size={24} />}
                      {item.icon === "FaTwitter" && <FaTwitter size={24} />}
                    </a>
                  ))}
                </li>
              </ul>

              {/* Social Icons */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
