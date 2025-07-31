document.addEventListener('DOMContentLoaded', () => {

    if (window.innerWidth <= 768) {
        return;
    }

    const cursorRing = document.createElement('div');
    cursorRing.classList.add('custom-cursor-ring');
    document.body.appendChild(cursorRing);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    const speed = 0.1; 

    cursorRing.style.opacity = '1';
    cursorDot.style.opacity = '1';

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        ringX += (mouseX - ringX) * speed;
        ringY += (mouseY - ringY) * speed;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animate);
    }

    animate();

    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .menu-bar-icon, .equalizer, .letsTalkButton-main, .svg-icon, .submit-btn'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });

});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // Audio element references
    const popupSound = document.getElementById('popupSound'); // For menu and general link clicks
    const myAudio = document.getElementById('myAudio'); // For the equalizer music

    // Lucide Icons initialization
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // =====================================
    // New: Scroll Reveal Animation
    // =====================================

    const revealElements = document.querySelectorAll('.reveal-item');
    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Fetching icons.svg
    fetch('icons.svg')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.insertBefore(div, document.body.firstChild);
        })
        .catch(error => {
            console.error("Error fetching icons.svg:", error);
        });

    // Audio Player (for the equalizer icon in the navbar)
    const equalizer = document.querySelector('.equalizer');

    if (myAudio && equalizer) {
        equalizer.addEventListener('click', () => {
            if (myAudio.paused) {
                myAudio.play()
                    .then(() => {
                        equalizer.classList.add('playing');
                    })
                    .catch(error => {
                        console.error("Autoplay failed:", error);
                    });
            } else {
                myAudio.pause();
                equalizer.classList.remove('playing');
            }
        });
    } else {
        console.warn("Audio player elements (#myAudio or .equalizer) not found. Audio functionality will not work.");
    }

    // Hamburger Icon Animation & Popup Logic
    const menuIcon = document.getElementById('menuIcon');
    const menuPopup = document.getElementById('menuPopup');
    // Get all navigation links within the popup
    const popupNavLinks = menuPopup ? menuPopup.querySelectorAll('ul li a') : [];

    if (menuIcon && menuPopup && popupSound) {
        menuIcon.addEventListener('click', () => {

            popupSound.currentTime = 0;
            popupSound.play().catch(error => {
                console.error("Popup sound play failed:", error);
            });

            menuIcon.classList.toggle('open');
            menuPopup.classList.toggle('open');

            // --- IMPORTANT: Toggle no-scroll class on body ---
            document.body.classList.toggle('no-scroll');
        });

        // Close popup if clicked anywhere outside content
        menuPopup.addEventListener('click', (event) => {
            if (event.target === menuPopup) {
                menuIcon.classList.remove('open');
                menuPopup.classList.remove('open');
                // --- IMPORTANT: Remove no-scroll class when closing ---
                document.body.classList.remove('no-scroll');
            }
        });
    } else {
        console.error("Error: One or more menu elements not found (#menuIcon, #menuPopup, or #popupSound). Menu and popup functionality will not work.");
    }

    // Smooth scroll for popup navigation links (these also play popupSound)
    if (popupNavLinks.length > 0 && menuIcon && menuPopup && popupSound) {
        popupNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {

                    if (popupSound) {
                        popupSound.currentTime = 0;
                        popupSound.play().catch(error => console.error("Popup link click sound play failed:", error));
                    }

                    menuIcon.classList.remove('open');
                    menuPopup.classList.remove('open');
                    document.body.classList.remove('no-scroll');

                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    } else {
        console.warn("No popup navigation links found or necessary elements missing for smooth scrolling.");
    }


    // Universal Link Click Sound (popupSound for all other 'a' tags)
    const allLinks = document.querySelectorAll('a');

    if (popupSound && allLinks.length > 0) {
        allLinks.forEach(link => {
            // Exclude links already handled: menuIcon and any link within the equalizer
            if (link !== menuIcon && link.closest('.equalizer') === null) {
                link.addEventListener('click', (event) => {
                    // Prevent default for internal anchor links to allow sound to play before scroll
                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        event.preventDefault();
                    }

                    popupSound.currentTime = 0;
                    popupSound.play().catch(error => {
                        console.error("General link click sound failed:", error);
                    });

                    // For internal anchor links, handle smooth scroll manually after sound
                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        const targetId = link.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        if (targetSection) {
                            // Close menu if an internal link is clicked (e.g., from outside the popup)
                            if (menuIcon && menuPopup) {
                                menuIcon.classList.remove('open');
                                menuPopup.classList.remove('open');
                                // --- IMPORTANT: Remove no-scroll class when closing via internal link click ---
                                document.body.classList.remove('no-scroll');
                            }
                            targetSection.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            }
        });
    }


    // Typewriter Effect
    const texts = [
        "I'm a Software Developer.",
        "I build things for the Web",
        "Innovating from idea to execution"
    ];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const pauseTime = 1500;
    const typewriterElement = document.getElementById("typewriter-text");

    if (typewriterElement) {
        function typeEffect() {
            const currentText = texts[index];

            if (isDeleting) {
                charIndex--;
                typewriterElement.textContent = currentText.substring(0, charIndex);
            } else {
                charIndex++;
                typewriterElement.textContent = currentText.substring(0, charIndex);
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(typeEffect, typingSpeed);
            } else {
                setTimeout(typeEffect, isDeleting ? typingSpeed / 2 : typingSpeed);
            }
        }
        typeEffect();
    }


    // Project Cards Wrapper - Horizontal Scrolling
    const projectCardsWrapper = document.querySelector('.project-cards-wrapper');
    if (projectCardsWrapper) {
        projectCardsWrapper.addEventListener('wheel', (event) => {
            event.preventDefault();
            projectCardsWrapper.scrollLeft += event.deltaY;
        });
    }


    // Project Cards Hover Effect (3D effect)
    const cards = document.querySelectorAll('.project-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            let bounds;

            function rotateToMouse(e) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftX = mouseX - bounds.left;
                const topY = mouseY - bounds.top;
                const center = {
                    x: leftX - bounds.width / 2,
                    y: topY - bounds.height / 2
                };
                const rotateX = Math.max(-15, Math.min(15, center.y / 10));
                const rotateY = Math.max(-15, Math.min(15, -center.x / 10));

                card.style.transform = `
                    perspective(1000px)
                    scale3d(1.05, 1.05, 1.05)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

                const glow = card.querySelector('.glow');
                if (glow) {
                    glow.style.backgroundImage = `
                        radial-gradient(
                            circle at ${leftX}px ${topY}px,
                            #ffffff44,
                            #0000000f
                        )
                    `;
                }
            }

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

    // const projectCardsWrapper = document.querySelector('.project-cards-wrapper');
    if (projectCardsWrapper) {
        projectCardsWrapper.addEventListener('scroll', () => {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                const cardLeft = card.getBoundingClientRect().left;
                const screenWidth = window.innerWidth;
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


    //scrolltext effect 
    const topText = document.getElementById("topText");
    const bottomText = document.getElementById("bottomText");

    let topOffset = 0;
    let bottomOffset = 0;
    let scrollVelocity = 0;
    const baseSpeed = 0.6;

    window.addEventListener('DOMContentLoaded', () => {
        bottomOffset = -bottomText.offsetWidth / 2;
        bottomText.style.transform = `translateX(${bottomOffset}px)`;
    });

    function animate() {
        topOffset -= scrollVelocity * baseSpeed;
        bottomOffset += scrollVelocity * baseSpeed;

        const topWidth = topText.offsetWidth / 2;
        const bottomWidth = bottomText.offsetWidth / 2;

        if (topOffset < -topWidth) {
            topOffset += topWidth;
        }

        if (topOffset > 0) {
            topOffset -= topWidth;
        }

        if (bottomOffset > 0) {
            bottomOffset -= bottomWidth;
        }
        if (bottomOffset < -bottomWidth) {
            bottomOffset += bottomWidth;
        }


        topText.style.transform = `translateX(${topOffset}px)`;
        bottomText.style.transform = `translateX(${bottomOffset}px)`;

        scrollVelocity *= 0.9;

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("wheel", (e) => {
        scrollVelocity += e.deltaY * 0.1;
    });


    let touchStartY = 0;

    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener("touchmove", (e) => {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        scrollVelocity += deltaY * 0.4;
        touchStartY = touchEndY;
    });


    // Contact Form Button
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Sending...';
            
            // Changed the timeout from 2000ms to 5000ms
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Sent!</span><span class="arrow">&check;</span>';
                contactForm.reset();
            }, 900); // 5000 milliseconds = 5 seconds
        });
    }

}); // End of DOMContentLoaded