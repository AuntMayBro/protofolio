document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. Navbar & Menu Related Functionality
    // =====================================

    // Lucide Icons initialization
    // Important to run early if icons are visible on initial load.
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn("Lucide library not found or not initialized. Lucide icons may not render.");
    }

    // Fetching icons.svg (for SVG sprite injection, assuming it contains #icon-logo)
    // This should ideally happen before elements using these icons are rendered.
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
            // Insert at the beginning of the body so icons are available
            document.body.insertBefore(div, document.body.firstChild);
        })
        .catch(error => {
            console.error("Error fetching icons.svg:", error);
        });

    // Audio Player (for the equalizer icon in the navbar)
    const myAudio = document.getElementById('myAudio');
    const equalizer = document.querySelector('.equalizer'); // Assuming this is the SVG element

    if (myAudio && equalizer) {
        equalizer.addEventListener('click', () => {
            if (myAudio.paused) {
                myAudio.play()
                    .then(() => {
                        equalizer.classList.add('playing');
                    })
                    .catch(error => {
                        // This catch block handles cases where autoplay is prevented (e.g., by browser policy)
                        console.error("Autoplay failed:", error);
                        // You might want to show a message to the user here
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
    const popupSound = document.getElementById('popupSound'); // The sound for opening/closing popup

    // Get all navigation links within the popup
    const popupNavLinks = menuPopup ? menuPopup.querySelectorAll('ul li a') : [];

    if (menuIcon && menuPopup && popupSound) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('open'); // Toggles hamburger animation
            menuPopup.classList.toggle('open'); // Toggles popup visibility

            // Play sound only if popup is opening
            if (menuPopup.classList.contains('open')) {
                popupSound.currentTime = 0; // Rewind to start
                popupSound.play().catch(error => {
                    console.error("Popup sound play failed:", error);
                });
            } else {
                // If closing, ensure sound is stopped and reset
                popupSound.pause();
                popupSound.currentTime = 0;
            }
        });

        // Close popup if clicked anywhere outside content
        menuPopup.addEventListener('click', (event) => {
            if (event.target === menuPopup) { // Check if the click was directly on the overlay
                menuIcon.classList.remove('open'); // Close hamburger animation
                menuPopup.classList.remove('open'); // Hide popup
                if (popupSound) { // Ensure sound stops if closing via outside click
                    popupSound.pause();
                    popupSound.currentTime = 0;
                }
            }
        });
    } else {
        console.error("Error: One or more menu elements not found (#menuIcon, #menuPopup, or #popupSound). Menu and popup functionality will not work.");
    }

    // Smooth scroll for popup navigation links
    // This also closes the popup after navigation
    if (popupNavLinks.length > 0 && menuIcon && menuPopup && popupSound) {
        popupNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default jump behavior

                const targetId = link.getAttribute('href'); // Get the #id from the href (e.g., '#skills-section')
                const targetSection = document.querySelector(targetId); // Find the actual section element

                if (targetSection) {
                    // Close the popup and reset hamburger icon state
                    menuIcon.classList.remove('open');
                    menuPopup.classList.remove('open');
                    if (popupSound) { // Ensure sound stops when a navigation link is clicked
                        popupSound.pause();
                        popupSound.currentTime = 0;
                    }

                    // Scroll smoothly to the target section
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`Target section not found for link: ${targetId}`);
                }
            });
        });
    } else {
        console.warn("No popup navigation links found or necessary elements missing for smooth scrolling.");
    }


    // ============================
    // 2. Hero Section Functionality
    // ============================

    // Typewriter Effect (within the hero section)
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
    const typewriterElement = document.getElementById("typewriter-text"); // Renamed 'element' for clarity

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
                index = (index + 1) % texts.length; // Move to the next text in the array
                setTimeout(typeEffect, typingSpeed);
            } else {
                // Adjust typing speed for deleting vs typing
                setTimeout(typeEffect, isDeleting ? typingSpeed / 2 : typingSpeed);
            }
        }
        typeEffect(); // Start the typewriter effect
    } else {
        console.warn("Element with ID 'typewriter-text' not found. Typewriter effect will not work.");
    }


    // ===============================
    // 3. Projects Section Functionality
    // ===============================

    // Project Cards Wrapper - Horizontal Scrolling (if the section allows it)
    // This was already present, just re-sequenced.
    // Ensure the .project-cards-wrapper is the direct parent for horizontal scrolling.
    // If it's a child of .my-projects-container, this still works.
    // No changes to logic, just location in the file.

    // Project Cards Hover Effect (3D effect)
    const cards = document.querySelectorAll('.project-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            let bounds; // To store the card's dimensions and position

            function rotateToMouse(e) {
                // Calculate mouse position relative to the card
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftX = mouseX - bounds.left;
                const topY = mouseY - bounds.top;

                // Calculate center point for rotation
                const center = {
                    x: leftX - bounds.width / 2,
                    y: topY - bounds.height / 2
                };

                // Determine rotation angles, clamping values to prevent extreme rotations
                const rotateX = Math.max(-15, Math.min(15, center.y / 10));
                const rotateY = Math.max(-15, Math.min(15, -center.x / 10));

                // Apply the 3D transform
                card.style.transform = `
                    perspective(1000px)
                    scale3d(1.05, 1.05, 1.05)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

                // Update glow effect position
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
                bounds = card.getBoundingClientRect(); // Get fresh bounds on mouse enter
                document.addEventListener('mousemove', rotateToMouse); // Start tracking mouse movement
            });

            card.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', rotateToMouse); // Stop tracking
                card.style.transform = ''; // Reset card transform
                const glow = card.querySelector('.glow'); // Reset glow background
                if (glow) glow.style.backgroundImage = '';
            });
        });
    } else {
        console.warn("No elements with class '.project-card' found. Card hover effects will not work.");
    }


    // ===============================
    // 4. Contact Section Functionality
    // ===============================
    // (Add any specific JS for the contact form here if needed, e.g., form validation)
    // No explicit JS for contact form in previous examples, so nothing new added here.

}); // End of DOMContentLoaded