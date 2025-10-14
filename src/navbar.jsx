import { motion } from "framer-motion";

export default function Navbar({ active, onLinkClick }) {
    const links = ["Home", "Projects", "Skills", "Contact"];

    return (
        <nav className="bg-[#fefcf9] shadow-md py-4 px-8 flex justify-between items-center relative border-b-2 border-[#D4AF37]">
            {/* Brand / Name */}
            <h1 className="text-2xl font-serif font-bold text-[#1c3d7a]">Kaung Khant Thu</h1>

            {/* Navigation Links */}
            <ul className="flex space-x-6 text-[#1c3d7a] font-sans relative">
                {links.map((link) => (
                    <li
                        key={link}
                        className="cursor-pointer relative"
                        onClick={() => onLinkClick(link)}
                    >
                        {link}

                        {/* Animated underline */}
                        {active === link && (
                            <motion.div
                                className="absolute -bottom-1 left-0 h-1 bg-[#D4AF37] w-full"
                                layoutId="underline"  // Framer Motion animates between active links
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}