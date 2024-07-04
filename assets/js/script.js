//consultar por tipo de indicador
//https://mindicador.cl/api/{tipo_indicador}

//consultar por fecha
//https://mindicador.cl/api/{tipo_indicador}/{dd-mm-yyyy}

//consultar un año
//https://mindicador.cl/api/{tipo_indicador}/{yyyy}


// const getDolarUltimoMes = async()=> {
//     const res = await fetch('https://mindicador.cl/api/dolar')
//     const data = await res.json()
//     console.log(data);
// }

// getDolarUltimoMes ()

// const getEuroUltimoMes = async()=> {
//     const res = await fetch('https://mindicador.cl/api/euro')
//     const data = await res.json()
//     console.log(data);
// }

// getEuroUltimoMes ()

let chart;

        const getDolarUltimoMes = async () => {
            try {
                const res = await fetch('https://mindicador.cl/api/dolar');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                return data.serie.slice(0, 10); // return the last 10 USD values in CLP
            } catch (error) {
                console.error('Error fetching USD data:', error);
                return null;
            }
        };

        const getEuroUltimoMes = async () => {
            try {
                const res = await fetch('https://mindicador.cl/api/euro');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                return data.serie.slice(0, 10); // return the last 10 EUR values in CLP
            } catch (error) {
                console.error('Error fetching EUR data:', error);
                return null;
            }
        };

        const convertCurrency = async () => {
            const clpValue = document.getElementById('CLP').value;
            const selectedCurrency = document.getElementById('moneda').value;
            let conversionRate;

            if (selectedCurrency === 'USD') {
                conversionRate = await getDolarUltimoMes();
            } else if (selectedCurrency === 'EUR') {
                conversionRate = await getEuroUltimoMes();
            }

            if (conversionRate === null) {
                document.getElementById('resultado').innerText = 'Error fetching conversion rate. Please try again later.';
                return;
            }

            const convertedValue = clpValue / conversionRate[0].valor;
            document.getElementById('resultado').innerText = `Resultado: ${convertedValue.toFixed(2)} ${selectedCurrency}`;
        };

        const showGraph = async () => {
            const selectedCurrency = document.getElementById('moneda').value;
            let data;

            if (selectedCurrency === 'USD') {
                data = await getDolarUltimoMes();
            } else if (selectedCurrency === 'EUR') {
                data = await getEuroUltimoMes();
            }

            if (data === null) {
                console.error('Error fetching data for the graph.');
                return;
            }

            const labels = data.map(item => new Date(item.fecha).toLocaleDateString());
            const values = data.map(item => item.valor);

            if (chart) {
                chart.destroy();
            }

            const ctx = document.getElementById('chart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Last 10 values in CLP for ${selectedCurrency}`,
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Value in CLP'
                            }
                        }
                    }
                }
            });
        };

        document.getElementById('buscar').addEventListener('click', async () => {
            await convertCurrency();
            await showGraph();
        });

        document.getElementById('moneda').addEventListener('change', showGraph);

        // Initial graph load
        showGraph();