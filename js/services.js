/**
 * SERVICES PAGE - Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    FAQ.init();
});

/**
 * FAQ Module
 */
const FAQ = {
    init() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.setupAccordion();
    },
    
    setupAccordion() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                this.faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
};