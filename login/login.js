function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function loginGo() {
    document.getElementById("loginBtn").innerHTML = "Connexion...";

    let url = document.getElementById("login_url").value;
    if(url === "other") {
        url = document.getElementById("urlCustom").value;
    }

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let cas = document.getElementById("ent").value;

    $.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://159.223.233.152:6858/auth?url=${url}&username=${username}&password=${password}&cas=${cas}&rand=${uuidv4()}`)}`, function( data ) {
        let resp = JSON.parse(data.contents);
        if(resp.code == 3) {
            alert("Identifiants incorrects.");
            document.getElementById("loginBtn").innerHTML = "Se connecter";
        }
        else if(resp.message !== undefined) {
            alert("Remplissez toutes les informations.");
            document.getElementById("loginBtn").innerHTML = "Se connecter";
        }
        else if(resp.token !== undefined) {
            localStorage.setItem('authToken', resp.token);

            let authData = [url, username, password, cas];
            localStorage.setItem('authData', JSON.stringify(authData));

            window.location.href = "../index.html";
        }
    });
}

function checkURL() {
    if(document.getElementById("login_url").value == "other") {
        document.getElementById("urlCustom").style.display = "block";
    }
    else {
        document.getElementById("urlCustom").style.display = "none";
    }
}

setTimeout(() => {
    if(localStorage.getItem('authData') !== undefined) {
        let auth = JSON.parse(localStorage.getItem('authData'));
        document.getElementById("username").value = auth[1];
        document.getElementById("password").value = auth[2];
        document.getElementById("urlCustom").value = auth[0];
        document.getElementById("login_url").value = "other";
        document.getElementById("ent").value = auth[3];
        loginGo();
    }
}, 150);