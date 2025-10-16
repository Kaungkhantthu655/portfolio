// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PillNav from "./PillNav";
import ProjectCard from "./ProjectCard";
import ScrollReveal from "./ScrollReveal";
import proPic from "./assets/pro picture.jpg";

const sections = ["Home", "About", "Projects", "Skills", "Contact"];
const NAV_HEIGHT = 80;

export default function App() {
    const [active, setActive] = useState("Home");
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const sectionRefs = useRef([]);
    const projectsContainerRef = useRef(null);
    const projectCardsRef = useRef([]);

    // Fix hydration and mounting issues
    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Scroll performance monitor for fast scrolling
    useEffect(() => {
        if (!isMounted) return;

        let scrollTimeout;
        let lastScrollTop = 0;
        let scrollSpeed = 0;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollSpeed = Math.abs(scrollTop - lastScrollTop);
            lastScrollTop = scrollTop;

            // If scrolling very fast, add a class to handle it
            if (scrollSpeed > 100) {
                document.body.classList.add('fast-scroll');
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('fast-scroll');
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [isMounted]);

    // Improved ScrollSpy with better performance
    useEffect(() => {
        if (!isMounted) return;

        let ticking = false;

        const onScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            const tolerance = 100;
            
            for (let i = 0; i < sectionRefs.current.length; i++) {
                const sec = sectionRefs.current[i];
                if (sec) {
                    const top = sec.offsetTop - tolerance;
                    const bottom = top + sec.offsetHeight + tolerance;
                    
                    if (scrollPos >= top && scrollPos < bottom) {
                        setActive(sections[i]);
                        break;
                    }
                }
            }
        };

        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", scrollHandler, { passive: true });
        window.addEventListener("resize", scrollHandler, { passive: true });
        
        // Multiple initial checks to ensure proper detection
        const initTimers = [
            setTimeout(scrollHandler, 100),
            setTimeout(scrollHandler, 500),
            setTimeout(scrollHandler, 1000)
        ];
        
        return () => {
            window.removeEventListener("scroll", scrollHandler);
            window.removeEventListener("resize", scrollHandler);
            initTimers.forEach(timer => clearTimeout(timer));
        };
    }, [isMounted]);

    // Project hover effects like Duet Night Abyss
    const handleProjectHover = (hoveredIndex) => {
        if (!projectsContainerRef.current) return;

        const projectItems = projectsContainerRef.current.querySelectorAll('.project-item');
        
        projectItems.forEach((item, index) => {
            if (index === hoveredIndex) {
                // Scale up and bring forward the hovered item
                gsap.to(item, {
                    scale: 1.05,
                    y: -10,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                // Scale down and push back other items
                gsap.to(item, {
                    scale: 0.95,
                    y: 10,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    };

    const handleProjectLeave = () => {
        if (!projectsContainerRef.current) return;

        const projectItems = projectsContainerRef.current.querySelectorAll('.project-item');
        
        // Reset all items to original state
        gsap.to(projectItems, {
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    // Handle PillNav smooth scroll
    const handleLinkClick = (href) => {
        const targetSection = document.querySelector(href);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - NAV_HEIGHT;
            gsap.to(window, { duration: 1, scrollTo: targetPosition, ease: "power2.out" });
        }
    };

    const projects = [
        {
            title: "Meta AI Assistant",
            description: "Advanced AI assistant with natural language processing and real-time response capabilities",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["React", "Node.js", "OpenAI API", "WebSocket", "MongoDB"],
            liveUrl: "#",
            githubUrl: "#",
            features: ["Real-time Chat", "Multi-language Support", "Context Awareness", "File Processing"]
        },
        {
            title: "E-Commerce Platform",
            description: "Full-stack React e-commerce with payment integration",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            liveUrl: "#",
            githubUrl: "#",
            features: ["Payment Processing", "User Authentication", "Inventory Management", "Order Tracking"]
        },
        {
            title: "Task Management App",
            description: "Collaborative project management tool with real-time updates",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["React", "TypeScript", "Socket.io", "PostgreSQL"],
            liveUrl: "#",
            githubUrl: "#",
            features: ["Real-time Updates", "Team Collaboration", "Progress Tracking", "File Sharing"]
        },
        {
            title: "Fitness Tracking App",
            description: "Mobile-first fitness app with progress analytics",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["React Native", "Firebase", "Chart.js", "Redux"],
            liveUrl: "#",
            githubUrl: "#",
            features: ["Workout Plans", "Progress Analytics", "Social Features", "Nutrition Tracking"]
        },
    ];

    const skills = {
        technical: ["React", "JavaScript", "Node.js", "Java", "MongoDB", "MySQL"],
        design: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping", "Wireframing"],
        tools: ["Git", "Docker", "VSCode", "Figma", "GSAP"]
    };

    const socialLinks = [
        { name: "GitHub", url: "https://github.com/Kaungkhantthu655", icon: "↗" },
        { name: "LinkedIn", url: "https://linkedin.com/in/kk-t-b45958285", icon: "↗" },
        { name: "Email", url: "mailto:thukaungkhant@gmail.com", icon: "↗" }
    ];

    // Don't render anything until mounted to prevent hydration issues
    if (!isMounted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="animate-pulse text-amber-100 text-xl">Loading...</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-amber-100 text-xl">Loading Portfolio...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen text-white">
            {/* Updated PillNav with proper initialization */}
            <PillNav
                items={sections.map((s) => ({ label: s, href: `#${s.toLowerCase()}` }))}
                activeHref={`#${active.toLowerCase()}`}
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
                ease="power2.easeOut"
                baseColor="rgba(0, 0, 0, 0.3)"
                pillColor="rgba(254, 243, 199, 0.1)"
                pillTextColor="#fef3c7"
                hoveredPillTextColor="#1e1b4b"
                onLinkClick={handleLinkClick}
                initialLoadAnimation={isMounted}
            />

            {/* Home Section */}
            <section
    id="home"
    aria-label="Home Section"
    ref={(el) => {
        if (el) sectionRefs.current[0] = el;
    }}
    className="min-h-screen flex flex-col items-center justify-center px-6 relative scroll-mt-20"
>
    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-purple-900/10"></div>
    <ScrollReveal containerClassName="flex flex-col items-center gap-6 max-w-3xl w-full relative z-10">
        {/* Larger profile picture with better styling */}
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 mb-8 overflow-hidden border-4 border-white/20 shadow-2xl shadow-amber-400/20">
            <img 
                src={proPic} 
                alt="Kaung Khant Thu - Full Stack Developer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Kaung Khant Thu
        </h1>
                    <p className="text-xl md:text-2xl text-amber-100 text-center mb-6">
                        Full Stack Web Developer 
                    </p>
                    <p className="text-lg text-gray-300 text-center max-w-2xl mb-8">
                        I create digital experiences that blend beautiful design with 
                        cutting-edge technology. Specializing in AI applications and modern web development.
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button className="bg-amber-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-400/25">
                            View My Work
                        </button>
                        <button className="border border-amber-400 text-amber-400 px-8 py-3 rounded-full font-semibold hover:bg-amber-400/10 transition-all duration-300">
                            Download CV
                        </button>
                    </div>
                </ScrollReveal>
            </section>

            {/* About Section */}
            <section
                id="about"
                aria-label="About Section"
                ref={(el) => {
                    if (el) sectionRefs.current[1] = el;
                }}
                className="min-h-screen flex flex-col items-center justify-center px-6 bg-black/50 scroll-mt-20"
            >
                <ScrollReveal containerClassName="flex flex-col items-center gap-8 max-w-4xl w-full">
                    <h2 className="text-4xl md:text-5xl font-serif text-amber-100">About Me</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <p className="text-lg text-gray-300">
                                Passionate developer with 3+ years of experience creating 
                                digital solutions that make a difference. I specialize in 
                                AI applications, modern web technologies and user-centered design.
                            </p>
                            <p className="text-lg text-gray-300">
                                Currently focused on building intelligent applications that leverage 
                                machine learning and natural language processing to solve real-world problems.
                            </p>
                            <div className="flex gap-4 mt-6">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                                        aria-label={`Visit my ${social.name}`}
                                    >
                                        <span>{social.name}</span>
                                        <span>{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-semibold text-amber-100 mb-4">Quick Facts</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li>📍 Based in Yangon, Myanmar</li>
                                <li>💼 0 years experience</li>
                                <li>🎓 Computer Science Degree</li>
                                <li>🚀 5+ Projects Completed</li>
                                <li>🌱 Currently learning Three.js</li>
                            </ul>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Projects Section - Duet Night Abyss Style */}
            <section
                id="projects"
                aria-label="Projects Section"
                ref={(el) => {
                    if (el) sectionRefs.current[2] = el;
                }}
                className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden scroll-mt-20"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-amber-900/10"></div>
                
                <ScrollReveal containerClassName="flex flex-col items-center gap-16 max-w-7xl w-full relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-amber-100 text-center mb-4">
                        Featured Projects
                    </h2>
                    <p className="text-xl text-gray-300 text-center max-w-2xl mb-12">
                        Hover over projects to explore them in detail
                    </p>
                    
                    {/* Projects Container - Horizontal Scroll like Duet Night Abyss */}
                    <div className="w-full relative">
                        <div 
                            ref={projectsContainerRef}
                            className="flex gap-8 pb-12 px-8 overflow-x-auto hide-scrollbar projects-container"
                            style={{
                                scrollSnapType: 'x mandatory',
                                scrollPadding: '0 2rem'
                            }}
                        >
                            {projects.map((project, index) => (
                                <div
                                    key={index}
                                    ref={el => projectCardsRef.current[index] = el}
                                    className="flex-shrink-0 w-80 lg:w-96 transition-all duration-500 ease-out cursor-pointer project-item scroll-reveal-item"
                                    style={{
                                        scrollSnapAlign: 'start'
                                    }}
                                    onMouseEnter={() => handleProjectHover(index)}
                                    onMouseLeave={() => handleProjectLeave()}
                                >
                                    <div className="relative group">
                                        {/* Project Image Container */}
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-400/20 transition-all duration-500">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                            
                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-all duration-500"></div>
                                            
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 rounded-2xl border border-amber-400/0 group-hover:border-amber-400/40 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all duration-500"></div>
                                        </div>
                                        
                                        {/* Project Info */}
                                        <div className="mt-6 text-center transition-all duration-500 transform group-hover:-translate-y-2">
                                            <h3 className="text-2xl font-bold text-amber-100 mb-3">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4 leading-relaxed">
                                                {project.description}
                                            </p>
                                            
                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                                    <span 
                                                        key={techIndex}
                                                        className="bg-amber-400/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium border border-amber-400/30"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                                                        +{project.technologies.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-3 justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                                                {project.liveUrl && (
                                                    <a 
                                                        href={project.liveUrl}
                                                        className="bg-amber-400 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-amber-300 transition-all duration-300 transform hover:scale-105"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a 
                                                        href={project.githubUrl}
                                                        className="border border-amber-400 text-amber-400 px-6 py-2 rounded-full font-semibold hover:bg-amber-400/10 transition-all duration-300"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Scroll Indicator */}
                        <div className="flex justify-center gap-2 mt-8">
                            {projects.map((_, index) => (
                                <div 
                                    key={index}
                                    className="w-2 h-2 rounded-full bg-gray-600 transition-all duration-300"
                                ></div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Skills Section */}
            <section
                id="skills"
                aria-label="Skills Section"
                ref={(el) => {
                    if (el) sectionRefs.current[3] = el;
                }}
                className="min-h-screen flex flex-col items-center justify-center px-6 bg-black/50 py-20 scroll-mt-20"
            >
                <ScrollReveal containerClassName="flex flex-col items-center gap-12 max-w-6xl w-full">
                    <h2 className="text-4xl md:text-5xl font-serif text-amber-100 text-center">Skills & Technologies</h2>
                    
                    <div className="grid md:grid-cols-3 gap-8 w-full">
                        <div className="bg-gradient-to-br from-amber-900/20 to-transparent p-6 rounded-2xl border border-amber-400/20">
                            <h3 className="text-xl font-semibold text-amber-400 mb-4">Technical</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.technical.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-amber-400/10 text-amber-400 px-3 py-2 rounded-full text-sm border border-amber-400/20 scroll-reveal-item"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/20 to-transparent p-6 rounded-2xl border border-purple-400/20">
                            <h3 className="text-xl font-semibold text-purple-400 mb-4">Design</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.design.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-purple-400/10 text-purple-400 px-3 py-2 rounded-full text-sm border border-purple-400/20 scroll-reveal-item"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-6 rounded-2xl border border-blue-400/20">
                            <h3 className="text-xl font-semibold text-blue-400 mb-4">Tools</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.tools.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-blue-400/10 text-blue-400 px-3 py-2 rounded-full text-sm border border-blue-400/20 scroll-reveal-item"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                aria-label="Contact Section"
                ref={(el) => {
                    if (el) sectionRefs.current[4] = el;
                }}
                className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-gray-900 to-black py-20 scroll-mt-20"
            >
                <ScrollReveal containerClassName="flex flex-col items-center gap-8 max-w-2xl w-full text-center">
                    <h2 className="text-4xl md:text-5xl font-serif text-amber-100">Let's Work Together</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-md">
                        Ready to bring your next project to life? Let's connect and create something amazing.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <button className="bg-amber-400 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-300 transition-all duration-300 transform hover:scale-105">
                            Get in Touch
                        </button>
                        <button className="border border-amber-400 text-amber-400 px-8 py-4 rounded-full font-semibold hover:bg-amber-400/10 transition-all duration-300">
                            Schedule a Call
                        </button>
                    </div>

                    <div className="border-t border-white/10 pt-8 w-full">
                        <div className="flex justify-center gap-6 mb-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    className="text-gray-400 hover:text-amber-400 transition-colors"
                                    aria-label={`Visit my ${social.name}`}
                                >
                                    {social.name} {social.icon}
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Kaung Khant Thu. All rights reserved.
                        </p>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}