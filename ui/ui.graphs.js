let graphs = {
    testing: function() {

    }
}

const labels = [
    '50%',
    '60%',
    '100%',
];

const data = {
    labels: labels,
    datasets: [{
        label: 'Pass Rate',
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        borderColor: 'rgb(255, 99, 132)',
        data: [20, 10, 70],
    }]
};

const config = {
    type: 'pie',
    data: data,
    options: {}
};

const passChart = new Chart(
    document.getElementById('passChart'),

    config
);
const graphChart = new Chart(
    document.getElementById('graphChart'),

    config
);
let chart = document.getElementById('passChart')

chart.canvas.parentNode.style.height = '20px';
chart.canvas.parentNode.style.width = '128px';