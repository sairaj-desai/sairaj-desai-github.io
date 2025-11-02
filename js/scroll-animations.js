// Smooth Scroll-Based Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        this.lastScrollY = window.scrollY || 0;
        this.scrollDirection = 'down';
        
        this.init();
    }

    init() {
        // Track scroll direction
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY || 0;
            this.scrollDirection = currentY < this.lastScrollY ? 'up' : 'down';
            this.lastScrollY = currentY;
        }, { passive: true });

        // Create intersection observer with enter/exit handling
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const isProject = el.classList.contains('project-item') || el.classList.contains('card') || el.classList.contains('scroll-animate-scale');
                if (entry.isIntersecting) {
                    el.classList.remove('animate-out-up', 'animate-out-down');
                    el.classList.add('animate-in');

                    // Progressive stagger on enter for project items
                    if (isProject) {
                        const ordered = Array.from(document.querySelectorAll('.project-item, .card'));
                        const idx = ordered.indexOf(el);
                        el.style.transitionDelay = `${Math.max(0, idx) * 0.08}s`;
                    }
                } else {
                    // Smooth fade-out with direction-aware transform
                    el.classList.remove('animate-in');
                    if (isProject) {
                        const ordered = Array.from(document.querySelectorAll('.project-item, .card'));
                        const idx = ordered.indexOf(el);
                        const total = ordered.length;
                        const delay = this.scrollDirection === 'up' ? (total - idx - 1) * 0.06 : idx * 0.06;
                        el.style.transitionDelay = `${Math.max(0, delay)}s`;
                        const outClass = this.scrollDirection === 'up' ? 'animate-out-up' : 'animate-out-down';
                        el.classList.remove('animate-out-up', 'animate-out-down');
                        el.classList.add(outClass);
                    }
                }
            });
        }, this.observerOptions);

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Auto-detect and animate common elements
        this.autoDetectElements();
        
        // Observe all animation elements
        this.observeElements();
    }

    autoDetectElements() {
        // Add animation classes to common elements if they don't already have them
        const selectors = [
            'section:not(.banner)',
            '.project-item',
            '.card',
            '.about-text',
            '.about-description',
            'h1:not(.banner h1)',
            'h2',
            'h3',
            '.project-text',
            '.project-info',
            '.author',
            '.spline-viewer',
            'nav.menu'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Skip if already has animation class
                if (element.classList.contains('scroll-animate') || 
                    element.classList.contains('scroll-animate-left') ||
                    element.classList.contains('scroll-animate-right') ||
                    element.classList.contains('scroll-animate-scale') ||
                    element.classList.contains('scroll-animate-fade')) {
                    return;
                }

                // Add appropriate animation class based on element type
                if (selector.includes('nav')) {
                    element.classList.add('scroll-animate-fade');
                } else if (selector.includes('project-item') || selector.includes('card')) {
                    element.classList.add('scroll-animate-scale');
                } else if (index % 2 === 0) {
                    element.classList.add('scroll-animate-left');
                } else {
                    element.classList.add('scroll-animate-right');
                }
            });
        });

        // Special handling for project grid/list items: set initial stagger by order
        const projectItems = document.querySelectorAll('.project-item, .card');
        projectItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.08}s`;
        });
    }

    observeElements() {
        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll(`
            .scroll-animate,
            .scroll-animate-left,
            .scroll-animate-right,
            .scroll-animate-scale,
            .scroll-animate-fade
        `);

        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    // Method to manually add animation to specific elements
    addAnimation(element, animationType = 'scroll-animate') {
        if (element) {
            element.classList.add(animationType);
            this.observer.observe(element);
        }
    }

    // Method to trigger animations immediately (useful for dynamic content)
    triggerAnimation(element) {
        if (element) {
            element.classList.add('animate-in');
        }
    }
}

// Initialize scroll animations when script loads
const scrollAnimations = new ScrollAnimations();

// Export for use in other scripts
window.ScrollAnimations = ScrollAnimations;
window.scrollAnimations = scrollAnimations;