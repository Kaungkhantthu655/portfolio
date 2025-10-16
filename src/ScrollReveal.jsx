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
    const animationRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Ensure the container is visible immediately
        gsap.set(el, { visibility: "visible" });

        const childrenEls = Array.from(el.children);

        // Kill any existing animation first
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Create a more robust animation that won't reverse on fast scroll
        animationRef.current = gsap.fromTo(childrenEls, 
            { 
                opacity: baseOpacity, 
                y: baseY, 
                filter: `blur(${blurStrength}px)`,
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
                    start: "top 85%", // Trigger earlier
                    end: "bottom 15%",
                    toggleActions: "play play none none", // Play when entering AND re-entering
                    markers: false, // Set to true for debugging
                    // Add these for better performance with fast scrolling:
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    onEnter: () => {
                        // Force visibility when entering
                        gsap.set(childrenEls, { visibility: "visible" });
                    },
                    onEnterBack: () => {
                        // Force visibility when scrolling back up
                        gsap.set(childrenEls, { visibility: "visible" });
                    }
                },
                // Ensure the animation completes even during fast scrolling
                overwrite: "auto"
            }
        );

        // Add a safety check to ensure elements become visible
        const safetyCheck = setTimeout(() => {
            const isInViewport = (element) => {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight * 0.85) &&
                    rect.bottom >= (window.innerHeight * 0.15)
                );
            };

            if (isInViewport(el)) {
                gsap.set(childrenEls, { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    visibility: "visible" 
                });
            }
        }, 2000);

        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
            clearTimeout(safetyCheck);
            
            // Clean up ScrollTriggers for this element
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === el || trigger.vars?.trigger === el) {
                    trigger.kill();
                }
            });
        };
    }, [blurStrength, baseOpacity, baseY, stagger, duration]);

    return (
        <div 
            ref={containerRef} 
            className={containerClassName}
            // Remove the inline style that hides the container
        >
            {children}
        </div>
    );
};

export default ScrollReveal;