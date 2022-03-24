ts.loadClassPage = {
    loadQuizProgressBar: function() {
        let ctx = document.getElementById('quizProgress').getContext('2d');
        let quizData = {
            labels: [
                'Turned In',
                'Not Completed',
            ],
            datasets: [{
                data: [10, 5],
                backgroundColor: [
                    'rgb(80, 200, 120)',
                    'rgb(238, 75, 43)',
                ],
                hoverOffset: 3
            }]
        };
        let quizChart = new Chart(ctx, {
            type: 'doughnut',
            data: quizData,
        });
    }
}