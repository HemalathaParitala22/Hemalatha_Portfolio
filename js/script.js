// =========================================
// Three.js 3D Background Animation (Purple/Pink/Black)
// =========================================
let scene, camera, renderer, particles;
const AMOUNTX = 55, AMOUNTY = 55;
const SEPARATION = 7;
const particleCount = AMOUNTX * AMOUNTY;

function init3DBackground() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    // Create Scene
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 320;
    camera.position.y = 150;

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Purple and Pink colors
    const colorPurple = new THREE.Color('#9d00ff');
    const colorPink = new THREE.Color('#ff007f');

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z

            // Create gradient transition based on coordinates
            const ratio = (ix + iy) / (AMOUNTX + AMOUNTY);
            const mixedColor = colorPurple.clone().lerp(colorPink, ratio);
            colors[i] = mixedColor.r;
            colors[i + 1] = mixedColor.g;
            colors[i + 2] = mixedColor.b;

            i += 3;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Dynamic circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse parallax variables
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse positions
        mouseX = (e.clientX - window.innerWidth / 2) * 0.3;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.3;
    });

    let count = 0;
    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttribute = geometry.attributes.position;
        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Animate double wave math
                const yVal = (Math.sin((ix + count) * 0.35) * 15) + (Math.sin((iy + count) * 0.45) * 15);
                positionAttribute.setY(i + 1, yVal);
                i += 3;
            }
        }
        positionAttribute.needsUpdate = true;

        // Camera follow mouse coordinates smoothly
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += ((-mouseY + 150) - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        count += 0.04;
    };
    animate();

    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    init3DBackground();
});

// =========================================
// Typing Effect (Typed.js)
// =========================================
if (document.querySelector('.typed-text')) {
    new Typed('.typed-text', {
        strings: [
            "Information Technology", 
            "Web Developer", 
            "Java Full Stack Developer"
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true
    });
}

// =========================================
// AOS Animation Initialization
// =========================================
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 50
});

// =========================================
// Navbar Scroll & Progress Bar
// =========================================
const navbar = document.querySelector('.navbar');
const progressBar = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Navbar Background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';

    // Active Link Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// =========================================
// Mobile Menu Toggle
// =========================================
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    
    // Toggle Icon (Bars to X)
    const icon = hamburger.querySelector('i');
    if (navLinksContainer.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// =========================================
// GSAP Initial Load Animations
// =========================================
// These run when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
    // Basic GSAP timeline for logo and nav links
    gsap.from(".logo", {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "power3.out"
    });
    
    gsap.from(".nav-links li", {
        duration: 1,
        y: -50,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
    });
});

// =========================================
// Contact Form Submission
// =========================================
const contactForm = document.querySelector('.contact-form');
const formNotification = document.querySelector('.form-notification');

if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Show notification
        formNotification.style.display = 'block';
        setTimeout(() => {
            formNotification.classList.add('show');
        }, 10);
        
        // Clear form fields
        contactForm.reset();
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            formNotification.classList.remove('show');
            setTimeout(() => {
                formNotification.style.display = 'none';
            }, 500); // Wait for fade out transition
        }, 3000);
    });
}

// =========================================
// Smart Routing for Email and LinkedIn
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // Email Links: Direct Compose Mode
    const emailBtns = document.querySelectorAll('.email-btn');
    emailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = "23jr1a12d3@gmail.com";
            // Check if user is on mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Open native mail client directly to compose
                window.location.href = `mailto:${email}`;
            } else {
                // Open Gmail compose tab directly in a new window, bypassing inboxes/search
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
            }
        });
    });

    // LinkedIn Links: Native App Deep Linking
    const linkedinBtns = document.querySelectorAll('.linkedin-btn');
    linkedinBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const profileUrl = "https://www.linkedin.com/in/hemalatha-paritala-a8aa49314/";
            const appUrl = "linkedin://profile/hemalatha-paritala-a8aa49314";
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                // Try to launch LinkedIn app, fall back to browser if it doesn't open in 1.5s
                window.location.href = appUrl;
                setTimeout(() => {
                    window.open(profileUrl, '_blank');
                }, 1500);
            } else {
                // Open clean profile link in a new window
                window.open(profileUrl, '_blank');
            }
        });
    });
});
