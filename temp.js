    <script>
        // Inline Scripts from Components (Flattened)
        window.initHeroEntrance = () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.5 } });
            tl.to('.logo-text', { opacity: 1, y: 0, scale: 1, startAt: { y: 30, scale: 0.95 }, duration: 2 })
                .to('.tagline', { opacity: 1, y: 0, startAt: { y: 20 }, duration: 1.2 }, '-=1.2')
                .to('.nav-item', { opacity: 1, y: 0, startAt: { y: -20 }, stagger: 0.1, duration: 1 }, '-=1')
                .to('.scroll-indicator', { opacity: 1, y: 0, startAt: { y: 20 }, duration: 1 }, '-=0.8');
        };

        // Pin Hero Section for a smooth wiping effect from the About section
        document.addEventListener('DOMContentLoaded', () => {
            gsap.config({ force3D: true }); // Prevent jagging on high res screens

            ScrollTrigger.create({
                trigger: '#hero-section',
                start: 'top top',
                pin: true,
                pinSpacing: false, // Let the next section scroll over it natively without pushing it down
                end: 'bottom top'
            });
            // Navbar Logic
            const trigger = document.getElementById('mobile-menu-trigger');
            const overlay = document.getElementById('mobile-menu-overlay');
            const navbar = document.getElementById('global-navbar');
            const links = document.querySelectorAll('.mobile-nav-link');
            let isMenuOpen = false;

            const toggleMenu = () => {
                isMenuOpen = !isMenuOpen;
                if (isMenuOpen) {
                    navbar.classList.add('menu-open');
                    overlay.classList.remove('pointer-events-none');
                    gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
                    gsap.to('.hamburger-inner-mid', { opacity: 0, duration: 0.2 });
                    gsap.to('.hamburger-inner:first-child', { y: 7.5, rotate: 45, duration: 0.3 });
                    gsap.to('.hamburger-inner:last-child', { y: -7.5, rotate: -45, duration: 0.3 });
                    gsap.to(links, { opacity: 1, y: 0, startAt: { y: 20 }, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 });
                    gsap.to('.mobile-nav-footer', { opacity: 1, duration: 1, delay: 0.6 });
                } else {
                    navbar.classList.remove('menu-open');
                    overlay.classList.add('pointer-events-none');
                    gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
                    gsap.to('.hamburger-inner-mid', { opacity: 1, duration: 0.2, delay: 0.1 });
                    gsap.to('.hamburger-inner:first-child', { y: 0, rotate: 0, duration: 0.3 });
                    gsap.to('.hamburger-inner:last-child', { y: 0, rotate: 0, duration: 0.3 });
                    gsap.to(links, { opacity: 0, y: 10, duration: 0.3 });
                    gsap.to('.mobile-nav-footer', { opacity: 0, duration: 0.3 });
                }
            };
            trigger.addEventListener('click', toggleMenu);
            links.forEach(link => link.addEventListener('click', () => isMenuOpen && toggleMenu()));

            // About Scroll Logic
            const aboutTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top top',
                    end: '+=700%',
                    scrub: 2,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Initial appearance of images (soft base opacity, then more visible)
            aboutTl.to('.gallery-img-wrapper', {
                opacity: 0.8,
                stagger: 0.1,
                duration: 1,
                ease: 'power2.out'
            }, 0);

            // Text fades out
            aboutTl.to('#about-content-1', {
                opacity: 0,
                y: -100,
                duration: 2,
                ease: 'power2.inOut'
            }, 1.5);

            // Parallax movement for gallery items: falling downwards
            gsap.utils.toArray('.gallery-img-wrapper').forEach((img, i) => {
                // Generate a pseudo-random parallax speed based on index
                const yPos = 300 + ((i % 5) * 150);
                const rotation = (i % 2 === 0 ? 1 : -1) * (i % 4 + 2);
                aboutTl.to(img, {
                    y: yPos,
                    rotate: rotation,
                    filter: 'blur(' + (i % 3 === 0 ? '8px' : '4px') + ')',
                    duration: 4
                }, 0);
            });

            // Second text fades in
            aboutTl.fromTo('#about-content-2',
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 2, ease: 'power2.out', onStart: () => document.getElementById('about-content-2').classList.remove('pointer-events-none') },
                3
            );

            // Add empty time at the end so the user can read the text before the section unpins and scrolls away
            aboutTl.to({}, { duration: 2 });

            // Services Scroll Transition Logic
            const servicesTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#services',
                    start: 'top top',
                    end: '+=500%',
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // 1. Star fades in, scales, rotates
            servicesTl.fromTo('#services-star',
                { opacity: 0, scale: 0.6, rotation: 0 },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 45,
                    ease: 'power3.out',
                    duration: 1.5
                }
            );

            // 2. Star pulse outward, blur, opacity drop
            servicesTl.to('#services-star', {
                scale: 1.2,
                opacity: 0.08,
                filter: 'blur(2px)',
                ease: 'power1.inOut',
                duration: 1
            });

            // 3. Background transition & Star moves
            servicesTl.to('#services', {
                backgroundColor: '#F1ECE6',
                duration: 1.5,
                ease: 'power2.inOut',
                immediateRender: false
            }, 'bgTransition');

            servicesTl.to('#services-star', {
                x: '40vw',
                y: '-40vh',
                scale: 2.5,
                opacity: 0.05,
                duration: 1.5,
                ease: 'power2.inOut'
            }, 'bgTransition');

            // 4. Content fade in with stagger
            servicesTl.to('.services-title', {
                opacity: 1,
                y: 0,
                startAt: { y: 40 },
                duration: 1,
                ease: 'power2.out'
            }, 'contentIn');

            servicesTl.to('.service-item', {
                opacity: 1,
                y: 0,
                startAt: { y: 20 },
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            }, 'contentIn+=0.2');

            servicesTl.to('.services-image-container', {
                opacity: 1,
                x: 0,
                startAt: { x: 80 },
                duration: 1.2,
                ease: 'power2.out'
            }, 'contentIn+=0.4');

            // 5. Extra padding before unpinning
            servicesTl.to({}, { duration: 2 });

            // Industries Slider Logic
            let currentIndustry = 0;
            const industrySlides = document.querySelectorAll('.industry-slide');
            const totalIndustries = industrySlides.length;
            let isTransitioning = false;

            const nextBtn = document.getElementById('next-industry');
            const prevBtn = document.getElementById('prev-industry');

            function updateNavStates() {
                if (!prevBtn || !nextBtn) return;

                // Hide/Show Prev Arrow
                if (currentIndustry === 0) {
                    gsap.to(prevBtn, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
                } else {
                    gsap.to(prevBtn, { opacity: 1, pointerEvents: 'auto', duration: 0.5 });
                }

                // Hide/Show Next Arrow
                if (currentIndustry === totalIndustries - 1) {
                    gsap.to(nextBtn, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
                } else {
                    gsap.to(nextBtn, { opacity: 1, pointerEvents: 'auto', duration: 0.5 });
                }
            }

            function goToSlide(index, direction) {
                if (isTransitioning || index === currentIndustry) return;
                isTransitioning = true;

                const currentSlide = industrySlides[currentIndustry];
                const nextSlide = industrySlides[index];

                const slideWidth = 100;
                const exitX = direction === 'next' ? -slideWidth : slideWidth;
                const enterX = direction === 'next' ? slideWidth : -slideWidth;

                const tl = gsap.timeline({
                    onComplete: () => {
                        currentSlide.classList.remove('z-10');
                        currentSlide.classList.add('z-0');
                        isTransitioning = false;
                        updateNavStates();
                    }
                });

                // Prepare next slide
                gsap.set(nextSlide, { xPercent: enterX, opacity: 1, zIndex: 10 });
                gsap.set(nextSlide.querySelector('.slide-bg'), { xPercent: -enterX * 0.3 }); // Parallax start
                gsap.set(nextSlide.querySelectorAll('p, h2'), { y: 40, opacity: 0 });

                // Animate Out
                tl.to(currentSlide, {
                    xPercent: exitX,
                    duration: 1.4,
                    ease: 'expo.inOut'
                }, 0);

                tl.to(currentSlide.querySelector('.slide-bg'), {
                    xPercent: -exitX * 0.3,
                    duration: 1.4,
                    ease: 'expo.inOut'
                }, 0);

                // Animate In
                tl.to(nextSlide, {
                    xPercent: 0,
                    duration: 1.4,
                    ease: 'expo.inOut',
                    onStart: () => {
                        nextSlide.classList.remove('z-0');
                        nextSlide.classList.add('z-10');
                    }
                }, 0);

                tl.to(nextSlide.querySelector('.slide-bg'), {
                    xPercent: 0,
                    duration: 1.4,
                    ease: 'expo.inOut'
                }, 0);

                // Staggered Text Reveal
                tl.to(nextSlide.querySelectorAll('p, h2'), {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out'
                }, 0.6);

                currentIndustry = index;
            }

            if (nextBtn && prevBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentIndustry < totalIndustries - 1) {
                        goToSlide(currentIndustry + 1, 'next');
                    }
                });

                prevBtn.addEventListener('click', () => {
                    if (currentIndustry > 0) {
                        goToSlide(currentIndustry - 1, 'prev');
                    }
                });
            }

            // Initial state set
            updateNavStates();
            gsap.set(industrySlides[0], { opacity: 1, xPercent: 0, zIndex: 10 });

            // Industries Reveal Animation
            const industriesRevealTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#industries',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });
            industriesRevealTl.fromTo('.industries-slider-wrapper',
                { scale: 0.9, y: 100 },
                { scale: 1, y: 0, duration: 1, ease: 'power2.out' }
            );

            gsap.utils.toArray('.slide-bg').forEach((bg, i) => {
                gsap.fromTo(bg,
                    { scale: 1.2 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '#industries',
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            });

            // Process Scroll Logic
            const processIntroTl = gsap.timeline({ scrollTrigger: { trigger: '#process', start: 'top 80%', toggleActions: 'play none none none' } });
            processIntroTl.to('.process-ornament', { opacity: 1, scale: 1, startAt: { scale: 0.8 }, duration: 1, ease: 'power2.out' })
                .to('.process-header-title', { opacity: 1, y: 0, startAt: { y: 30 }, duration: 1.2, ease: 'power3.out' }, '-=0.8')
                .to('.process-header-text', { opacity: 1, y: 0, startAt: { y: 20 }, duration: 1, ease: 'power3.out' }, '-=0.8');

            // Initial States for Process Pinnable
            gsap.set('.process-bg-2, .process-bg-3', { xPercent: 101 }); // Small buffer
            gsap.set('.process-bg-wrapper .process-bg', { scale: 1.2 });

            const processPinTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#process-pin-container',
                    start: 'top top',
                    end: '+=600%', // More runway
                    pin: true,
                    scrub: 1.2
                }
            });

            // Global Background Zoom-out
            processPinTl.to('.process-bg-wrapper .process-bg',
                { scale: 1, duration: 10, ease: 'none' }, 0);

            // Phase 1 (Design) OUT
            processPinTl.to('.phase-design span, .phase-design h3, .phase-design div', {
                y: -50,
                opacity: 0,
                stagger: 0.1,
                duration: 2,
                ease: 'power2.in'
            }, 0.5);

            // Phase 2 (Production) IN + Background Slide
            processPinTl.to('.process-bg-2', {
                xPercent: 0,
                duration: 3,
                ease: 'expo.inOut'
            }, 1)
                .fromTo('.process-bg-2 .process-bg',
                    { xPercent: 30 },
                    { xPercent: 0, duration: 3, ease: 'expo.inOut' }, 1)
                .to('.phase-production', { opacity: 1, duration: 0.5 }, 2)
                .fromTo('.phase-production span, .phase-production h3, .phase-production div',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: 'power3.out' }, 2.5)
                .to({}, { duration: 2 }); // Pause

            // Phase 2 (Production) OUT
            processPinTl.to('.phase-production span, .phase-production h3, .phase-production div', {
                y: -50,
                opacity: 0,
                stagger: 0.1,
                duration: 2,
                ease: 'power2.in'
            }, 5.5);

            // Phase 3 (Digitalization) IN + Background Slide
            processPinTl.to('.process-bg-3', {
                xPercent: 0,
                duration: 3,
                ease: 'expo.inOut'
            }, 6)
                .fromTo('.process-bg-3 .process-bg',
                    { xPercent: 30 },
                    { xPercent: 0, duration: 3, ease: 'expo.inOut' }, 6)
                .to('.phase-digitalization', { opacity: 1, duration: 0.5 }, 7)
                .fromTo('.phase-digitalization span, .phase-digitalization h3, .phase-digitalization div',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: 'power3.out' }, 7.5);

            // Journal Scroll Logic
            const journalTl = gsap.timeline({ scrollTrigger: { trigger: '#journal', start: 'top 80%', toggleActions: 'play none none none' } });
            journalTl.to('.journal-title', { opacity: 1, y: 0, startAt: { y: 30 }, duration: 1.2, ease: 'power3.out' })
                .to('.journal-view-all', { opacity: 1, x: 0, startAt: { x: 20 }, duration: 1, ease: 'power3.out' }, '-=0.8')
                .to('.journal-item', { opacity: 1, y: 0, startAt: { y: 40 }, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.6');

            // OSE Scroll Logic
            gsap.to('.ose-blue-gradient', {
                opacity: 1, ease: 'none',
                scrollTrigger: { trigger: '#ose-spacer', start: 'top 40%', end: 'center center', scrub: true }
            });
            const oseTl = gsap.timeline({ scrollTrigger: { trigger: '#ose-spacer', start: 'top 40%', toggleActions: 'play none none none' } });
            oseTl.to('.ose-final-ornament', { opacity: 0.3, scale: 1, startAt: { scale: 0.8 }, duration: 2, ease: 'power2.out' })
                .to('.ose-cta-title', { opacity: 1, y: 0, startAt: { y: 50 }, duration: 1.5, ease: 'power3.out' }, '-=1.5')
                .to('.ose-cta-button', { opacity: 1, y: 0, startAt: { y: 30 }, duration: 1.2, ease: 'power3.out' }, '-=1');

            // Footer Reveal Logic
            const footerReveal = document.getElementById('footer-reveal');
            const footerSpacer = document.getElementById('footer-spacer');
            const oseSection = document.getElementById('ose');

            if (footerReveal && footerSpacer && oseSection) {
                const updateFooterSpacer = () => {
                    footerSpacer.style.height = footerReveal.offsetHeight + 'px';
                };
                updateFooterSpacer();
                window.addEventListener('resize', updateFooterSpacer);

                // Re-parallax OSE up to reveal the Footer behind it
                gsap.to(oseSection, {
                    y: () => -footerReveal.offsetHeight,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#footer-spacer',
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });

                // Reveal Animation for Internal Footer items
                gsap.to('#footer-reveal > div', {
                    y: 0,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#footer-spacer',
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true
                    }
                });
            }

            // Create hover interaction for Services
            const serviceItems = document.querySelectorAll('.service-item');
            const serviceDisplayImage = document.getElementById('service-display-image');

            if (serviceItems.length > 0 && serviceDisplayImage) {
                serviceItems.forEach(item => {
                    item.addEventListener('mouseenter', function () {
                        const newImgSrc = this.getAttribute('data-service-image');
                        if (newImgSrc && serviceDisplayImage.src !== newImgSrc) {
                            // Smooth crossfade using GSAP
                            gsap.to(serviceDisplayImage, {
                                opacity: 0,
                                duration: 0.3,
                                onComplete: () => {
                                    serviceDisplayImage.src = newImgSrc;
                                    gsap.to(serviceDisplayImage, { opacity: 1, duration: 0.4 });
                                }
                            });
                        }
                    });
                });
            }
        });
    </script>
