import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PillNav = ({
                     logo,
                     logoAlt = 'Logo',
                     items,
                     activeHref,
                     className = '',
                     ease = 'power3.easeOut',
                     baseColor = 'rgba(0, 0, 0, 0.3)',
                     pillColor = 'rgba(254, 243, 199, 0.1)',
                     hoveredPillTextColor = '#1e1b4b',
                     pillTextColor = '#fef3c7',
                     onMobileMenuClick,
                     initialLoadAnimation = true
                 }) => {
    const resolvedPillTextColor = pillTextColor ?? baseColor;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef([]);
    const tlRefs = useRef([]);
    const activeTweenRefs = useRef([]);
    const logoImgRef = useRef(null);
    const logoTweenRef = useRef(null);
    const hamburgerRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navItemsRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach(circle => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector('.pill-label');
                const white = pill.querySelector('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                const index = circleRefs.current.indexOf(circle);
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (document.fonts?.ready) {
            document.fonts.ready.then(layout).catch(() => {});
        }

        const menu = mobileMenuRef.current;
        if (menu) {
            gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
        }

        if (initialLoadAnimation) {
            const logo = logoRef.current;
            const navItems = navItemsRef.current;

            if (logo) {
                gsap.set(logo, { scale: 0 });
                gsap.to(logo, {
                    scale: 1,
                    duration: 0.6,
                    ease
                });
            }

            if (navItems) {
                gsap.set(navItems, { width: 0, overflow: 'hidden' });
                gsap.to(navItems, {
                    width: 'auto',
                    duration: 0.6,
                    ease
                });
            }
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease, initialLoadAnimation]);

    const handleEnter = i => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = i => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLogoEnter = () => {
        const img = logoImgRef.current;
        if (!img) return;
        logoTweenRef.current?.kill();
        gsap.set(img, { rotate: 0 });
        logoTweenRef.current = gsap.to(img, {
            rotate: 360,
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        const hamburger = hamburgerRef.current;
        const menu = mobileMenuRef.current;

        if (hamburger) {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            if (newState) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease,
                        transformOrigin: 'top center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }

        onMobileMenuClick?.();
    };

    const isExternalLink = href =>
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#');

    const isRouterLink = href => href && !isExternalLink(href);

    const cssVars = {
        ['--base']: baseColor,
        ['--pill-bg']: pillColor,
        ['--hover-text']: hoveredPillTextColor,
        ['--pill-text']: resolvedPillTextColor,
        ['--nav-h']: '48px',
        ['--logo']: '40px',
        ['--pill-pad-x']: '20px',
        ['--pill-gap']: '4px'
    };

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[1000] backdrop-blur-md bg-black/30 border border-white/10 rounded-full shadow-lg">
            <nav
                className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-6 ${className}`}
                aria-label="Primary"
                style={cssVars}
            >
                {/* Logo - Updated for transparent background */}
                {isRouterLink(items?.[0]?.href) ? (
                    <Link
                        to={items[0].href}
                        aria-label="Home"
                        onMouseEnter={handleLogoEnter}
                        role="menuitem"
                        ref={el => {
                            logoRef.current = el;
                        }}
                        className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden border border-amber-400/20 bg-amber-400/10 hover:bg-amber-400/20 transition-all duration-300"
                        style={{
                            width: 'var(--nav-h)',
                            height: 'var(--nav-h)',
                        }}
                    >
                        {logo ? (
                            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-sm">
                                KKT
                            </div>
                        )}
                    </Link>
                ) : (
                    <a
                        href={items?.[0]?.href || '#'}
                        aria-label="Home"
                        onMouseEnter={handleLogoEnter}
                        ref={el => {
                            logoRef.current = el;
                        }}
                        className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden border border-amber-400/20 bg-amber-400/10 hover:bg-amber-400/20 transition-all duration-300"
                        style={{
                            width: 'var(--nav-h)',
                            height: 'var(--nav-h)',
                        }}
                    >
                        {logo ? (
                            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-sm">
                                KKT
                            </div>
                        )}
                    </a>
                )}

                {/* Desktop Navigation */}
                <div
                    ref={navItemsRef}
                    className="relative items-center rounded-full hidden md:flex ml-3"
                    style={{
                        height: 'var(--nav-h)',
                    }}
                >
                    <ul
                        role="menubar"
                        className="list-none flex items-stretch m-0 p-[4px] h-full"
                        style={{ gap: 'var(--pill-gap)' }}
                    >
                        {items.map((item, i) => {
                            const isActive = activeHref === item.href;

                            const pillStyle = {
                                background: 'var(--pill-bg, rgba(254, 243, 199, 0.1))',
                                color: 'var(--pill-text, #fef3c7)',
                                paddingLeft: 'var(--pill-pad-x)',
                                paddingRight: 'var(--pill-pad-x)',
                                border: isActive ? '1px solid rgba(254, 243, 199, 0.3)' : '1px solid transparent',
                                backdropFilter: 'blur(10px)'
                            };

                            const PillContent = (
                                <>
                                    <span
                                        className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                                        style={{
                                            background: 'rgba(254, 243, 199, 0.8)',
                                            willChange: 'transform'
                                        }}
                                        aria-hidden="true"
                                        ref={el => {
                                            circleRefs.current[i] = el;
                                        }}
                                    />
                                    <span className="label-stack relative inline-block leading-[1] z-[2]">
                                        <span
                                            className="pill-label relative z-[2] inline-block leading-[1] transition-all duration-300"
                                            style={{ willChange: 'transform' }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                                            style={{
                                                color: 'var(--hover-text, #1e1b4b)',
                                                willChange: 'transform, opacity'
                                            }}
                                            aria-hidden="true"
                                        >
                                            {item.label}
                                        </span>
                                    </span>
                                    {isActive && (
                                        <span
                                            className="absolute left-1/2 -bottom-[8px] -translate-x-1/2 w-2 h-2 rounded-full z-[4] animate-pulse"
                                            style={{ background: 'rgba(254, 243, 199, 0.8)' }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </>
                            );

                            const basePillClasses =
                                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-medium text-[15px] leading-[0] tracking-[0.1px] whitespace-nowrap cursor-pointer px-0 transition-all duration-300 hover:border-amber-400/50';

                            return (
                                <li key={item.href} role="none" className="flex h-full">
                                    {isRouterLink(item.href) ? (
                                        <Link
                                            role="menuitem"
                                            to={item.href}
                                            className={basePillClasses}
                                            style={pillStyle}
                                            aria-label={item.ariaLabel || item.label}
                                            onMouseEnter={() => handleEnter(i)}
                                            onMouseLeave={() => handleLeave(i)}
                                        >
                                            {PillContent}
                                        </Link>
                                    ) : (
                                        <a
                                            role="menuitem"
                                            href={item.href}
                                            className={basePillClasses}
                                            style={pillStyle}
                                            aria-label={item.ariaLabel || item.label}
                                            onMouseEnter={() => handleEnter(i)}
                                            onMouseLeave={() => handleLeave(i)}
                                        >
                                            {PillContent}
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <button
                    ref={hamburgerRef}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                    className="md:hidden rounded-full border border-amber-400/20 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative bg-amber-400/10 hover:bg-amber-400/20 transition-all duration-300"
                    style={{
                        width: 'var(--nav-h)',
                        height: 'var(--nav-h)',
                    }}
                >
                    <span
                        className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-300 ease-out"
                        style={{ background: 'var(--pill-text, #fef3c7)' }}
                    />
                    <span
                        className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-300 ease-out"
                        style={{ background: 'var(--pill-text, #fef3c7)' }}
                    />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className="md:hidden absolute top-[4em] left-4 right-4 rounded-2xl shadow-xl z-[998] origin-top backdrop-blur-md border border-white/10"
                style={{
                    ...cssVars,
                    background: 'rgba(0, 0, 0, 0.8)'
                }}
            >
                <ul className="list-none m-0 p-2 flex flex-col gap-2">
                    {items.map(item => {
                        const isActive = activeHref === item.href;
                        const defaultStyle = {
                            background: isActive ? 'rgba(254, 243, 199, 0.2)' : 'rgba(254, 243, 199, 0.1)',
                            color: 'var(--pill-text, #fef3c7)',
                            border: isActive ? '1px solid rgba(254, 243, 199, 0.3)' : '1px solid transparent'
                        };
                        
                        const hoverIn = e => {
                            e.currentTarget.style.background = 'rgba(254, 243, 199, 0.8)';
                            e.currentTarget.style.color = 'var(--hover-text, #1e1b4b)';
                            e.currentTarget.style.border = '1px solid rgba(254, 243, 199, 0.5)';
                        };
                        
                        const hoverOut = e => {
                            e.currentTarget.style.background = isActive ? 'rgba(254, 243, 199, 0.2)' : 'rgba(254, 243, 199, 0.1)';
                            e.currentTarget.style.color = 'var(--pill-text, #fef3c7)';
                            e.currentTarget.style.border = isActive ? '1px solid rgba(254, 243, 199, 0.3)' : '1px solid transparent';
                        };

                        const linkClasses =
                            'block py-4 px-6 text-[16px] font-medium rounded-2xl transition-all duration-300 ease-out text-center';

                        return (
                            <li key={item.href}>
                                {isRouterLink(item.href) ? (
                                    <Link
                                        to={item.href}
                                        className={linkClasses}
                                        style={defaultStyle}
                                        onMouseEnter={hoverIn}
                                        onMouseLeave={hoverOut}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span className="ml-2 w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                                        )}
                                    </Link>
                                ) : (
                                    <a
                                        href={item.href}
                                        className={linkClasses}
                                        style={defaultStyle}
                                        onMouseEnter={hoverIn}
                                        onMouseLeave={hoverOut}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span className="ml-2 w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                                        )}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default PillNav;