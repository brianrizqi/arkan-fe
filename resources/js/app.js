// import './bootstrap';
import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Expose GSAP to window for inline scripts
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollToPlugin = ScrollToPlugin;

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize Lenis with smooth settings similar to refined framing
const lenis = new Lenis({
    lerp: 0.05, // Slightly slower lerp for creamier smoothness
    wheelMultiplier: 0.8, // More dampened for precision
    touchMultiplier: 1.2, // Natural touch responsiveness
    infinite: false,
});

// Sync Lenis scroll with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame to GSAP's ticker
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable lag smoothing in GSAP to prevent jumps during heavy loads
gsap.ticker.lagSmoothing(0);

// Expose lenis instance
window.lenis = lenis;

// Handle smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target === '#') return;

        // Close mobile menu if open (toggled via global window.toggleMenu)
        const navbar = document.getElementById('global-navbar');
        if (navbar && navbar.classList.contains('menu-open') && typeof window.toggleMenu === 'function') {
            window.toggleMenu();
        }

        // Logic for #services label-aware scroll
        if (target === '#services' && window.servicesTl) {
            const st = window.servicesTl.scrollTrigger;
            if (st) {
                // Landing at 0.6 allows the final reveal animation to settle 
                // while the scroll finishes, creating a much smoother "glide" effect.
                const targetProgress = 0.6;
                const scrollPos = st.start + (targetProgress * (st.end - st.start));

                lenis.scrollTo(scrollPos, {
                    duration: 3.2, // Significantly slower for an ultra-premium "glide"
                    easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), // Pure exponential out
                    onComplete: () => {
                        setTimeout(() => ScrollTrigger.refresh(), 100);
                    }
                });
                return;
            }
        }

        lenis.scrollTo(target, {
            offset: 0,
            duration: 2.5, // Increased from 1.5 to 2.5 for "very very smooth" feel
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            onComplete: () => {
                // Force ScrollTrigger to recalculate positions after jump
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 100);
            }
        });
    });
});

// Navbar Dynamic Behavior
const navbar = document.getElementById('global-navbar');

if (navbar) {
    // Scroll threshold for background visibility
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => navbar.classList.add('nav-scrolled'),
        onLeaveBack: () => navbar.classList.remove('nav-scrolled'),
    });

    // Handle color switching based on sections (Light/Dark detection)
    // About section is bg-[#F5F1E8] (light), so navbar should be dark
    const lightSections = ['#about', '#services', '#industries'];

    lightSections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80px', // When section is 80px from top (approx navbar height)
                end: 'bottom 80px',
                onEnter: () => navbar.classList.add('nav-dark'),
                onEnterBack: () => navbar.classList.add('nav-dark'),
                onLeave: () => navbar.classList.remove('nav-dark'),
                onLeaveBack: () => navbar.classList.remove('nav-dark'),
            });
        }
    });

    // Service Interactive Image Logic
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImage = document.getElementById('service-display-image');

    if (serviceItems.length > 0 && serviceImage) {
        serviceItems.forEach((item, index) => {
            // Set first item as active by default
            if (index === 0) item.classList.add('active-service');

            item.addEventListener('mouseenter', () => {
                const newSrc = item.getAttribute('data-service-image');
                if (!newSrc || serviceImage.src === newSrc) return;

                // Update active state
                serviceItems.forEach(si => si.classList.remove('active-service'));
                item.classList.add('active-service');

                // GSAP Transition for image
                gsap.to(serviceImage, {
                    opacity: 0,
                    scale: 1.05,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        serviceImage.src = newSrc;
                        gsap.to(serviceImage, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: "power2.out"
                        });
                    }
                });
            });
        });
    }
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE TRANSITIONS & LOADER
// ══════════════════════════════════════════════════════════════════════════
const loader = document.getElementById('loader');
const loaderLogo = document.getElementById('loader-logo');

if (loader && loaderLogo) {
    // Pulse animation (User preferred aesthetics)
    gsap.to(loaderLogo, {
        scale: 1.05,
        filter: "brightness(1.2)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Handle initial Page Load transition (Slide Out)
    window.addEventListener('load', () => {
        const tl = gsap.timeline();

        // Target the hero section for a smooth reveal
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            gsap.set(heroSection, { scale: 1.1, opacity: 0 });
        }

        tl.to(loaderLogo, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            delay: 0.1,
            ease: "power2.inOut",
            onStart: () => {
                if (heroSection) {
                    gsap.to(heroSection, { opacity: 1, duration: 1.2, ease: "power2.inOut" });
                }
            }
        })
            .to(loader, {
                yPercent: -100, // Slide the loader UP and away
                duration: 1.2,
                ease: "expo.inOut",
                onStart: () => {
                    // Trigger Hero content entrance synchronized with loader slide
                    if (window.initHeroEntrance) {
                        window.initHeroEntrance();
                    }
                    if (heroSection) {
                        gsap.to(heroSection, { scale: 1, duration: 2.5, ease: "power2.out" });
                    }
                },
                onComplete: () => {
                    loader.style.visibility = 'hidden';
                    ScrollTrigger.refresh();
                }
            });
    });

    // Page Transition OUT function (Slide In Curtain)
    window.triggerPageTransition = function (url) {
        if (loader.style.visibility === 'visible') return;

        // Reset loader position to bottom before sliding UP to cover
        gsap.set(loader, { visibility: 'visible', yPercent: 100, opacity: 1, display: 'flex' });
        gsap.set(loaderLogo, { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
            onComplete: () => {
                window.location.href = url;
            }
        });

        tl.to(loader, {
            yPercent: 0,
            duration: 0.8,
            ease: "expo.inOut"
        });
    };

    // Internal Link Interception
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || link.target === '_blank') return;

        try {
            const url = new URL(link.href, window.location.origin);
            const isInternal = url.origin === window.location.origin;
            const isSamePage = url.pathname === window.location.pathname;

            if (isInternal && !isSamePage && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                window.triggerPageTransition(link.href);
            }
        } catch (err) {
            // Not a valid URL, skip
        }
    });

    // Handle back/forward button visibility
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            loader.style.visibility = 'hidden';
            gsap.set(loader, { yPercent: -100 });
        }
    });
}
