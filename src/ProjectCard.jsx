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
        <div
            onClick={onClick}
            className={`min-w-[300px] bg-gray-800 rounded-xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-amber-400/20 ${className}`}
        >
            <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover transition-all duration-700 hover:scale-110"
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
        </div>
    );
}