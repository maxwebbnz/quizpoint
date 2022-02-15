let userUI = {
    display: function() {
        // take all elements in website and display the logged in user..
        let usrn = document.getElementById('clientUserName')
        let usre = document.getElementById('clientEmail')
        let usrpp = document.getElementById('clientProfilePicture')
        let usrid = document.getElementById('clientId')
        let usr = currentUser;
        usrn.innerHTML = usr.name;
        // usre.innerHTML = usr.email;
        usrpp.src = usr.img;
        // usrid.innerHTML = usr.id;
    }
}

// for now, run once document is loaded...
document.onload = userUI.display();