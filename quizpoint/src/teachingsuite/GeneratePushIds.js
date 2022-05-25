/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

export default function generatePushID() {
    var PUSH_CHARS =
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var lastPushTime = 0;
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = now === lastPushTime;
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error("We should have converted the entire timestamp.");

        var id = timeStampChars.join("");

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length !== 20) throw new Error("Length should be 20.");

        let returnVal = 'QUIZ_' + id
        return returnVal;
    };
}