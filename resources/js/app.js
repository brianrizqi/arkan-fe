// import './bootstrap';
import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Expose GSAP to window for inline scripts
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis with smooth settings similar to refined framing
const lenis = new Lenis({
    lerp: 0.1, // Smoothness intensity (0-1). Lower is smoother/slower. Default is 0.1.
    wheelMultiplier: 1, // Mouse wheel speed.
    touchMultiplier: 2, // Touch output speed.
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
    const lightSections = ['#about', '#services', '#industries', '#ose'];

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
}

// Loader Animation
const loader = document.getElementById('loader');
const loaderLogo = document.getElementById('loader-logo');

if (loader && loaderLogo) {
    // Premium Pulse Animation
    gsap.to(loaderLogo, {
        scale: 1.05,
        filter: "brightness(1.2)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Handle Page Load
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
            duration: 0.8,
            delay: 0.5,
            ease: "power2.inOut",
            onStart: () => {
                // Pre-warm the hero section visibility
                if (heroSection) {
                    gsap.to(heroSection, { opacity: 1, duration: 1.2, ease: "power2.inOut" });
                }
            }
        })
            .to(loader, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                onStart: () => {
                    // Trigger Hero content entrance synchronized with loader fade
                    if (window.initHeroEntrance) {
                        window.initHeroEntrance();
                    }
                    if (heroSection) {
                        gsap.to(heroSection, { scale: 1, duration: 2.5, ease: "power2.out" });
                    }
                },
                onComplete: () => {
                    loader.style.display = 'none';
                    ScrollTrigger.refresh();
                }
            });
    });
}
