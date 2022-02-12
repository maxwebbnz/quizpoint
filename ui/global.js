/*
 * Copyright (c) 2022 Safety 360 (Alan and Max)
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 Safety 360 (Alan and Max)
 * All rights reserved.
 */

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}
//When the website loads, scan the classList variable and turn those fields into cards
window.onload = function() {
    classroomContainer.updateClasses(classList);
};

//Array with all the card properties
let classCardArray;

//Object array thing
let classroomContainer = {
    //Iterate through the classList variable and add cards for each. 
    updateClasses: () => {
        // If there are already cards created, stop the function
        if (classCardArray) return
        classCardArray = document.getElementById("classContainer");
        classList.forEach((classroom) => {
            classroomContainer.addClassesToPage(classroom);
        })
    },
    //Properties for the classroom cards. 
    addClassesToPage: (classroom) => {
        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardTitle = document.createElement("p");
        let cardImg = document.createElement("img");
        let cardFooter = document.createElement("div");
        //Edit the class and properties of each section of the card
        card.className = "card g-col-6 g-col-md-4 animate__animated animate__fadeInLeft";
        cardBody.className = "card-body";
        cardTitle.className = "card-title text-center";
        cardTitle.innerText = classroom.classroom;
        cardImg.src = classroom.image;
        cardImg.className = "card-img-top rounded";
        cardFooter.className = "card-footer text-muted";
        cardFooter.innerText = classroom.teacher;
        cardBody.onclick = function() {
            cls.show(classList.indexOf(classroom))
        }


        //Merge all elements of the card into one
        cardBody.appendChild(cardImg);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardFooter);
        card.appendChild(cardBody);
        classCardArray.appendChild(card);
    },
}


//Switch screen
function switchScreen(_switchFrom, _switchTo) {
    document.getElementById(_switchFrom).style.display = "none";
    document.getElementById(_switchTo).style.display = "block";

}