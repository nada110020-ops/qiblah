/**
 * SAI PAGE - Counter and Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    SaiCounter.init();
});

/**
 * Sai Counter Module
 */
const SaiCounter = {
    currentShawt: 0,
    maxShawt: 7,
    
    init() {
        this.currentShawtEl = document.getElementById('currentShawt');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressDots = document.getElementById('progressDots');
        this.counterStatus = document.getElementById('counterStatus');
        this.increaseBtn = document.getElementById('increaseBtn');
        this.decreaseBtn = document.getElementById('decreaseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.loadSavedCount();
        this.createDots();
        this.updateDisplay();
        this.setupListeners();
    },
    
    loadSavedCount() {
        const saved = localStorage.getItem('qiblah-sai-count');
        if (saved) {
            this.currentShawt = parseInt(saved);
        }
    },
    
    saveCount() {
        localStorage.setItem('qiblah-sai-count', this.currentShawt.toString());
    },
    
    createDots() {
        this.progressDots.innerHTML = '';
        for (let i = 1; i <= this.maxShawt; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.setAttribute('data-shawt', i);
            this.progressDots.appendChild(dot);
        }
    },
    
    updateDisplay() {
        // Update number
        this.currentShawtEl.textContent = this.currentShawt;
        
        // Update progress bar
        const percentage = (this.currentShawt / this.maxShawt) * 100;
        this.progressFill.style.width = `${percentage}%`;
        
        // Update dots
        const dots = this.progressDots.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < this.currentShawt) {
                dot.classList.add('completed');
            } else if (index === this.currentShawt) {
                dot.classList.add('active');
            }
        });
        
        // Update status message
        this.updateStatus();
        
        // Save to localStorage
        this.saveCount();
        
        // Trigger animation
        this.currentShawtEl.classList.add('bump');
        setTimeout(() => {
            this.currentShawtEl.classList.remove('bump');
        }, 300);
    },
    
    updateStatus() {
        const messages = [
            { icon: '⛰️', text: 'ابدأ السعي من الصفا' },
            { icon: '1️⃣', text: 'الشوط الأول: من الصفا إلى المروة' },
            { icon: '2️⃣', text: 'الشوط الثاني: من المروة إلى الصفا' },
            { icon: '3️⃣', text: 'الشوط الثالث: من الصفا إلى المروة' },
            { icon: '4️⃣', text: 'الشوط الرابع: من المروة إلى الصفا' },
            { icon: '5️⃣', text: 'الشوط الخامس: من الصفا إلى المروة' },
            { icon: '6️⃣', text: 'الشوط السادس: من المروة إلى الصفا' },
            { icon: '7️⃣', text: 'الشوط السابع: من الصفا إلى المروة. اكتمل السعي!' },
            { icon: '✅', text: 'أكملت السعي! تقبل الله منك' }
        ];
        
        const statusIndex = Math.min(this.currentShawt + 1, messages.length - 1);
        this.counterStatus.innerHTML = `
            <span class="status-icon">${messages[statusIndex].icon}</span>
            <span class="status-text">${messages[statusIndex].text}</span>
        `;
        
        // Vibration feedback when completing a shawt
        if (this.currentShawt > 0 && navigator.vibrate) {
            navigator.vibrate(100);
        }
    },
    
    increase() {
        if (this.currentShawt < this.maxShawt) {
            this.currentShawt++;
            this.updateDisplay();
        }
    },
    
    decrease() {
        if (this.currentShawt > 0) {
            this.currentShawt--;
            this.updateDisplay();
        }
    },
    
    reset() {
        if (confirm('هل تريد إعادة تعيين العداد؟')) {
            this.currentShawt = 0;
            this.updateDisplay();
        }
    },
    
    setupListeners() {
        this.increaseBtn.addEventListener('click', () => this.increase());
        this.decreaseBtn.addEventListener('click', () => this.decrease());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === '+' || e.key === '=') {
                this.increase();
            } else if (e.key === 'ArrowDown' || e.key === '-') {
                this.decrease();
            } else if (e.key === 'r' || e.key === 'R') {
                this.reset();
            }
        });
    }
};