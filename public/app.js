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