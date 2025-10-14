// src/ProjectCard.jsx
import { motion } from "framer-motion";

export default function ProjectCard({ 
    title, 
    description, 
    image, 
    technologies = [], 
    liveUrl, 
    githubUrl, 
    features = [],
    onClick,
    className = ""
}) {
    return (
        <motion.div
            layoutId={title}
            onClick={onClick}
            className={`min-w-[300px] bg-gray-800 rounded-xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:shadow-amber-400/20 ${className}`}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <motion.img
                layoutId={`card-${title}`}
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-amber-100">{title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{description}</p>
                
                {technologies && technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {technologies.map((tech, index) => (
                            <span 
                                key={index}
                                className="bg-amber-400/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
                
                {features && features.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                        <ul className="text-xs text-gray-400 space-y-1">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="flex gap-3">
                    {liveUrl && (
                        <a 
                            href={liveUrl} 
                            className="flex-1 bg-amber-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-amber-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Live Demo
                        </a>
                    )}
                    {githubUrl && (
                        <a 
                            href={githubUrl} 
                            className="flex-1 border border-amber-400 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-amber-400/10 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            GitHub
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}