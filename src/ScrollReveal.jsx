// src/ScrollReveal.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
                          children,
                          containerClassName = "",
                          blurStrength = 4,
                          baseOpacity = 0,
                          baseY = 40,
                          stagger = 0.1,
                          duration = 1,
                      }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Animate all direct children
        const childrenEls = Array.from(el.children);

        // Use a one-time animation instead of scrub
        gsap.fromTo(childrenEls, 
            { 
                opacity: baseOpacity, 
                y: baseY, 
                filter: `blur(${blurStrength}px)`,
                // Ensure elements are visible but initially hidden
                visibility: "visible"
            },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: stagger,
                duration: duration,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse", // play when in view, reverse when out
                    // Remove scrub for better performance
                },
                // Immediate render to prevent flash
                immediateRender: false
            }
        );

        return () => {
            // Clean up only the relevant ScrollTriggers
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === el) {
                    trigger.kill();
                }
            });
        };
    }, [blurStrength, baseOpacity, baseY, stagger, duration]);

    return (
        <div 
            ref={containerRef} 
            className={containerClassName}
            style={{ visibility: "hidden" }} // Prevent flash by hiding initially
        >
            {children}
        </div>
    );
};

export default ScrollReveal;