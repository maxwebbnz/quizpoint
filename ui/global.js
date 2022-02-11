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
}/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}


let classList = [
    {
        "teacher": "Mr Alan",
        "image": "https://st2.depositphotos.com/6672578/10091/i/600/depositphotos_100912942-stock-photo-woodwork-workshop-wall-with-many.jpg",
    },
    {
        "teacher": "Mr Max",
        "image": "https://media.istockphoto.com/photos/field-full-of-green-grass-and-hills-picture-id146766798?k=20&m=146766798&s=612x612&w=0&h=UQulU1Miuimu96r1yApRgBiwXcUGgeUhFgH3kuHWOEc=",
    },
    {
        "teacher": "Mr Gillies",
        "image": "https://blogs.windows.com/wp-content/uploads/prod/2020/08/windows-logo-social.png",
    }
];

let classCardArray;
let classroomContainer = {
    updateClasses: () => {
        if (classCardArray) return
        classCardArray = document.getElementById("classContainer");
        classList.forEach((classroom) => {
            classroomContainer.addClassesToPage(classroom);
        })
    },
    addClassesToPage: (classroom) => {
        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardTitle = document.createElement("p");
        let cardImg = document.createElement("img");
        card.className = "card g-col-6 g-col-md-4";
        cardBody.className = "card-body";
        cardTitle.className = "card-title";
        cardTitle.innerText = classroom.teacher + "'s Classroom";
        cardImg.src = classroom.image;
        cardImg.className = "card-img-top";

        cardBody.appendChild(cardImg);
        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        classCardArray.appendChild(card);
    },
}