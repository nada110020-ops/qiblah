/**
 * QIBLAH - Interactive Tawaf & Sa'i Guide
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    LoadingScreen.init();
    Header.init();
    Navigation.init();
    StatsCounter.init();
    UserLevel.init();
    PrayerTimes.init();
    EmergencyModal.init();
    Chatbot.init();
    Animations.init();
});

/**
 * Loading Screen Module
 */
const LoadingScreen = {
    init() {
        this.screen = document.getElementById('loading-screen');
        setTimeout(() => {
            this.screen.classList.add('hidden');
            setTimeout(() => {
                this.screen.style.display = 'none';
            }, 500);
        }, 2000);
    }
};

/**
 * Header Module
 */
const Header = {
    init() {
        this.header = document.querySelector('.main-header');
        this.setupScrollListener();
    },
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        this.toggle = document.querySelector('.nav-toggle');
        this.navList = document.querySelector('.nav-list');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.setupToggle();
        this.setupActiveLink();
    },
    
    setupToggle() {
        this.toggle.addEventListener('click', () => {
            this.toggle.classList.toggle('active');
            this.navList.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggle.classList.remove('active');
                this.navList.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.navList.contains(e.target)) {
                this.toggle.classList.remove('active');
                this.navList.classList.remove('active');
            }
        });
    },
    
    setupActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
};

/**
 * Stats Counter Animation Module
 */
const StatsCounter = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.setupObserver();
    },
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
};

/**
 * User Level Selection Module
 */
const UserLevel = {
    init() {
        this.cards = document.querySelectorAll('.level-card');
        this.setupSelection();
        this.loadSavedLevel();
    },
    
    setupSelection() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.saveLevel(card.getAttribute('data-level'));
            });
        });
    },
    
    saveLevel(level) {
        localStorage.setItem('qiblah-user-level', level);
    },
    
    loadSavedLevel() {
        const savedLevel = localStorage.getItem('qiblah-user-level');
        if (savedLevel) {
            const card = document.querySelector(`[data-level="${savedLevel}"]`);
            if (card) {
                this.cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        }
    }
};

/**
 * Prayer Times Module
 */
const PrayerTimes = {
    init() {
        this.container = document.getElementById('prayerTimes');
        this.dateElement = document.getElementById('prayerDate');
        this.nextPrayerName = document.getElementById('nextPrayerName');
        this.nextPrayerTime = document.getElementById('nextPrayerTime');
        this.setupPrayerTimes();
        this.updateDate();
    },
    
    setupPrayerTimes() {
        // Makkah prayer times (approximate for demonstration)
        const prayers = [
            { name: 'الفجر', time: '05:24' },
            { name: 'الظهر', time: '12:31' },
            { name: 'العصر', time: '15:52' },
            { name: 'المغرب', time: '18:23' },
            { name: 'العشاء', time: '19:53' }
        ];
        
        this.container.innerHTML = prayers.map(prayer => `
            <div class="prayer-time-item">
                <div class="prayer-name">${prayer.name}</div>
                <div class="prayer-time">${prayer.time}</div>
            </div>
        `).join('');
        
        this.findNextPrayer(prayers);
    },
    
    findNextPrayer(prayers) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        for (const prayer of prayers) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = hours * 60 + minutes;
            
            if (prayerTime > currentTime) {
                this.nextPrayerName.textContent = prayer.name;
                this.nextPrayerTime.textContent = prayer.time;
                return;
            }
        }
        
        // If all prayers passed, next is Fajr
        this.nextPrayerName.textContent = 'الفجر';
        this.nextPrayerTime.textContent = '05:24';
    },
    
    updateDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const date = new Date().toLocaleDateString('ar-SA', options);
        this.dateElement.textContent = date;
    }
};

/**
 * Emergency Modal Module
 */
const EmergencyModal = {
    init() {
        this.modal = document.getElementById('emergencyModal');
        this.triggerBtn = document.getElementById('emergencyBtn');
        this.closeBtn = document.getElementById('emergencyModalClose');
        this.options = document.querySelectorAll('.emergency-option');
        this.setupListeners();
    },
    
    setupListeners() {
        this.triggerBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        this.options.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.getAttribute('data-type');
                this.handleEmergency(type);
            });
        });
        
        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    handleEmergency(type) {
        switch(type) {
            case 'lost':
                this.handleLost();
                break;
            case 'tired':
                this.handleTired();
                break;
            case 'medical':
                this.handleMedical();
                break;
        }
    },
    
    handleLost() {
        // Get user location
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    alert(`تم تحديد موقعك:\n${lat.toFixed(4)}, ${lng.toFixed(4)}\n\nأقرب نقطة مساعدة: بوابة الملك فهد (500م)`);
                    this.close();
                },
                (error) => {
                    alert('تعذر تحديد الموقع. يرجى التوجه إلى أقرب نقطة مساعدة أو طلب المساعدة من المتطوعين.');
                    this.close();
                }
            );
        } else {
            alert('يرجى التوجه إلى أقرب نقطة مساعدة أو طلب المساعدة من المتطوعين.');
            this.close();
        }
    },
    
    handleTired() {
        alert('نصائح للراحة:\n\n1. توجه إلى منطقة مكيفة قريبة\n2. اشرب ماء زمزم المتوفر في جميع الأروقة\n3. خذ قسطاً من الراحة\n4. استمر عندما تشعر بالتحسن\n\nتذكر: الله لا يكلف نفساً إلا وسعها');
        this.close();
    },
    
    handleMedical() {
        const confirmed = confirm('هل تريد الاتصال بالطوارئ الطبية؟\n\nرقم الهلال الأحمر: 997');
        if (confirmed) {
            window.location.href = 'tel:997';
        }
        this.close();
    }
};

/**
 * Chatbot Module
 */
const Chatbot = {
    init() {
        this.modal = document.getElementById('chatbotModal');
        this.triggerBtn = document.getElementById('chatbotTrigger');
        this.closeBtn = document.getElementById('chatbotModalClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.suggestions = document.querySelectorAll('.suggestion');
        this.setupListeners();
    },
    
    setupListeners() {
        this.triggerBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.suggestions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.input.value = btn.getAttribute('data-question');
                this.sendMessage();
            });
        });
        
        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.input.focus();
    },
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        // Add a temporary loading message
        const loadingEl = this.addMessage('...', 'bot');
        loadingEl.classList.add('loading');

        try {
            const res = await fetch('chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            loadingEl.remove();
            
            this.addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error fetching bot response:', error);
            if(loadingEl && loadingEl.querySelector('p')) {
                loadingEl.querySelector('p').textContent = `عذراً، حدث خطأ: ${error.message}`;
            }
        }
    },
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <small>${this.getTime()}</small>
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return messageDiv;
    },
    
    getTime() {
        const now = new Date();
        return now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    },
};

/**
 * Animations Module
 */
const Animations = {
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    },
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.service-card, .stat-card, .level-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
        
        // Add animate-in styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupHoverEffects() {
        // Add subtle parallax to hero visual
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                heroVisual.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    }
};

/**
 * Language Toggle (Placeholder for future implementation)
 */
const LanguageToggle = {
    init() {
        this.btn = document.getElementById('langToggle');
        this.currentLang = 'ar';
        this.setupToggle();
    },
    
    setupToggle() {
        this.btn.addEventListener('click', () => {
            this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
            this.btn.querySelector('span').textContent = this.currentLang.toUpperCase();
            // Full language switching would be implemented here
            alert('خاصية تغيير اللغة قيد التطوير');
        });
    }
};

// Initialize language toggle
LanguageToggle.init();