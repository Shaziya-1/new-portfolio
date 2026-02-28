// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Preloader Logic & Animations
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Wait a bit for the cinematic morphing symbol to shine, then fade out
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            initAnimations();
        }, 1500); // Wait for CSS opacity transition
    }, 4500); // 4.5 seconds of loading glory for the new symbol animation
});

function initAnimations() {

    // Custom cursor logic could go here, but focusing on the requested 3D motions
    // 2. Hero Section Animations
    const heroCard = document.getElementById('hero-card');

    gsap.fromTo(heroCard,
        { opacity: 0, y: 100, rotationX: 15 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.5, ease: "power3.out" }
    );

    // Parallax on Mouse Move (Anti-gravity feel for hero)
    const orb = document.getElementById('golden-orb');
    const stars = document.getElementById('star-particles');

    // Slow continuous rotation for the orb
    gsap.to(orb, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "linear"
    });

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        gsap.to(heroCard, {
            rotationY: x,
            rotationX: y,
            transformPerspective: 1000,
            ease: 'power1.out',
            duration: 1
        });

        // Parallax the orb slightly against the stars
        gsap.to(orb, {
            x: x * 2,
            y: y * 2,
            ease: 'power1.out',
            duration: 1.5
        });

        gsap.to(stars, {
            backgroundPosition: `${x * 5}px ${y * 5}px`,
            ease: 'power1.out',
            duration: 1.5
        });
    });

    // 4. Section Titles entry
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // 5. About Section
    gsap.from('.about-image', {
        scrollTrigger: { trigger: '#about', start: 'top 70%' },
        x: -100, opacity: 0, rotationY: -15, duration: 1.2
    });

    gsap.utils.toArray('.reveal-text').forEach((text, i) => {
        gsap.to(text, {
            scrollTrigger: { trigger: '#about', start: 'top 60%' },
            opacity: 1, y: 0, duration: 1, delay: i * 0.2
        });
    });

    // 6. Skills Orbit Motion
    animateOrbits();

    gsap.utils.toArray('.skill-cluster').forEach((cluster, i) => {
        gsap.from(cluster, {
            scrollTrigger: { trigger: '#skills', start: 'top 75%' },
            y: 100, opacity: 0, rotationX: -10, duration: 1, delay: i * 0.2
        });
    });

    // 7. Experience & Education Timelines

    // Animate the center line tracking progress
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        gsap.to('#timeline-progress', {
            scrollTrigger: {
                trigger: timelineContainer,
                start: "top center",
                end: "bottom center",
                scrub: 1
            },
            height: "100%",
            ease: "none"
        });
    }

    gsap.utils.toArray('.timeline-edu').forEach((item, i) => {
        const xOffset = item.classList.contains('left') ? -100 : 100;
        gsap.to(item, {
            scrollTrigger: { trigger: item, start: 'top 85%' },
            x: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.5)'
        });
        // Set initial state
        gsap.set(item, { x: xOffset, opacity: 0 });
    });

    gsap.utils.toArray('.experience-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: '#experience', start: 'top 80%' },
            y: 50, opacity: 0, rotationX: -10, duration: 1, delay: i * 0.2
        });
    });

    // 8. Projects Section
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: '#projects', start: 'top 80%' },
            y: 100, opacity: 0, rotationY: 10, duration: 1, delay: i * 0.15
        });
    });

    // 9. Contact
    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '#contact', start: 'top 80%' },
        scale: 0.9, opacity: 0, duration: 1
    });

    // 10. Navbar Scrollspy
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // Trigger when 60% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupHeroFloatingElements() {
    // Removed specific floating items, replaced entirely by abstract golden orb.
    // Keeping this stub empty or can remove.
}

function animateOrbits() {
    const containers = document.querySelectorAll('.orbit-container');
    containers.forEach(container => {
        const items = container.querySelectorAll('.orbit-item');
        const radius = 80; // orbit radius
        let time = 0;

        function renderOrbit() {
            time += 0.005; // speed
            items.forEach((item) => {
                // Read starting angle
                const startAngle = parseFloat(item.getAttribute('data-angle'));
                const rad = (startAngle * Math.PI / 180) + time;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius * 0.4; // oval flattened orbit
                const z = Math.sin(rad) * radius; // depth for 3D

                item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

                // Darken items that are "behind"
                if (z < 0) {
                    item.style.opacity = 0.5 + (z / radius) * 0.5; // less opaque farther back
                    item.style.zIndex = 1;
                } else {
                    item.style.opacity = 1;
                    item.style.zIndex = 10;
                }
            });
            requestAnimationFrame(renderOrbit);
        }
        renderOrbit();
    });
}

// Subtle particles for preloader
const particleContainer = document.getElementById('preloader-particles');
if (particleContainer) {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = Math.random() * 3 + 1 + 'px';
        p.style.height = p.style.width;
        p.style.background = '#d4af37';
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.opacity = Math.random() * 0.5;
        p.style.boxShadow = '0 0 10px #d4af37';
        particleContainer.appendChild(p);

        gsap.to(p, {
            y: `-=${Math.random() * 100 + 50}`,
            opacity: 0,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            delay: Math.random() * 2
        });
    }
}

// Experience Modal popups
window.openExperienceModal = function (companyId, titleStr, descStr) {
    const modal = document.getElementById('exp-modal');
    document.getElementById('modal-title').innerText = titleStr;
    document.getElementById('modal-company').innerText = companyId;
    document.getElementById('modal-desc').innerText = descStr;

    // Switch icon depending on the item if we want, or keep generic
    const iconMap = {
        'Techgyan': 'fa-laptop-code',
        'Oasis': 'fa-globe',
        'Secure': 'fa-shield-alt',
        'MESCO': 'fa-hands-helping',
        'Naviotech': 'fa-brain',
        'L&T': 'fa-hard-hat'
    };
    const iconClass = iconMap[companyId] || 'fa-briefcase';
    document.getElementById('modal-icon').innerHTML = `<i class="fas ${iconClass}"></i>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling while modal is open
};

window.closeExperienceModal = function () {
    const modal = document.getElementById('exp-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // restore scrolling
};

/* =========================
   CERTIFICATE CLICK HANDLER
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("certModalImg");
    const closeBtn = document.querySelector(".cert-close");

    if (!modal || !modalImg) return;

    document.querySelectorAll(".cert-card").forEach(card => {
        card.addEventListener("click", () => {
            const imgSrc = card.getAttribute("data-image");
            if (!imgSrc) return;

            modalImg.src = imgSrc;
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        modalImg.src = "";
        document.body.style.overflow = "auto";
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalImg.src = "";
            document.body.style.overflow = "auto";
        }
    });
});

let submitted = false;

function closePopup() {
    document.getElementById("successPopup").style.display = "none";
}

document.querySelector(".contact-form").addEventListener("submit", () => {
    submitted = true;

    setTimeout(() => {
        document.getElementById("successPopup").style.display = "flex";
        document.querySelector(".contact-form").reset();
    }, 800); // thoda delay for submit
});

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

