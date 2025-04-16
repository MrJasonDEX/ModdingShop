function navbar() {
    const element = document.getElementById("navbarNav");
    element.classList.toggle("navbar__nav--active");
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            element.classList.remove('navbar__nav--active');
        }
    });
}

function closeMenu() {
    const menu = document.getElementById("navbarNav");
    menu.classList.remove("navbar__nav--active");
}

document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.section__navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
});

// Handle active states
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar__link');
    const currentPath = window.location.pathname;
    const hash = window.location.hash;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href.startsWith('#') && href === hash)) {
            link.classList.add('active');
        }
    });

    // Handle smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Handle mobile menu closing on link click
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});