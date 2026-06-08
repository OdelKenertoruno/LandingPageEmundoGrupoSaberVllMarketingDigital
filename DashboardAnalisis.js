// ==========================================
// DASHBOARD ANALYTICS - VERSIÓN FINAL
// Para: edicionesmundogruposaberdigital.netlify.app
// ==========================================

const CONFIG = {
    CLIENT_ID: '365167795235-p2dhm2seel9ou621nimjvu3soe38c3sm.apps.googleusercontent.com',
    PROPERTY_ID: '539526506',
    SCOPES: 'https://www.googleapis.com/auth/analytics.readonly'
};

let accessToken = null;
let tokenClient = null;
let charts = {};

console.log('🌍 Dashboard iniciando en:', window.location.hostname);

// ==========================================
// MOSTRAR DATOS DE DEMOSTRACIÓN INMEDIATOS
// ==========================================

function mostrarDatosDemostracion() {
    console.log('📊 Mostrando datos de demostración');
    
    // KPIs
    document.getElementById('totalVisitantes').innerHTML = '1,248';
    document.getElementById('rebote').innerHTML = '42.5%';
    document.getElementById('clicksCampania').innerHTML = '156';
    
    // Gráfico de dispositivos
    const ctxDevice = document.getElementById('deviceChart');
    if (ctxDevice) {
        charts.device = new Chart(ctxDevice, {
            type: 'doughnut',
            data: {
                labels: ['📱 Móvil', '💻 Desktop', '📟 Tablet'],
                datasets: [{
                    data: [684, 432, 132],
                    backgroundColor: ['#00608B', '#0092BA', '#4FB3C9'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    // Gráfico de redes sociales
    const ctxSocial = document.getElementById('socialChart');
    if (ctxSocial) {
        charts.social = new Chart(ctxSocial, {
            type: 'bar',
            data: {
                labels: ['Google', 'Directo', 'Instagram', 'Facebook'],
                datasets: [{
                    label: 'Visitantes',
                    data: [432, 298, 187, 156],
                    backgroundColor: '#0092BA'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    // Gráfico de tráfico
    const ctxTraffic = document.getElementById('trafficChart');
    if (ctxTraffic) {
        charts.traffic = new Chart(ctxTraffic, {
            type: 'pie',
            data: {
                labels: ['Búsqueda', 'Directo', 'Social', 'Referidos'],
                datasets: [{
                    data: [523, 345, 267, 123],
                    backgroundColor: ['#00608B', '#0092BA', '#4FB3C9', '#7EC8E0']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    // Gráfico de ubicaciones
    const ctxGeo = document.getElementById('geoChart');
    if (ctxGeo) {
        charts.geo = new Chart(ctxGeo, {
            type: 'bar',
            data: {
                labels: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
                datasets: [{
                    label: 'Usuarios',
                    data: [432, 321, 198, 145],
                    backgroundColor: '#0092BA'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
}

// ==========================================
// CONECTAR CON GOOGLE ANALYTICS
// ==========================================

function conectarGoogle() {
    if (!tokenClient) {
        alert('Espera a que la página termine de cargar');
        return;
    }
    
    console.log('🔐 Solicitando acceso a Google Analytics...');
    tokenClient.requestAccessToken();
}

async function cargarDatosReales() {
    if (!accessToken) {
        console.log('No hay token, usando datos de demostración');
        return;
    }
    
    try {
        console.log('🚀 Intentando cargar datos reales...');
        
        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${CONFIG.PROPERTY_ID}:runReport`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    metrics: [{ name: 'activeUsers' }]
                })
            }
        );
        
        const data = await response.json();
        
        if (data.rows && data.rows[0]) {
            const total = parseInt(data.rows[0].metricValues[0].value);
            if (total > 0) {
                document.getElementById('totalVisitantes').innerHTML = total.toLocaleString();
                console.log('✅ Datos reales cargados:', total, 'visitantes');
            }
        }
        
    } catch (error) {
        console.log('No se pudieron cargar datos reales:', error.message);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

async function inicializar() {
    // Mostrar datos de demostración inmediatamente
    mostrarDatosDemostracion();
    
    // Cargar GAPI
    await new Promise((resolve) => {
        if (typeof gapi !== 'undefined') {
            gapi.load('client', resolve);
        } else {
            resolve();
        }
    });
    
    // Inicializar OAuth
    if (typeof google !== 'undefined' && google.accounts) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.CLIENT_ID,
            scope: CONFIG.SCOPES,
            callback: async (response) => {
                if (response.access_token) {
                    accessToken = response.access_token;
                    console.log('✅ Conectado a Google Analytics');
                    await cargarDatosReales();
                }
            }
        });
    }
    
    // Agregar botón de conexión
    const header = document.querySelector('.header-content');
    if (header && !document.querySelector('.connect-btn')) {
        const btn = document.createElement('button');
        btn.innerHTML = '🔐 Conectar con Google Analytics';
        btn.className = 'connect-btn';
        btn.style.cssText = `
            margin-top: 15px;
            padding: 10px 25px;
            background: white;
            color: #00608B;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
        `;
        btn.onclick = conectarGoogle;
        header.appendChild(btn);
    }
    
    console.log('✅ Dashboard listo - Haz clic en "Conectar con Google Analytics"');
}

// Iniciar cuando la página cargue
window.onload = inicializar;