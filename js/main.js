/* =============================================
   ELAVATE PORTFOLIO - MAIN JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------
       Loading Screen
    ----------------------------------------- */
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
    }, 1800);
    document.body.style.overflow = 'hidden';

    /* -----------------------------------------
       Mouse Glow
    ----------------------------------------- */
    const mouseGlow = document.getElementById('mouse-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        mouseGlow.style.left = glowX + 'px';
        mouseGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* -----------------------------------------
       Scroll Progress Bar
    ----------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    /* -----------------------------------------
       Navbar Scroll Effect
    ----------------------------------------- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* -----------------------------------------
       Mobile Navigation Toggle
    ----------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* -----------------------------------------
       Active Navigation Link
    ----------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* -----------------------------------------
       Scroll Reveal Animations
    ----------------------------------------- */
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    /* -----------------------------------------
       Counter Animation
    ----------------------------------------- */
    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;

        const aboutSection = document.getElementById('about');
        const rect = aboutSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counterAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);

                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);

    /* -----------------------------------------
       Process Timeline Animation
    ----------------------------------------- */
    const processItems = document.querySelectorAll('.process-item');

    function animateProcess() {
        processItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', animateProcess);

    /* -----------------------------------------
       Particles Canvas
    ----------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(34, 150, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(34, 150, 255, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawLines();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    /* -----------------------------------------
       Button Ripple Effect
    ----------------------------------------- */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (!ripple) return;

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.animation = 'none';

            requestAnimationFrame(() => {
                ripple.style.animation = '';
            });
        });
    });

    /* -----------------------------------------
       Back to Top Button
    ----------------------------------------- */
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -----------------------------------------
       Contact Form Handling
    ----------------------------------------- */
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate form submission
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10B981, #34D399)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    /* -----------------------------------------
       FAQ Accordion
    ----------------------------------------- */
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* -----------------------------------------
       Project Filtering
    ----------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('[data-category]');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter projects
                projects.forEach(project => {
                    if (filter === 'all' || project.getAttribute('data-category') === filter) {
                        project.style.display = '';
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /* -----------------------------------------
       Page Transition Links
    ----------------------------------------- */
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                const transition = document.getElementById('page-transition');
                if (transition) {
                    transition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400);
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    /* -----------------------------------------
       Smooth Scroll for All Anchor Links
    ----------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
