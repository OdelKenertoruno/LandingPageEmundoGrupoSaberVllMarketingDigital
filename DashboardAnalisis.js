// ============================================================
// DashboardAnalisis.js
// Configuración para Google Analytics Data API v1 con OAuth 2.0
// ============================================================

// Configuración de tu propiedad de GA4 y credenciales de OAuth
const GA_PROPERTY_ID = '539526506';   // ID de tu propiedad de Google Analytics 4
const CLIENT_ID = '945211654005-b4m2mbqlfb0i0414lt92fgguavifje1a.apps.googleusercontent.com'; // Tu ID de cliente OAuth

// Alcances (scopes) necesarios: solo lectura de datos de Analytics
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

// Variables globales
let tokenClient;
let accessToken = null;
let charts = {};          // Para almacenar los objetos Chart.js y poder destruirlos después

// Elementos del DOM
const authStatus = document.getElementById('auth-status');
const unauthorizedDiv = document.getElementById('unauthorized');
const dashboardDiv = document.getElementById('dashboard-content');
const signoutBtn = document.getElementById('signout-btn');
const authorizeBtn = document.getElementById('authorize-button');

// ============================================================
// Inicialización cuando la página ha cargado completamente
// ============================================================
window.onload = () => {
    // Inicializar el cliente de tokens OAuth 2.0 de Google
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
            if (resp.error) {
                console.error('Error en autenticación OAuth:', resp);
                authStatus.innerText = '❌ Error de autenticación';
                return;
            }
            // Guardar el token de acceso
            accessToken = resp.access_token;
            authStatus.innerText = '✅ Sesión activa';
            // Mostrar el dashboard y ocultar el botón de login
            unauthorizedDiv.style.display = 'none';
            dashboardDiv.style.display = 'block';
            signoutBtn.style.display = 'block';
            // Cargar todos los datos desde Analytics
            fetchAllAnalyticsData();
        },
    });

    // Comprobar si ya hay una sesión previa (normalmente no, porque el token expira)
    checkExistingSession();

    // Evento del botón "Iniciar sesión con Google"
    authorizeBtn.onclick = () => {
        tokenClient.requestAccessToken();
    };

    // Evento del botón "Cerrar sesión"
    signoutBtn.onclick = () => {
        accessToken = null;
        authStatus.innerText = '🔒 Sesión cerrada';
        unauthorizedDiv.style.display = 'block';
        dashboardDiv.style.display = 'none';
        signoutBtn.style.display = 'none';
        // Limpiar gráficos y números
        clearCharts();
        // Recargar la página para reiniciar el estado (opcional)
        // window.location.reload();
    };
};

// ============================================================
// Verificar si ya hay token (por si acaso)
// ============================================================
function checkExistingSession() {
    // Por simplicidad, siempre pedimos un nuevo inicio de sesión.
    // Si quisieras mantener la sesión, podrías guardar el token en localStorage,
    // pero por seguridad es preferible pedir autorización cada vez que se carga la página.
    authStatus.innerText = '🚫 No autenticado';
    unauthorizedDiv.style.display = 'block';
    dashboardDiv.style.display = 'none';
    signoutBtn.style.display = 'none';
}

// ============================================================
// Obtener todos los datos: se ejecuta en paralelo
// ============================================================
async function fetchAllAnalyticsData() {
    if (!accessToken) {
        console.warn('No hay token de acceso');
        return;
    }
    // Mostrar mensaje de carga en cada métrica (opcional)
    document.getElementById('total-users').innerText = 'Cargando...';
    document.getElementById('bounce-rate').innerText = 'Cargando...';
    document.getElementById('avg-time').innerText = 'Cargando...';
    document.getElementById('event-clicks').innerText = 'Cargando...';

    try {
        await Promise.all([
            fetchTotalUsers(),
            fetchDevices(),
            fetchBounceRateAndAvgTime(),
            fetchTrafficSources(),
            fetchGeoDetails(),
            fetchEventClicks()
        ]);
    } catch (error) {
        console.error('Error al cargar datos:', error);
        authStatus.innerText = '⚠️ Error al cargar datos';
    }
}

// ============================================================
// 1. Total de visitantes (usuarios activos en los últimos 30 días)
// ============================================================
async function fetchTotalUsers() {
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
    };
    const data = await callAnalyticsAPI(requestBody);
    const total = data.rows?.[0]?.metricValues?.[0]?.value || '0';
    document.getElementById('total-users').innerText = parseInt(total).toLocaleString();
}

// ============================================================
// 2. Gráfico de tipos de dispositivos (pie chart)
// ============================================================
async function fetchDevices() {
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'deviceCategory' }]
    };
    const data = await callAnalyticsAPI(requestBody);
    const labels = [];
    const values = [];
    if (data.rows) {
        data.rows.forEach(row => {
            labels.push(row.dimensionValues[0].value);
            values.push(parseInt(row.metricValues[0].value));
        });
    }
    // Destruir gráfico anterior si existe
    if (charts.devices) charts.devices.destroy();
    const ctx = document.getElementById('devices-chart').getContext('2d');
    charts.devices = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#aa66cc']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ============================================================
// 3. Porcentaje de rebote y tiempo promedio en el sitio
// ============================================================
async function fetchBounceRateAndAvgTime() {
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
        ]
    };
    const data = await callAnalyticsAPI(requestBody);
    const bounce = data.rows?.[0]?.metricValues?.[0]?.value || '0';
    const avgSec = data.rows?.[0]?.metricValues?.[1]?.value || '0';
    document.getElementById('bounce-rate').innerText = `${parseFloat(bounce).toFixed(1)}%`;
    const avgMinutes = (parseFloat(avgSec) / 60).toFixed(1);
    document.getElementById('avg-time').innerText = `${avgMinutes} minutos`;
}

// ============================================================
// 4. Fuentes de tráfico (gráfico de barras)
// ============================================================
async function fetchTrafficSources() {
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }],
        dimensions: [{ name: 'sessionSource' }],
        limit: 6   // Mostrar las 6 fuentes principales
    };
    const data = await callAnalyticsAPI(requestBody);
    const labels = [];
    const values = [];
    if (data.rows) {
        data.rows.forEach(row => {
            labels.push(row.dimensionValues[0].value);
            values.push(parseInt(row.metricValues[0].value));
        });
    }
    if (charts.traffic) charts.traffic.destroy();
    const ctx = document.getElementById('traffic-chart').getContext('2d');
    charts.traffic = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sesiones',
                data: values,
                backgroundColor: '#34a853'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'none' } }
        }
    });
}

// ============================================================
// 5. Detalles demográficos (países)
// ============================================================
async function fetchGeoDetails() {
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }],
        limit: 6
    };
    const data = await callAnalyticsAPI(requestBody);
    const labels = [];
    const values = [];
    if (data.rows) {
        data.rows.forEach(row => {
            labels.push(row.dimensionValues[0].value);
            values.push(parseInt(row.metricValues[0].value));
        });
    }
    if (charts.geo) charts.geo.destroy();
    const ctx = document.getElementById('geo-chart').getContext('2d');
    charts.geo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Usuarios activos',
                data: values,
                backgroundColor: '#fbbc04'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'none' } }
        }
    });
}

// ============================================================
// 6. Cantidad de clics en ventana emergente (evento personalizado)
// ============================================================
async function fetchEventClicks() {
    // IMPORTANTE: Asegúrate de que en tu landing page se esté enviando el evento 'click_promo' a GA4.
    // Si usas otro nombre de evento, cámbialo aquí.
    const requestBody = {
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
            filter: {
                fieldName: 'eventName',
                stringFilter: { matchType: 'EXACT', value: 'click_promo' }
            }
        }
    };
    const data = await callAnalyticsAPI(requestBody);
    const clicks = data.rows?.[0]?.metricValues?.[0]?.value || '0';
    document.getElementById('event-clicks').innerText = parseInt(clicks).toLocaleString();
}

// ============================================================
// Función genérica para llamar a la API de datos de GA4 (runReport)
// ============================================================
async function callAnalyticsAPI(requestBody) {
    if (!accessToken) {
        throw new Error('No hay token de acceso');
    }
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la API de Analytics:', errorText);
        // Podrías lanzar un error específico
        return { rows: [] };
    }
    return await response.json();
}

// ============================================================
// Limpiar todos los gráficos y números al cerrar sesión
// ============================================================
function clearCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
    document.getElementById('total-users').innerText = '—';
    document.getElementById('bounce-rate').innerText = '—';
    document.getElementById('avg-time').innerText = '—';
    document.getElementById('event-clicks').innerText = '—';
}