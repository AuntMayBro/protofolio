document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

fetch('icons.svg')
  .then(res => res.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.insertBefore(div, document.body.firstChild);
  });

const projectCardsWrapper = document.querySelector('.project-cards-wrapper');

if (projectCardsWrapper) {
  projectCardsWrapper.addEventListener('wheel', (event) => {
    event.preventDefault();
    projectCardsWrapper.scrollLeft += event.deltaY;
  });
} else {
  console.error("Error: '.project-cards-wrapper' element not found. Horizontal scrolling will not work.");
}


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
const element = document.getElementById("typewriter-text");

function typeEffect() {
  const currentText = texts[index];

  if (isDeleting) {
    charIndex--;
    element.textContent = currentText.substring(0, charIndex);
  } else {
    charIndex++;
    element.textContent = currentText.substring(0, charIndex);
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

document.addEventListener("DOMContentLoaded", typeEffect);

const cards = document.querySelectorAll('.project-card');
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
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

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


const myAudio = document.getElementById('myAudio');
const equalizer = document.querySelector('.equalizer');

equalizer.addEventListener('click', () => {
  if (myAudio.paused) {
    myAudio.play()
      .then(() => {
        equalizer.classList.add('playing');
      })
      .catch(error => {
        console.error("Autoplay failed:", error);
        alert("Autoplay prevented by browser. Please allow sound.");
      });
  } else {
    myAudio.pause();
    equalizer.classList.remove('playing');
  }
});