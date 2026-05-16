/**
 * DUAS PAGE - Library and Tasbih Counter
 */

document.addEventListener('DOMContentLoaded', () => {
    DuasLibrary.init();
    TasbihCounter.init();
});

/**
 * Duas Library Module
 */
const DuasLibrary = {
    init() {
        this.searchInput = document.getElementById('searchInput');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.duaCards = document.querySelectorAll('.dua-card');
        this.copyButtons = document.querySelectorAll('.btn-copy');
        this.favoriteButtons = document.querySelectorAll('.dua-favorite');
        
        this.setupSearch();
        this.setupFilters();
        this.setupCopy();
        this.setupFavorites();
    },
    
    setupSearch() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            this.duaCards.forEach(card => {
                const arabic = card.querySelector('.dua-arabic').textContent.toLowerCase();
                const translation = card.querySelector('.dua-translation').textContent.toLowerCase();
                
                if (arabic.includes(query) || translation.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    },
    
    setupFilters() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const filter = tab.getAttribute('data-filter');
                
                this.duaCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    },
    
    setupCopy() {
        this.copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const text = btn.getAttribute('data-text');
                
                try {
                    await navigator.clipboard.writeText(text);
                    btn.classList.add('copied');
                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <span>تم النسخ</span>
                    `;
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                            <span>نسخ</span>
                        `;
                    }, 2000);
                } catch (err) {
                    alert('تعذر نسخ النص، يرجى نسخه يدوياً');
                }
            });
        });
    },
    
    setupFavorites() {
        this.favoriteButtons.forEach(btn => {
            // Load saved favorites
            const duaText = btn.closest('.dua-card').querySelector('.dua-arabic').textContent;
            const favorites = JSON.parse(localStorage.getItem('qiblah-favorites') || '[]');
            
            if (favorites.includes(duaText)) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.saveFavorites();
            });
        });
    },
    
    saveFavorites() {
        const favorites = [];
        this.favoriteButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                const duaText = btn.closest('.dua-card').querySelector('.dua-arabic').textContent;
                favorites.push(duaText);
            }
        });
        
        localStorage.setItem('qiblah-favorites', JSON.stringify(favorites));
    }
};

/**
 * Tasbih Counter Module
 */
const TasbihCounter = {
    count: 0,
    target: 33,
    
    init() {
        this.countEl = document.getElementById('tasbihCount');
        this.tasbihBtn = document.getElementById('tasbihBtn');
        this.resetBtn = document.getElementById('tasbihReset');
        this.presetBtns = document.querySelectorAll('.preset-btn');
        
        this.loadSavedCount();
        this.setupListeners();
    },
    
    loadSavedCount() {
        const saved = localStorage.getItem('qiblah-tasbih-count');
        const savedTarget = localStorage.getItem('qiblah-tasbih-target');
        
        if (saved) {
            this.count = parseInt(saved);
            this.countEl.textContent = this.count;
        }
        
        if (savedTarget) {
            this.target = parseInt(savedTarget);
            this.presetBtns.forEach(btn => {
                if (parseInt(btn.getAttribute('data-count')) === this.target) {
                    btn.classList.add('active');
                }
            });
        }
    },
    
    saveCount() {
        localStorage.setItem('qiblah-tasbih-count', this.count.toString());
    },
    
    increment() {
        this.count++;
        this.countEl.textContent = this.count;
        this.countEl.classList.add('bump');
        
        setTimeout(() => {
            this.countEl.classList.remove('bump');
        }, 150);
        
        // Vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Check if reached target
        if (this.target > 0 && this.count >= this.target) {
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            setTimeout(() => {
                if (confirm(`أتممت ${this.target} تسبيحة! هل تريد إعادة العد؟`)) {
                    this.reset();
                }
            }, 300);
        }
        
        this.saveCount();
    },
    
    reset() {
        this.count = 0;
        this.countEl.textContent = this.count;
        this.saveCount();
    },
    
    setTarget(target) {
        this.target = target;
        localStorage.setItem('qiblah-tasbih-target', target.toString());
        
        this.presetBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.getAttribute('data-count')) === target);
        });
    },
    
    setupListeners() {
        this.tasbihBtn.addEventListener('click', () => this.increment());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = parseInt(btn.getAttribute('data-count'));
                this.setTarget(target);
            });
        });
        
        // Keyboard shortcut (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.increment();
            }
        });
    }
};