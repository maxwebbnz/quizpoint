/*
 * Copyright (c) 2022 Max Webb
 * All rights reserved.
 */
// someThings.js

(function() {
    var fb = {
        hello: function(_param) {
            console.log(_param)
        }
    }

    module.exports.read = function(_path) {
        return fb.hello(_path);
    }

}());