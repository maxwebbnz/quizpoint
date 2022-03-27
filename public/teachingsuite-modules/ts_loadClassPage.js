ts.loadClassPage = {
    loadQuizProgressBar: function() {
        let ctx = document.getElementById('quizProgress').getContext('2d');
        let quizData = {
            datasets: [{
                data: [10, 5],
                backgroundColor: [
                    'rgb(80, 200, 120)',
                    'rgb(211,211,211)',
                ],
                hoverOffset: 3
            }]
        };
        let quizChart = new Chart(ctx, {
            type: 'doughnut',
            data: quizData,
            options: {
                responsive:true,
                maintainAspectRatio:false,
            },
        });
    }
}