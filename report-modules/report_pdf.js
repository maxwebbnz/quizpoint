/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
function generate() {
    var doc = new jspdf.jsPDF()

    // Simple data example
    var head = [
        ['ID', 'Country', 'Rank', 'Capital']
    ]
    var body = [
        [1, 'Denmark', 7.526, 'Copenhagen'],
        [2, 'Switzerland', 7.509, 'Bern'],
        [3, 'Iceland', 7.501, 'Reykjavík'],
    ]
    doc.autoTable({ head: head, body: body })
    doc.text("Report - Student Quiz completion in 9PTEC", 10, 10);

    // Simple html example
    doc.autoTable({
        html: '#currentReport',
        // styles: { fillColor: [255, 0, 0] },
    })

    doc.save('table.pdf')
}