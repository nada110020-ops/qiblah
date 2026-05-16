/**
 * ENHANCED MAP PAGE - Leaflet.js with OpenStreetMap
 * Real map showing actual Kaaba location with all instructions
 */

let map;
let markers = {};
let userMarker = null;
let layerGroups = {};
let isMapLoaded = false;
let currentMapType = 'satellite';

// Kaaba coordinates
const KAABA_LOCATION = [21.4225, 39.8262];

// Important locations around the Haram
const HARAM_LOCATIONS = {
    kaaba: {
        position: [21.4225, 39.8262],
        name: 'الكعبة المشرفة',
        description: 'بيت الله الحرام، قبلة المسلمين في صلاتهم. الطواف يكون حولها 7 أشواط عكس عقارب الساعة.',
        type: 'sacred',
        layer: 'sacred-sites'
    },
    blackStone: {
        position: [21.4225, 39.8261],
        name: 'الحجر الأسود',
        description: 'حجر كريم من الجنة، يبدأ الطواف منه ويُستلم إن تيسر. يقع في الركن الشرقي للكعبة.',
        type: 'sacred',
        layer: 'sacred-sites'
    },
    maqam: {
        position: [21.4225, 39.8264],
        name: 'مقام إبراهيم',
        description: 'الحجر الذي قام عليه إبراهيم عليه السلام عند بناء الكعبة. يُستحب الصلاة خلفه ركعتين بعد الطواف.',
        type: 'sacred',
        layer: 'sacred-sites'
    },
    safa: {
        position: [21.4243, 39.8269],
        name: 'الصفا',
        description: 'أحد جبلي السعي، يبدأ السعي منه. يُستحب الوقوف عليه والدعاء مستقبلاً القبلة.',
        type: 'sacred',
        layer: 'sacred-sites'
    },
    marwa: {
        position: [21.4229, 39.8275],
        name: 'المروة',
        description: 'الجبل الثاني للسعي، ينتهي السعي عندها. الشوط السابع ينتهي بالمروة.',
        type: 'sacred',
        layer: 'sacred-sites'
    },
    zamzam: {
        position: [21.4225, 39.8265],
        name: 'بئر زمزم',
        description: 'البئر المباركة التي تفجرت تحت قدمي إسماعيل عليه السلام. ماءها شفاء وطعام طعم.',
        type: 'service',
        layer: 'services'
    },
    // Gates
    kingFahdGate: {
        position: [21.4239, 39.8264],
        name: 'بوابة الملك فهد',
        description: 'إحدى البوابات الرئيسية للمسجد الحرام، تقع في الجهة الشمالية.',
        type: 'gate',
        layer: 'gates'
    },
    umrahGate: {
        position: [21.4225, 39.8280],
        name: 'بوابة العمرة',
        description: 'بوابة مخصصة لدخول المعتمرين، مجهزة بخدمات خاصة.',
        type: 'gate',
        layer: 'gates'
    },
    salamGate: {
        position: [21.4211, 39.8264],
        name: 'بوابة السلام',
        description: 'إحدى البوابات التاريخية للمسجد الحرام، تتميز بتصميمها الأثري.',
        type: 'gate',
        layer: 'gates'
    },
    ibrahimGate: {
        position: [21.4225, 39.8244],
        name: 'بوابة إبراهيم',
        description: 'بوابة رئيسية تقع في الجهة الشمالية، سميت تيمناً بإبراهيم عليه السلام.',
        type: 'gate',
        layer: 'gates'
    },
    // Emergency points
    emergency1: {
        position: [21.4235, 39.8255],
        name: 'نقطة إسعاف 1',
        description: 'نقطة إسعاف أولي مجهزة للتعامل مع الحالات الطارئة. فريق طبي متواجد 24/7.',
        type: 'emergency',
        layer: 'emergency',
        phone: '997'
    },
    emergency2: {
        position: [21.4232, 39.8275],
        name: 'نقطة إسعاف 2',
        description: 'نقطة إسعاف أولي بالقرب من المسعى. مجهزة لعلاج حالات الإعياء والإجهاد.',
        type: 'emergency',
        layer: 'emergency',
        phone: '997'
    },
    emergency3: {
        position: [21.4218, 39.8275],
        name: 'نقطة إسعاف 3',
        description: 'نقطة إسعاف أولي في الجهة الشرقية. تشمل عيادة ومستوصف للحالات العاجلة.',
        type: 'emergency',
        layer: 'emergency',
        phone: '997'
    },
    emergency4: {
        position: [21.4215, 39.8250],
        name: 'نقطة إسعاف 4',
        description: 'نقطة إسعاف أولي في الجهة الجنوبية. فريق متخصص في إسعاف كبار السن.',
        type: 'emergency',
        layer: 'emergency',
        phone: '997'
    },
    // Services
    wuduArea1: {
        position: [21.4240, 39.8270],
        name: 'دورات مياه ووضوء 1',
        description: 'منطقة خدمات شاملة مع دورات مياه حديثة وأماكن الوضوء.',
        type: 'service',
        layer: 'services'
    },
    wuduArea2: {
        position: [21.4210, 39.8250],
        name: 'دورات مياه ووضوء 2',
        description: 'مرافق خدمية مع مناطق منفصلة للرجال والنساء.',
        type: 'service',
        layer: 'services'
    }
};

// Map tile layers
const MAP_LAYERS = {
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    },
    streets: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    },
    terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17
    }
};

/**
 * Initialize Leaflet Map
 */
document.addEventListener('DOMContentLoaded', () => {
    initLeafletMap();
    MapControls.init();
    LocationPanel.init();
    QiblaCompass.init();
    TimeAndWeather.init();
    
    // Show instructions after map loads
    setTimeout(() => {
        showInstructions();
    }, 2000);
});

function initLeafletMap() {
    // Initialize map centered on Kaaba
    map = L.map('leafletMap', {
        center: KAABA_LOCATION,
        zoom: 18,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: true
    });

    // Add custom zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Set initial layer
    setMapLayer('satellite');

    // Initialize layer groups
    layerGroups = {
        'sacred-sites': L.layerGroup().addTo(map),
        'gates': L.layerGroup().addTo(map),
        'emergency': L.layerGroup().addTo(map),
        'services': L.layerGroup().addTo(map),
        'directions': L.layerGroup()
    };

    // Create markers
    createCustomMarkers();
    
    // Mark as loaded
    document.querySelector('.leaflet-map-container').classList.add('loaded');
    isMapLoaded = true;

    // Map event listeners
    map.on('click', () => {
        LocationPanel.hide();
    });

    map.on('zoomend', () => {
        updateCompass();
    });
}

function setMapLayer(layerType) {
    // Remove existing tile layer
    map.eachLayer((layer) => {
        if (layer._url) {
            map.removeLayer(layer);
        }
    });

    // Add new tile layer
    const layerConfig = MAP_LAYERS[layerType];
    L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom,
        maxNativeZoom: layerConfig.maxZoom
    }).addTo(map);

    // Update map's maxZoom to match the layer
    map.setMaxZoom(layerConfig.maxZoom);

    currentMapType = layerType;
}

function createCustomMarkers() {
    Object.entries(HARAM_LOCATIONS).forEach(([key, location]) => {
        const icon = createCustomIcon(location.type, key === 'kaaba');
        
        const marker = L.marker(location.position, { icon })
            .bindPopup(createPopupContent(location), {
                className: 'custom-popup',
                direction: 'right',
                offset: [10, 0]
            });

        // Add click event
        marker.on('click', (e) => {
            e.originalEvent.stopPropagation();
            LocationPanel.show(key, location);
        });

        // Add to appropriate layer group
        const layerGroup = layerGroups[location.layer];
        if (layerGroup) {
            layerGroup.addLayer(marker);
        }

        markers[key] = marker;

        // Special animation for Kaaba
        if (key === 'kaaba') {
            // Add pulsing effect
            const pulseIcon = L.divIcon({
                className: 'kaaba-pulse',
                html: '<div class="pulse-ring"></div>',
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            });
            
            L.marker(location.position, { icon: pulseIcon })
                .addTo(layerGroups['sacred-sites']);
        }
    });

    // Add Tawaf direction circle
    createTawafDirection();
}

function createCustomIcon(type, isKaaba = false) {
    let html = '';
    let className = 'custom-marker';

    switch(type) {
        case 'sacred':
            if (isKaaba) {
                html = `
                    <div class="marker-kaaba">
                        <svg viewBox="0 0 40 40">
                            <rect x="8" y="8" width="24" height="24" fill="#1a4d2e" stroke="#D4AF37" stroke-width="3" rx="2"/>
                            <rect x="8" y="10" width="24" height="3" fill="#D4AF37"/>
                            <circle cx="30" cy="11.5" r="2" fill="#1a4d2e"/>
                        </svg>
                        <div class="marker-label">الكعبة</div>
                    </div>
                `;
                className = 'custom-marker kaaba-marker';
            } else {
                html = `
                    <div class="marker-sacred">
                        <svg viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="12" fill="#D4AF37" stroke="#1a4d2e" stroke-width="2"/>
                            <circle cx="16" cy="16" r="6" fill="#1a4d2e"/>
                        </svg>
                    </div>
                `;
            }
            break;
        case 'service':
            html = `
                <div class="marker-service">
                    <svg viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="12" fill="#4A90A4" stroke="#2E5C6E" stroke-width="2"/>
                        <path d="M12 12h8v8h-8z" fill="#ffffff"/>
                    </svg>
                </div>
            `;
            break;
        case 'gate':
            html = `
                <div class="marker-gate">
                    <svg viewBox="0 0 32 32">
                        <rect x="8" y="8" width="16" height="16" fill="#C41E3A" stroke="#ffffff" stroke-width="2" rx="2"/>
                    </svg>
                </div>
            `;
            break;
        case 'emergency':
            html = `
                <div class="marker-emergency">
                    <svg viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="12" fill="#C41E3A" stroke="#ffffff" stroke-width="2"/>
                        <path d="M12 16h8M16 12v8" stroke="#ffffff" stroke-width="3"/>
                    </svg>
                </div>
            `;
            break;
    }

    return L.divIcon({
        className: className,
        html: html,
        iconSize: isKaaba ? [40, 50] : [32, 32],
        iconAnchor: isKaaba ? [20, 50] : [16, 16],
        popupAnchor: [0, isKaaba ? -50 : -16]
    });
}

function createPopupContent(location) {
    let actions = '';
    if (location.type === 'emergency') {
        actions = `
            <div style="margin-top: 10px;">
                <a href="tel:${location.phone}" style="background: #C41E3A; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; display: inline-block;">
                    📞 اتصال ${location.phone}
                </a>
            </div>
        `;
    }

    return `
        <div style="font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; text-align: right; min-width: 200px;">
            <h4 style="color: #1a4d2e; margin: 0 0 8px 0; font-size: 16px;">${location.name}</h4>
            <p style="color: #666; margin: 0 0 8px 0; font-size: 13px; line-height: 1.5;">${location.description}</p>
            <small style="color: #999; font-size: 11px;">
                ${location.position[0].toFixed(6)}, ${location.position[1].toFixed(6)}
            </small>
            ${actions}
        </div>
    `;
}

function createTawafDirection() {
    // Create circle showing Tawaf direction around Kaaba
    const tawafCircle = L.circle(KAABA_LOCATION, {
        color: '#D4AF37',
        fillColor: 'transparent',
        fillOpacity: 0,
        radius: 50, // 50 meters radius
        weight: 3,
        dashArray: '10, 10',
        className: 'tawaf-circle'
    });

    // Add direction arrows
    const arrowPositions = [
        [21.42265, 39.82630], // North
        [21.42250, 39.82675], // East  
        [21.42235, 39.82630], // South
        [21.42250, 39.82605]  // West
    ];

    arrowPositions.forEach((pos, index) => {
        const arrow = L.divIcon({
            className: 'tawaf-arrow',
            html: '→',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const arrowMarker = L.marker(pos, { icon: arrow });
        layerGroups['directions'].addLayer(arrowMarker);
    });

    layerGroups['directions'].addLayer(tawafCircle);
}

// Instructions removed as per user request

/**
 * Enhanced Map Controls
 */
const MapControls = {
    init() {
        this.setupMapTypeControls();
        this.setupLayerControls();
        this.setupActionButtons();
    },

    setupMapTypeControls() {
        document.querySelectorAll('[data-map-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-map-type]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setMapLayer(btn.dataset.mapType);
            });
        });
    },

    setupLayerControls() {
        document.querySelectorAll('[data-layer]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.toggleLayer(checkbox.dataset.layer, checkbox.checked);
            });
        });
    },

    toggleLayer(layerName, show) {
        const layerGroup = layerGroups[layerName];
        if (layerGroup) {
            if (show) {
                map.addLayer(layerGroup);
            } else {
                map.removeLayer(layerGroup);
            }
        }
    },

    setupActionButtons() {
        document.getElementById('locateMe').addEventListener('click', () => {
            this.locateUser();
        });

        document.getElementById('centerKaaba').addEventListener('click', () => {
            this.centerOnKaaba();
        });
    },

    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = [position.coords.latitude, position.coords.longitude];

                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }

                    const userIcon = L.divIcon({
                        className: 'user-location-marker',
                        html: `
                            <div class="user-marker">
                                <div class="user-marker-inner"></div>
                                <div class="user-marker-pulse"></div>
                            </div>
                        `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });

                    userMarker = L.marker(userLocation, { icon: userIcon })
                        .addTo(map)
                        .bindPopup('موقعك الحالي', { offset: [0, -16] });

                    map.setView(userLocation, 16);

                    // Calculate distance to Kaaba
                    const distance = map.distance(userLocation, KAABA_LOCATION) / 1000; // Convert to km
                    const bearing = this.calculateBearing(userLocation, KAABA_LOCATION);
                    
                    // Update compass
                    updateCompass(bearing);

                    alert(`تم تحديد موقعك.\nالمسافة إلى الكعبة: ${distance.toFixed(2)} كم\nاتجاه القبلة: ${bearing.toFixed(1)}°`);
                },
                (error) => {
                    alert('تعذر تحديد موقعك. تأكد من تفعيل خدمات الموقع.');
                }
            );
        } else {
            alert('متصفحك لا يدعم تحديد الموقع.');
        }
    },

    centerOnKaaba() {
        map.setView(KAABA_LOCATION, 19, { animate: true, duration: 1.5 });
        
        // Animate Kaaba marker
        const kaabaMarker = markers.kaaba;
        if (kaabaMarker) {
            // Temporary bounce effect
            kaabaMarker.setOpacity(0.7);
            setTimeout(() => kaabaMarker.setOpacity(1), 500);
        }
    },

    calculateBearing(from, to) {
        const dLng = (to[1] - from[1]) * Math.PI / 180;
        const lat1 = from[0] * Math.PI / 180;
        const lat2 = to[0] * Math.PI / 180;
        
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    }
};

/**
 * Enhanced Location Panel
 */
const LocationPanel = {
    init() {
        this.panel = document.getElementById('locationPanel');
        this.content = document.getElementById('panelContent');
        this.closeBtn = document.getElementById('panelClose');
        this.setupCloseListener();
    },

    show(pointId, data) {
        if (!data) return;

        let actions = '';
        if (data.type === 'emergency') {
            actions = `
                <div class="panel-actions">
                    <a href="tel:${data.phone}" class="btn-action emergency">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        اتصال ${data.phone}
                    </a>
                </div>
            `;
        }

        this.content.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            <div class="location-coordinates">
                <small>الإحداثيات: ${data.position[0].toFixed(6)}, ${data.position[1].toFixed(6)}</small>
            </div>
            ${actions}
        `;

        this.panel.classList.add('active');
    },

    hide() {
        this.panel.classList.remove('active');
    },

    setupCloseListener() {
        this.closeBtn.addEventListener('click', () => {
            this.hide();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.panel.classList.contains('active') && 
                !this.panel.contains(e.target) && 
                !e.target.closest('.leaflet-marker-icon')) {
                this.hide();
            }
        });
    }
};

/**
 * Qibla Compass
 */
const QiblaCompass = {
    init() {
        this.compassElement = document.getElementById('qiblaCompass');
        this.arrowElement = document.getElementById('qiblaArrow');
        updateCompass();
    }
};

function updateCompass(bearing = 0) {
    const arrowElement = document.getElementById('qiblaArrow');
    if (arrowElement) {
        arrowElement.style.transform = `rotate(${bearing}deg)`;
    }
}

/**
 * Time and Weather Information
 */
const TimeAndWeather = {
    init() {
        this.updateMeccaTime();
        this.updateInfo();
        
        // Update time every minute
        setInterval(() => this.updateMeccaTime(), 60000);
        
        // Update info every 30 minutes
        setInterval(() => this.updateInfo(), 30 * 60000);
    },

    updateMeccaTime() {
        const meccaTime = new Date().toLocaleString('ar-SA', {
            timeZone: 'Asia/Riyadh',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const timeElement = document.getElementById('meccaTime');
        if (timeElement) {
            timeElement.textContent = meccaTime;
        }
    },

    updateInfo() {
        const weatherStates = ['مشمس ☀️', 'جيد 🌤️', 'دافئ 🌡️', 'معتدل 🌿'];
        const crowdLevels = ['قليل 🟢', 'متوسط 🟡', 'مزدحم 🟠', 'مزدحم جداً 🔴'];
        
        const weatherElement = document.getElementById('weatherInfo');
        const crowdElement = document.getElementById('crowdLevel');
        
        if (weatherElement) {
            weatherElement.innerHTML = weatherStates[Math.floor(Math.random() * weatherStates.length)];
        }
        
        if (crowdElement) {
            crowdElement.innerHTML = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
        }
    }
};