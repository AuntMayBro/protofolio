/**
 * Portfolio Interactivity & Animations
 * Structured modularly for maintainability and best practices.
 */

document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    initCustomCursor();
    initSmoothScrolling();
    initScrollReveal();
    initIconsFetching();
    initAudioPlayer();
    initMenuAndNavigation();
    initTypewriter();
    initProjectCards();
    initMarqueeText();
    initContactForm();
});

// ==========================================
// 1. Initializers
// ==========================================

function initLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function initCustomCursor() {
    if (window.innerWidth <= 768) return;

    const cursorRing = document.createElement('div');
    cursorRing.classList.add('custom-cursor-ring');
    document.body.appendChild(cursorRing);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const speed = 0.1;

    cursorRing.style.opacity = '1';
    cursorDot.style.opacity = '1';

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        ringX += (mouseX - ringX) * speed;
        ringY += (mouseY - ringY) * speed;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveSelectors = 'a, button, .project-card, .menu-bar-icon, .equalizer, .letsTalkButton-main, .svg-icon, .submit-btn';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-item');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.5 });

    revealElements.forEach(el => observer.observe(el));
}

function initIconsFetching() {
    fetch('icons.svg')
        .then(res => res.ok ? res.text() : Promise.reject(res.status))
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.insertBefore(div, document.body.firstChild);
        })
        .catch(err => console.error("Error fetching icons.svg:", err));
}

function initAudioPlayer() {
    const myAudio = document.getElementById('myAudio');
    const equalizer = document.querySelector('.equalizer');

    if (!myAudio || !equalizer) return;

    equalizer.addEventListener('click', () => {
        if (myAudio.paused) {
            myAudio.play().then(() => equalizer.classList.add('playing'))
                          .catch(err => console.error("Autoplay failed:", err));
        } else {
            myAudio.pause();
            equalizer.classList.remove('playing');
        }
    });
}

function initMenuAndNavigation() {
    const menuIcon = document.getElementById('menuIcon');
    const menuPopup = document.getElementById('menuPopup');
    const popupSound = document.getElementById('popupSound');
    const popupNavLinks = menuPopup ? menuPopup.querySelectorAll('ul li a') : [];

    const playPopSound = () => {
        if (!popupSound) return;
        popupSound.currentTime = 0;
        popupSound.play().catch(() => {}); // Catch silent auto-play errors
    };

    if (menuIcon && menuPopup) {
        menuIcon.addEventListener('click', () => {
            playPopSound();
            menuIcon.classList.toggle('open');
            menuPopup.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        menuPopup.addEventListener('click', (e) => {
            if (e.target === menuPopup) {
                menuIcon.classList.remove('open');
                menuPopup.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    if (popupNavLinks.length > 0) {
        popupNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                playPopSound();
                if (menuIcon && menuPopup) {
                    menuIcon.classList.remove('open');
                    menuPopup.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // Attach sound to all other links
    document.querySelectorAll('a').forEach(link => {
        if (link !== menuIcon && !link.closest('.equalizer')) {
            link.addEventListener('click', () => {
                // Play sound for external or generic links
                playPopSound();
            });
        }
    });
}

function initTypewriter() {
    const texts = ["I'm a Software Developer.", "I build things for the Web", "Innovating from idea to execution"];
    const typewriterElement = document.getElementById("typewriter-text");
    if (!typewriterElement) return;

    let index = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const currentText = texts[index];
        charIndex += isDeleting ? -1 : 1;
        typewriterElement.textContent = currentText.substring(0, charIndex);

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            setTimeout(typeEffect, 100);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }
    typeEffect();
}

function initProjectCards() {
    const wrapper = document.querySelector('.project-cards-wrapper');
    const cards = document.querySelectorAll('.project-card');

    if (wrapper) {
        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            wrapper.scrollLeft += e.deltaY;
        });

        wrapper.addEventListener('scroll', () => {
            const screenWidth = window.innerWidth;
            cards.forEach(card => {
                const cardLeft = card.getBoundingClientRect().left;
                if (cardLeft < screenWidth * 0.8 && cardLeft > 0) {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                } else {
                    card.style.transform = 'scale(0.9)';
                    card.style.opacity = '0.7';
                }
            });
        });
    }

    cards.forEach(card => {
        let bounds;
        const rotateToMouse = (e) => {
            const leftX = e.clientX - bounds.left;
            const topY = e.clientY - bounds.top;
            const centerX = leftX - bounds.width / 2;
            const centerY = topY - bounds.height / 2;
            
            const rotateX = Math.max(-15, Math.min(15, centerY / 10));
            const rotateY = Math.max(-15, Math.min(15, -centerX / 10));

            card.style.transform = `perspective(1000px) scale3d(1.05, 1.05, 1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const glow = card.querySelector('.glow');
            if (glow) {
                glow.style.backgroundImage = `radial-gradient(circle at ${leftX}px ${topY}px, #ffffff44, #0000000f)`;
            }
        };

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            document.addEventListener('mousemove', rotateToMouse);
        });

        card.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', rotateToMouse);
            card.style.transform = '';
            const glow = card.querySelector('.glow');
            if (glow) glow.style.backgroundImage = '';
        });
    });
}

function initMarqueeText() {
    const topText = document.getElementById("topText");
    const bottomText = document.getElementById("bottomText");
    if (!topText || !bottomText) return;

    let topOffset = 0, bottomOffset = -bottomText.offsetWidth / 2;
    let scrollVelocity = 0;
    const baseSpeed = 0.6;

    bottomText.style.transform = `translateX(${bottomOffset}px)`;

    function animate() {
        topOffset -= scrollVelocity * baseSpeed;
        bottomOffset += scrollVelocity * baseSpeed;

        const topWidth = topText.offsetWidth / 2;
        const bottomWidth = bottomText.offsetWidth / 2;

        if (topOffset < -topWidth) topOffset += topWidth;
        if (topOffset > 0) topOffset -= topWidth;
        if (bottomOffset > 0) bottomOffset -= bottomWidth;
        if (bottomOffset < -bottomWidth) bottomOffset += bottomWidth;

        topText.style.transform = `translateX(${topOffset}px)`;
        bottomText.style.transform = `translateX(${bottomOffset}px)`;

        scrollVelocity *= 0.9;
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("wheel", (e) => scrollVelocity += e.deltaY * 0.1);
    
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, {passive: true});
    window.addEventListener("touchmove", (e) => {
        const touchEndY = e.touches[0].clientY;
        scrollVelocity += (touchStartY - touchEndY) * 0.4;
        touchStartY = touchEndY;
    }, {passive: true});
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><span class="arrow">⏳</span>';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                submitBtn.innerHTML = '<span>Sent Successfully!</span><span class="arrow">&check;</span>';
                contactForm.reset();
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error(error);
            submitBtn.innerHTML = '<span>Error Sending</span><span class="arrow">!</span>';
        } finally {
            // Revert button back to normal after 4 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
            }, 4000);
        }
    });
}