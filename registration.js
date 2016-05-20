function getXmlHttp() {
    var xmlhttp;

    try {
        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
    } catch(e) {
        try {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp; 
}


function CheckLogin() {
    var container = document.getElementById('loginError');
    var logVal = document.getElementById('inputUsername').value;

    if(logVal.trim().length == 0) {
        container.innerHTML ='The field is empty';
        return false;
    }
    if(/^[a-zA-Z1-9]+$/.test(logVal) === false) {
        container.innerHTML ='Login must contain only letters';
        return false;
    }
    if(/\s/.test(logVal) === true) {
        container.innerHTML ='Login should not contain spaces';
        return false;
    }
    if(logVal.length < 4 || logVal.length > 20) {
        container.innerHTML ='Login must be between 4 and 20 characters';
        return false;
    }
    if(parseInt(logVal.substr(0, 1))) {
        container.innerHTML ='Login must begin with a letter';
        return false;
    }

    container.innerHTML = "";
    return true;
}


function CheckPass() {
    var errorPass = document.getElementById('passError');
    var pass = document.getElementById('inputPassword').value;
    if(pass.trim().length == 0) {
        errorPass.innerHTML = "The field is empty";
        return false;
    }

    if (pass.length < 6) {
        errorPass.innerHTML = "The password should be at least 6 characters";
        return false;        
    }
    if (!/[a-z]/.test(pass) || !/[0-9]/.test(pass)) {
        errorPass.innerHTML = "The password must contain a letter and a number";
        return false;
    }

    errorPass.innerHTML = "";
    return true;
}


function LogIn() {
    if(!CheckLogin() || !CheckPass()) {
        return;
    }

    var btn = document.getElementById('btnSignIn');
    btn.disabled = true;

    var errorPass = document.getElementById('passError');
    var req = getXmlHttp(); // создать объект для запроса к серверу
    if(req) {
        req.onreadystatechange = function() {
            if(req.readyState == 4) {  // если запрос закончил выполняться 
                if(req.status == 200) {
                    if(req.responseText != "ok") {
                        errorPass.innerHTML = req.responseText;
                        btn.disabled = false;
                    }
                    else {
                        location.replace("notes.html");
                    }
                }
                else alert(req.statusText);
            }
        }
        req.open("POST", 'Check.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = "login=" + document.getElementById('inputUsername').value + "&pass=" + document.getElementById('inputPassword').value + "&aim=signIn";
        req.send(params); // отослать запрос
    }
    else {
        alert("Браузер не поддерживает AJAX");
    }
}


function SignUp() {
    if(!CheckLogin() || !CheckPass()) {
        return;
    }

    if(document.getElementById('inputPassword').value != document.getElementById('RepPassword').value) {
        document.getElementById('passRepError').innerHTML = "Passwords don't match";
        return;
    }
    else {
        document.getElementById('passRepError').innerHTML = "";
    }

    var btn = document.getElementById('btnSignUp');
    btn.disabled = true;

    var errorPass = document.getElementById('passRepError');
    var req = getXmlHttp(); // создать объект для запроса к серверу
    if(req) {
        req.onreadystatechange = function() {
            if(req.readyState == 4) {  // если запрос закончил выполняться 
                if(req.status == 200) {
                    if(req.responseText != "ok") {
                        errorPass.innerHTML = req.responseText;
                        btn.disabled = false;
                    }
                    else {
                        location.replace("notes.html");
                    }
                }
                else alert(req.statusText);
            }
        }
        req.open("POST", 'Check.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = "login=" + document.getElementById('inputUsername').value + "&pass=" + document.getElementById('inputPassword').value + "&aim=signUp";
        req.send(params); // отослать запрос
    }
    else {
        alert("Браузер не поддерживает AJAX");
    }
}


function CheckForAuthorization() {
    var req = getXmlHttp();
    if(req) {
        req.onreadystatechange = function() {
            if(req.readyState == 4) {  // если запрос закончил выполняться 
                if(req.status == 200) {
                    if(req.responseText != "Error") {
                        location.replace("notes.html");
                    }
                }
                else alert(req.statusText);
            }   
        }

        req.open("POST", 'Check.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send("aim=checkAutorization"); // отослать запрос
    }
    else {
        alert("Браузер не поддерживает AJAX");
    }
}