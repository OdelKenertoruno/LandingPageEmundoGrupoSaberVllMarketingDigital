// ==========================================
// DASHBOARD ANALYTICS - GOOGLE ANALYTICS 4
// ==========================================

// ------------------------------------------
// CONFIGURACIÓN
// ------------------------------------------

const CLIENT_ID =
'365167795235-p2dhm2seel9ou621nimjvu3soe38c3sm.apps.googleusercontent.com';

const PROPERTY_ID =
'539526506';

const SCOPES =
'https://www.googleapis.com/auth/analytics.readonly';

let accessToken = '';
let tokenClient = null;

// ------------------------------------------
// INICIO
// ------------------------------------------

window.onload = () => {

    gapi.load('client', async () => {

        await gapi.client.init({});

        tokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id: CLIENT_ID,

            scope: SCOPES,

            callback: async (response) => {

                accessToken =
                response.access_token;

                await cargarDashboard();

            }

        });

        tokenClient.requestAccessToken();

    });

};

// ------------------------------------------
// CONSULTAR GOOGLE ANALYTICS
// ------------------------------------------

async function consultarGA(
    metric,
    dimension = null
)
{
    const body = {

        dateRanges: [
            {
                startDate: '30daysAgo',
                endDate: 'today'
            }
        ],

        metrics: [
            {
                name: metric
            }
        ]
    };

    if(dimension)
    {
        body.dimensions = [
            {
                name: dimension
            }
        ];
    }

    const response = await fetch(

        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,

        {
            method: 'POST',

            headers: {

                Authorization:
                `Bearer ${accessToken}`,

                'Content-Type':
                'application/json'

            },

            body:
            JSON.stringify(body)

        }

    );

    return await response.json();
}

// ------------------------------------------
// CARGAR DASHBOARD
// ------------------------------------------

async function cargarDashboard()
{
    try
    {

        // =====================================
        // TOTAL VISITANTES
        // =====================================

        const visitantes =
        await consultarGA(
            'activeUsers'
        );

        document.getElementById(
            'totalVisitantes'
        ).innerHTML =
        visitantes.rows[0]
        .metricValues[0]
        .value;


        // =====================================
        // REBOTE
        // =====================================

        const rebote =
        await consultarGA(
            'bounceRate'
        );

        document.getElementById(
            'rebote'
        ).innerHTML =
        parseFloat(
            rebote.rows[0]
            .metricValues[0]
            .value
        ).toFixed(2) + '%';


        // =====================================
        // DISPOSITIVOS
        // =====================================

        const dispositivos =
        await consultarGA(
            'activeUsers',
            'deviceCategory'
        );

        new Chart(

            document.getElementById(
                'deviceChart'
            ),

            {

                type: 'doughnut',

                data: {

                    labels:
                    dispositivos.rows.map(
                        x =>
                        x.dimensionValues[0].value
                    ),

                    datasets: [
                        {
                            data:
                            dispositivos.rows.map(
                                x =>
                                x.metricValues[0].value
                            )
                        }
                    ]

                }

            }

        );


        // =====================================
        // REDES SOCIALES
        // =====================================

        const redes =
        await consultarGA(
            'activeUsers',
            'sessionSource'
        );

        new Chart(

            document.getElementById(
                'socialChart'
            ),

            {

                type: 'bar',

                data: {

                    labels:
                    redes.rows.map(
                        x =>
                        x.dimensionValues[0].value
                    ),

                    datasets: [
                        {
                            label:
                            'Usuarios',

                            data:
                            redes.rows.map(
                                x =>
                                x.metricValues[0].value
                            )
                        }
                    ]

                }

            }

        );


        // =====================================
        // FUENTES DE TRÁFICO
        // =====================================

        const trafico =
        await consultarGA(
            'activeUsers',
            'sessionDefaultChannelGroup'
        );

        new Chart(

            document.getElementById(
                'trafficChart'
            ),

            {

                type: 'pie',

                data: {

                    labels:
                    trafico.rows.map(
                        x =>
                        x.dimensionValues[0].value
                    ),

                    datasets: [
                        {
                            data:
                            trafico.rows.map(
                                x =>
                                x.metricValues[0].value
                            )
                        }
                    ]

                }

            }

        );


        // =====================================
        // UBICACIONES
        // =====================================

        const geo =
        await consultarGA(
            'activeUsers',
            'city'
        );

        new Chart(

            document.getElementById(
                'geoChart'
            ),

            {

                type: 'bar',

                data: {

                    labels:
                    geo.rows.map(
                        x =>
                        x.dimensionValues[0].value
                    ),

                    datasets: [
                        {
                            label:
                            'Visitantes',

                            data:
                            geo.rows.map(
                                x =>
                                x.metricValues[0].value
                            )
                        }
                    ]

                }

            }

        );


        // =====================================
        // CLICKS CAMPAÑA
        // =====================================

        try
        {

            const eventos =
            await consultarGA(
                'eventCount',
                'eventName'
            );

            const campania =
            eventos.rows.find(

                x =>

                x.dimensionValues[0].value ===
                'campaign_click'

            );

            if(campania)
            {
                document.getElementById(
                    'clicksCampania'
                ).innerHTML =
                campania.metricValues[0].value;
            }
            else
            {
                document.getElementById(
                    'clicksCampania'
                ).innerHTML =
                '0';
            }

        }
        catch(error)
        {
            console.log(
                'Sin eventos de campaña aún'
            );
        }

    }
    catch(error)
    {
        console.error(
            'Error Analytics:',
            error
        );

        alert(
            'No fue posible conectar con Google Analytics.'
        );
    }
}