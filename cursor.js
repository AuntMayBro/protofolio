// window.addEventListener('scroll', () => {
//     const scrollPosition = window.pageYOffset;
//     const abstractBackground = document.querySelector('.abstract-background');
//     if (abstractBackground) {
//         abstractBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
//     }
// });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
