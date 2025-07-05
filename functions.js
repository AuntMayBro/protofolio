document.addEventListener('DOMContentLoaded', () => {

    // Audio element references
    const popupSound = document.getElementById('popupSound'); 
    const myAudio = document.getElementById('myAudio'); 

    // Lucide Icons initialization
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
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
            menuIcon.classList.toggle('open');
            menuPopup.classList.toggle('open');

            popupSound.currentTime = 0;
            popupSound.play().catch(error => {
                console.error("Popup sound play failed:", error);
            });
        });

        // Close popup if clicked anywhere outside content
        menuPopup.addEventListener('click', (event) => {
            if (event.target === menuPopup) {
                menuIcon.classList.remove('open');
                menuPopup.classList.remove('open');
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
                    menuIcon.classList.remove('open');
                    menuPopup.classList.remove('open');

                    if (popupSound) {
                        popupSound.currentTime = 0;
                        popupSound.play().catch(error => console.error("Popup link click sound play failed:", error));
                    }

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
            if (link !== menuIcon && link.closest('.equalizer') === null) {
                link.addEventListener('click', (event) => {
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
                            if (menuIcon && menuPopup) {
                                menuIcon.classList.remove('open');
                                menuPopup.classList.remove('open');
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
                setTimeout(typeEffect, isDeleting ? typingSpeed / 3 : typingSpeed);
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

}); // End of DOMContentLoaded