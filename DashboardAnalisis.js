/// ==========================================
// DASHBOARD ANALYTICS - NETLIFY OPTIMIZADO
// Dominio: edicionesmundogruposaberdigital.netlify.app
// ==========================================

const CLIENT_ID = '365167795235-p2dhm2seel9ou621nimjvu3soe38c3sm.apps.googleusercontent.com';
const PROPERTY_ID = '539526506';
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

let accessToken = null;
let tokenClient = null;
let charts = {};
let reintentos = 0;
const MAX_REINTENTOS = 3;

// Detectar entorno
const esNetlify = window.location.hostname.includes('netlify.app');
const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
console.log(`🌍 Entorno: ${esNetlify ? 'NETLIFY' : esLocal ? 'LOCAL' : 'OTRO'}`);
console.log(`🔗 URL actual: ${window.location.href}`);

function mostrarError(mensaje, detalles = '') {
    console.error(`❌ ${mensaje}`, detalles);
    
    const container = document.querySelector('.analytics-container');
    if (!container) return;
    
    // Limpiar errores antiguos
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 15px;
        margin: 20px 0;
        border-radius: 8px;
        border-left: 4px solid #c62828;
        font-family: monospace;
    `;
    errorDiv.innerHTML = `
        <strong>⚠️ Error de conexión:</strong><br>
        ${mensaje}<br>
        ${detalles ? `<small>📝 ${detalles}</small><br>` : ''}
        <small>🔧 Presiona F12 y revisa la consola para más detalles.</small>
    `;
    
    container.prepend(errorDiv);
    setTimeout(() => errorDiv.style.opacity = '0', 8000);
    setTimeout(() => errorDiv.remove(), 8500);
}

function mostrarExito(mensaje) {
    const container = document.querySelector('.analytics-container');
    if (!container) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #e8f5e9;
        color: #2e7d32;
        padding: 12px;
        margin: 20px 0;
        border-radius: 8px;
        border-left: 4px solid #2e7d32;
        text-align: center;
    `;
    successDiv.innerHTML = `✅ ${mensaje}`;
    
    container.prepend(successDiv);
    setTimeout(() => successDiv.remove(), 4000);
}

function destruirGrafico(id) {
    if (charts[id]) {
        charts[id].destroy();
        delete charts[id];
    }
}

function mostrarCargando(mostrar) {
    let loading = document.querySelector('.loading-overlay');
    if (mostrar && !loading) {
        loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        loading.innerHTML = `
            <div style="background: white; padding: 20px 40px; border-radius: 10px; color: #00608B;">
                <div>🔄 Conectando con Google Analytics...</div>
                <div style="font-size: 12px; margin-top: 10px;">${esNetlify ? '🌐 Netlify' : '💻 Local'}</div>
            </div>
        `;
        document.body.appendChild(loading);
    } else if (!mostrar && loading) {
        loading.remove();
    }
}

async function consultarGA(metric, dimension = null, limit = 10) {
    if (!accessToken) {
        throw new Error('No hay token de acceso. Inicia sesión con Google.');
    }

    const body = {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: metric }]
    };

    if (dimension) {
        body.dimensions = [{ name: dimension }];
        body.limit = limit;
        body.orderBys = [{
            metric: { metricName: metric },
            desc: true
        }];
    }

    const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (data.error) {
        if (data.error.code === 403) {
            throw new Error(`Sin permisos para la propiedad ${PROPERTY_ID}. Verifica en Google Analytics que tu cuenta tenga acceso.`);
        }
        throw new Error(data.error.message);
    }

    return data;
}

function crearGraficoDoughnut(id, labels, data) {
    destruirGrafico(id);
    const elemento = document.getElementById(id);
    if (!elemento) return;
    
    if (!labels.length || !data.length || data.every(v => v === 0)) {
        labels = ['Sin datos (30 días)'];
        data = [1];
    }
    
    const colores = ['#00608B', '#0092BA', '#4FB3C9', '#7EC8E0', '#A0C5CF', '#C5E0EB'];
    const backgroundColors = labels.map((_, i) => colores[i % colores.length]);
    
    charts[id] = new Chart(elemento, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } },
                tooltip: { 
                    callbacks: { 
                        label: (ctx) => {
                            const total = data.reduce((a,b) => a + b, 0);
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return `${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoBarra(id, labels, data, labelTexto = 'Usuarios') {
    destruirGrafico(id);
    const elemento = document.getElementById(id);
    if (!elemento) return;
    
    if (!labels.length || !data.length) {
        labels = ['Sin datos'];
        data = [0];
    }
    
    charts[id] = new Chart(elemento, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTexto,
                data: data,
                backgroundColor: '#0092BA',
                borderColor: '#00608B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}` } }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Usuarios' } },
                x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
            }
        }
    });
}

function crearGraficoPie(id, labels, data) {
    destruirGrafico(id);
    const elemento = document.getElementById(id);
    if (!elemento) return;
    
    if (!labels.length || !data.length || data.every(v => v === 0)) {
        labels = ['Sin datos'];
        data = [1];
    }
    
    const colores = ['#00608B', '#0092BA', '#4FB3C9', '#7EC8E0', '#A0C5CF'];
    const backgroundColors = labels.map((_, i) => colores[i % colores.length]);
    
    charts[id] = new Chart(elemento, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { 
                    callbacks: { 
                        label: (ctx) => {
                            const total = data.reduce((a,b) => a + b, 0);
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return `${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

async function cargarDashboard() {
    mostrarCargando(true);
    
    try {
        console.log('🚀 Iniciando carga del dashboard en', esNetlify ? 'NETLIFY' : 'LOCAL');
        
        // Total Visitantes
        const visitantes = await consultarGA('activeUsers');
        if (visitantes.rows?.[0]) {
            document.getElementById('totalVisitantes').innerHTML = parseInt(visitantes.rows[0].metricValues[0].value).toLocaleString();
        }
        
        // Rebote
        const rebote = await consultarGA('bounceRate');
        if (rebote.rows?.[0]) {
            document.getElementById('rebote').innerHTML = parseFloat(rebote.rows[0].metricValues[0].value).toFixed(1) + '%';
        }
        
        // Dispositivos
        const dispositivos = await consultarGA('activeUsers', 'deviceCategory');
        if (dispositivos.rows?.length) {
            crearGraficoDoughnut('deviceChart', 
                dispositivos.rows.map(r => r.dimensionValues[0].value),
                dispositivos.rows.map(r => parseInt(r.metricValues[0].value))
            );
        }
        
        // Fuentes
        const fuentes = await consultarGA('activeUsers', 'sessionSource', 6);
        if (fuentes.rows?.length) {
            crearGraficoBarra('socialChart',
                fuentes.rows.map(r => r.dimensionValues[0].value || 'Directo'),
                fuentes.rows.map(r => parseInt(r.metricValues[0].value)),
                'Visitantes por fuente'
            );
        }
        
        // Canales
        const canales = await consultarGA('activeUsers', 'sessionDefaultChannelGroup');
        if (canales.rows?.length) {
            crearGraficoPie('trafficChart',
                canales.rows.map(r => r.dimensionValues[0].value),
                canales.rows.map(r => parseInt(r.metricValues[0].value))
            );
        }
        
        // Ubicaciones
        const geo = await consultarGA('activeUsers', 'city', 6);
        if (geo.rows?.length) {
            crearGraficoBarra('geoChart',
                geo.rows.map(r => r.dimensionValues[0].value || 'Otras'),
                geo.rows.map(r => parseInt(r.metricValues[0].value)),
                'Usuarios por ciudad'
            );
        }
        
        // Clicks campaña
        try {
            const eventos = await consultarGA('eventCount', 'eventName', 20);
            const campania = eventos.rows?.find(x => x.dimensionValues[0].value === 'campaign_click');
            document.getElementById('clicksCampania').innerHTML = campania ? parseInt(campania.metricValues[0].value).toLocaleString() : '0';
        } catch (e) {
            document.getElementById('clicksCampania').innerHTML = '0';
        }
        
        mostrarExito('Dashboard actualizado correctamente');
        reintentos = 0;
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message, `Propiedad: ${PROPERTY_ID}`);
        
        if (reintentos < MAX_REINTENTOS) {
            reintentos++;
            console.log(`Reintento ${reintentos}/${MAX_REINTENTOS} en 3 segundos...`);
            setTimeout(() => cargarDashboard(), 3000);
        }
    } finally {
        mostrarCargando(false);
    }
}

async function inicializarGAPI() {
    return new Promise((resolve, reject) => {
        if (typeof gapi === 'undefined') {
            reject(new Error('GAPI no cargó. Verifica internet o bloqueadores.'));
            return;
        }
        
        gapi.load('client', async () => {
            try {
                await gapi.client.init({});
                console.log('✅ GAPI inicializado');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

function iniciarOAuth() {
    if (typeof google === 'undefined' || !google.accounts) {
        mostrarError('Google Identity Services no cargó', 'Revisa tu conexión a internet');
        return;
    }
    
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        prompt: 'consent',
        callback: async (response) => {
            if (response.error) {
                mostrarError(`Error de autenticación: ${response.error}`, 'Intenta cerrar sesión y volver a entrar');
                return;
            }
            
            accessToken = response.access_token;
            console.log('✅ Token obtenido');
            mostrarExito('Conectado a Google Analytics');
            await cargarDashboard();
        }
    });
    
    tokenClient.requestAccessToken();
}

// Inicio
window.onload = async () => {
    console.log('🎯 Dashboard Analytics - Iniciando...');
    console.log(`📊 Property ID: ${PROPERTY_ID}`);
    
    try {
        await inicializarGAPI();
        iniciarOAuth();
    } catch (error) {
        mostrarError(`Error de inicialización: ${error.message}`, 'Recarga la página e intenta de nuevo');
    }
};