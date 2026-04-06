// Function to handle scroll reveal animations
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    var rightReveals = document.querySelectorAll(".reveal-right");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
    for (var j = 0; j < rightReveals.length; j++) {
        var windowHeight = window.innerHeight;
        var elementTop = rightReveals[j].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            rightReveals[j].classList.add("active");
        }
    }
}
// Trigger initial reveal and bind to scroll
window.addEventListener("scroll", reveal);
reveal(); // To check elements visible on load
// Mobile Nav Toggle (Optional basic toggle for visual completeness)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    // A simple toggle inline style for demonstration
    if(navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.background = 'transparent';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--glass-bg)';
        navLinks.style.backdropFilter = 'blur(16px)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderRadius = '24px';
        navLinks.style.boxShadow = 'var(--glass-shadow)';
        navLinks.style.width = '200px';
        navLinks.style.alignItems = 'center';
    }
});