let classList = [{
        "classroom": "9PTEC",
        "code": "A",

        "image": "https://st2.depositphotos.com/6672578/10091/i/600/depositphotos_100912942-stock-photo-woodwork-workshop-wall-with-many.jpg",
        "teacher": "Alan McIlwaine",
        "posts": {
            "a": {
                "author": "Alan McIlwaine",
                "content": "HELLO I LIKE JASON!!!",
            },
            "b": {
                "author": "Alan McIlwaine",
                "content": "HELLO I LIKE JASON T!!!",
            },

        },
        "quizes": {
            "0001": {
                "assignedby": "Alan",
                "due": "16th Feb",
                "code": "0001"
            },
        },
    },
    {
        "classroom": "13COMP",
        "code": "A",
        "image": "https://media.istockphoto.com/photos/field-full-of-green-grass-and-hills-picture-id146766798?k=20&m=146766798&s=612x612&w=0&h=UQulU1Miuimu96r1yApRgBiwXcUGgeUhFgH3kuHWOEc=",
        "teacher": "Max Webb",
        "posts": {
            "a": {
                "author": "Max webb",
                "content": "HELLO I LIKE JASON!!!",
            },
        }
    },
    {
        "classroom": "13DTEC",
        "image": "https://blogs.windows.com/wp-content/uploads/prod/2020/08/windows-logo-social.png",
        "teacher": "Steven Leishman",
        "code": "A",

        "posts": {

        }
    },
    {
        "classroom": "13PHY",
        "image": "https://media.istockphoto.com/photos/field-full-of-green-grass-and-hills-picture-id146766798?k=20&m=146766798&s=612x612&w=0&h=UQulU1Miuimu96r1yApRgBiwXcUGgeUhFgH3kuHWOEc=",
        "teacher": "Bryan Gillies",
        "code": "A",

        "posts": {
            "a": {
                "author": this.teacher,
                "content": "HELLO I LIKE JASON!!!",
            },
        }
    },
    {
        "classroom": "13DRA",
        "image": "https://media.istockphoto.com/photos/field-full-of-green-grass-and-hills-picture-id146766798?k=20&m=146766798&s=612x612&w=0&h=UQulU1Miuimu96r1yApRgBiwXcUGgeUhFgH3kuHWOEc=",
        "teacher": "Katie Long",
        "code": "A",
        "posts": {
            "a": {
                "author": this.teacher,
                "content": "HELLO I LIKE JASON!!!",
            },
        }
    },
    {
        "classroom": "13ELE",
        "image": "https://media.istockphoto.com/photos/field-full-of-green-grass-and-hills-picture-id146766798?k=20&m=146766798&s=612x612&w=0&h=UQulU1Miuimu96r1yApRgBiwXcUGgeUhFgH3kuHWOEc=",
        "teacher": "Jason Tierney",
        "code": "A",

        "posts": {
            "a": {
                "author": this.teacher,
                "content": "HELLO I LIKE JASON!!!",
            },
        }
    }
]

let quizes = [{
    "name": "The monster is here!",
    code: "axy",
    "author": "Mr Alan the Monster",
    "scorerequired": "100",
    "questions": [{ "question": "What is Max's last name?", "answer": "Webb" }, { "question": "What is Max's last names?", "answer": "Webb" }],
}, {
    "name": "The monster is here!",
    code: "ddd",
    "author": "Mr Alan the Monster",
    "scorerequired": "100",
    "questions": [{ "question": "What is Max's last name?", "answer": "Webb" }, { "question": "What is Max's last name?", "answer": "Webbs" }],
}]

let user = {
    "name": "Max Webb",
    "assigned": {
        "9PTEC": "axy",
        "13DTEC": "dad"
    }
}