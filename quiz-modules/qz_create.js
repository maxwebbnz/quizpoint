/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let qz_create = {
    /**========================================================================
     **                           pullDOM
     *?  What does it do? Pulls HTML values before storing to database
     *@return n/a
     *========================================================================**/
    pullDOM: function() {

    },
    /**========================================================================
     **                           newRow
     *?  What does it do? Create a new row in table
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
    newRow: function() {
        var count = $('#qz_questionTable tr').length;
        var row = document.getElementById("question"); // find row to copy
        var table = document.getElementById("qz_questionTable"); // find table to append to
        var clone = row.cloneNode(true); // copy children too
        clone.id = "question" + count; // change id or other attributes/contents
        table.appendChild(clone); // add new row to end of table
    }
}