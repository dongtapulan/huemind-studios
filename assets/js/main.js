/**
 * HUEMIND STUDIOS - Core Interface Controller (Vanilla JS)
 * Handles global interactions, async components, menu states, and formal page routing indicators.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Global UI Component Icons for static on-page items
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Load Modular Global Components Asynchronously
    // Replaces static containers with code from /components folder, then hooks up specific logic
    loadComponent("global-header", "components/header.html", () => {
        highlightActiveNavigation();
        initMobileMenu();
    });
    
    loadComponent("global-footer", "components/footer.html");

    // 3. Scroll Header Logic (Adds background depth on scroll)
    initScrollHeader();

    // 4. Scroll Reveal Interactions
    initScrollReveal();
});

/**
 * Clean Async Fetch Engine to inject components dynamically
 */
function loadComponent(elementId, filepath, callback) {
    const target = document.getElementById(elementId);
    if (!target) return;

    fetch(filepath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load component: ${filepath}`);
            return response.text();
        })
        .then(htmlContent => {
            target.innerHTML = htmlContent;
            // Force Lucide engine to parse the freshly injected markup for icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
            if (callback) callback();
        })
        .catch(err => console.error("Component Loader Error:", err));
}

/**
 * Ensures the navigation bar matches the exact file context dynamically
 */
function highlightActiveNavigation() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    // Scopes lookups explicitly inside desktop and mobile components to protect flexibility
    const navLinks = document.querySelectorAll("#desktop-nav-links a, #mobile-nav-links a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath) {
            const isMobile = link.closest("#mobile-nav-links");

            if (isMobile) {
                // Precise Mobile Highlighting
                link.className = "block text-blue-600 font-semibold";
            } else {
                // Premium Desktop Highlighting with color indicators
                link.className = "relative group py-2 text-black font-semibold transition border-b-2 pb-1";
                
                if (currentPath.includes("labs")) {
                    link.classList.add("border-blue-600");
                } else if (currentPath.includes("publications")) {
                    link.classList.add("border-purple-500");
                } else if (currentPath.includes("services")) {
                    link.classList.add("border-amber-500");
                } else {
                    link.classList.add("border-blue-500");
                }
            }
        }
    });
}

/**
 * Gives navigation bar backdrop weight only when user scrolls down
 */
function initScrollHeader() {
    // Looks for the target element inside the injected global-header wrapper
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector("#global-header nav");
        if (!navbar) return;

        if (window.scrollY > 20) {
            navbar.classList.add("shadow-sm", "bg-white/95");
            navbar.classList.remove("bg-white");
        } else {
            navbar.classList.remove("shadow-sm", "bg-white/95");
            navbar.classList.add("bg-white");
        }
    });
}

/**
 * Installs listener onto the menu button after the header completely loads
 */
function initMobileMenu() {
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", toggleMobileMenu);
    }
}

/**
 * Multi-device Mobile Menu Mechanics
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (!mobileMenu || !menuIcon) return;

    mobileMenu.classList.toggle('hidden');
    
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (window.lucide) {
        menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        window.lucide.createIcons();
    }
}

/**
 * Modern observer that subtly fades cards in cleanly as you scroll to them
 */
function initScrollReveal() {
    const targetCards = document.querySelectorAll(".interactive-card, main section, h2");
    
    const observerOptions = {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-on-load");
                entry.target.style.opacity = "1";
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, observerOptions);

    targetCards.forEach(card => {
        card.style.opacity = "0"; // Set starting opacity for smooth override
        card.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        revealObserver.observe(card);
    });
}