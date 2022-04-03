/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


/**========================================================================
 * ?                                ABOUT QUIZPOINT
 * @author         :  @maxwebbnz @alanmcilwaine
 * @email          :  18205mw@hvhs.school.nz, 18064am@hvhs.school.nz
 * @repo           :  https://github.com/maxwebbnz/quizpoint/
 * @createdOn      :  2022
 * @description    :  QuizPoint is a education platform that allows schools to test and educate students on relevant topics that they need testing on. This platform then selfmarks the quizzes, and can generate reports for teachers that are easy to use and read.
 *========================================================================**/
/**========================================================================
 **                           App.js
 *? Performs steps and helps install PWA (progressive web application)
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
const divInstall = document.getElementById('installContainer');
const butInstall = document.getElementById('butInstall');

/* Put code here */



/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */
if (window.location.protocol === 'http:') {
    const requireHTTPS = document.getElementById('requireHTTPS');
    const link = requireHTTPS.querySelector('a');
    link.href = window.location.href.replace('http://', 'https://');
    requireHTTPS.classList.remove('hidden');
}

import { MDCDataTable } from '@material/data-table';
const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));
return
}
else {
    // return quizzes assigned to class
    const data = snapshot.val();
    for (a in data.quizzes.active) {
        classQuiz.push(a)
        console.log(classQuiz)
    }
}
});
// check quizzess active in the user path
var paths = firebase.database().ref(defaultPath + '/users/' + _uid)
paths.on('value', (snapshot) => {
    if (snapshot.val() == null) {
        return
    } else {
        // repeat of actions above, but now for the user
        const data = snapshot.val();
        for (a in data.quizzes.active) {
            userQuiz.push(a)
        }
        for (var i = 0; i < userQuiz.length; i++) {
            if (classQuiz.indexOf(userQuiz[i]) != -1) {
                quizAssigned.push(userQuiz[i])
            } else {}
        }

    }
    //? now fetch quiz info
    for (var i = 0; i < quizAssigned.length; i++) {
        // variables for use (b could well be x,y,z :P)
        let b;
        let id = quizAssigned[i]
            // get quiz information
        var path = firebase.database().ref(defaultPath + '/quizzes/' + quizAssigned[i])
        path.on('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log('no quiz with that id')
            } else {
                console.log(snapshot.val())
                const data = snapshot.val();
                b = data
                    // setup html
                let html = `<div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title">${b.title}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">${b.description}</h6>
                                            <a href="#" class="card-link" id="quizCard-a-${id}">Start Quiz</a>
                                        </div>
                                        </div>`
                    // add it to the page
                $(`#classpage_authed_student-quizassigned`).append(html)
                    //if clicked, start quiz
                $(`#quizCard-a-${id}`).on("click", function() {
                    qz_load.getQuiz(id)
                    currentQuizId = id
                });
            }
        });
    }
});
}
return;
// console.log(quizAssigned)
}
}