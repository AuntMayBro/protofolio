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


// project card Function
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


document.addEventListener('DOMContentLoaded', () => {

  const musicButtonContainer = document.getElementById('music-btn');
  const myAudio = document.getElementById('myAudio');
  let isRotated = false;

  musicButtonContainer.addEventListener('click', function() {
      if (isRotated) {
          this.classList.remove('rotate');
          this.style.transform = 'rotate(0deg)';
      } else {
          this.classList.add('rotate');
      }
      isRotated = !isRotated;
  });

  musicButtonContainer.addEventListener('click', () => {
      if (myAudio.paused) {
          myAudio.play()
              .then(() => {
                  console.log("Music started playing!");
              })
              .catch(error => {
                  console.error("Error playing audio:", error);
                  alert("Autoplay was prevented by the browser. Please click again if music doesn't start.");
              });
      } else {
          myAudio.pause();
          console.log("Music paused!");
      }
  });
});
