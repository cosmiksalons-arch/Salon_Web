function toggleDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('overlay');
    
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto'; 
    } else {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
}

// Function to generate menu HTML from JSON data
function loadMenu(genderType) {
    const container = document.getElementById('dynamic-menu');
    if (!container) return; // Exit if not on a menu page

    // 1. Filter data for the specific gender
    const filteredData = menuData.filter(item => item.gender === genderType);

    // 2. Group data by Category
    const groupedData = {};
    filteredData.forEach(item => {
        if (!groupedData[item.category]) {
            groupedData[item.category] = [];
        }
        groupedData[item.category].push(item);
    });

    // 3. Generate HTML
    let htmlContent = '';

    for (const [category, items] of Object.entries(groupedData)) {
        htmlContent += `
            <div class="menu-section">
                <h3 class="category-title">${category}</h3>
                <div class="menu-header-row">
                    <div class="col-name">Service</div>
                    <div class="col-price">Reg</div>
                    <div class="col-price vip-header">VIP</div>
                </div>
        `;

        items.forEach(item => {
            htmlContent += `
                <div class="menu-row">
                    <div class="col-name">${item.service}</div>
                    <div class="col-price">₹${item.reg}</div>
                    <div class="col-price col-vip">₹${item.vip}</div>
                </div>
            `;
        });

        htmlContent += `</div>`; // Close menu-section
    }

    // 4. Inject into page
    container.innerHTML = htmlContent;
}

// Scroll Intersection Observer for fade animations
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.scroll-fade');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
});

// Interactive Background Tracking
document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// --- BACKGROUND CANVAS ANIMATION (Golden Dust) ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
            this.speedY = Math.random() * 0.5 + 0.2; // Float upwards
            this.speedX = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // Randomly some particles will glow more
            this.glow = Math.random() > 0.8;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            // Reset to bottom if it floats off top
            if (this.y < -10) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold color
            if (this.glow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#D4AF37';
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        // Determine particle count based on screen size (prevent mobile lag)
        const particleCount = width < 768 ? 30 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
});