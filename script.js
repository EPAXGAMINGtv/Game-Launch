function login() {
    document.getElementById("usernameInput").style.display = "block";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("logoutButton").style.display = "inline-block";
    document.getElementById("username").value = ""; 
}

function logout() {
    document.getElementById("usernameDisplay").style.display = "none";
    document.getElementById("usernameDisplay").textContent = "";
    document.getElementById("usernameInput").style.display = "none";
    document.getElementById("loginButton").style.display = "inline-block";
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("username").value = ""; 
}

function submitUsername() {
    const username = document.getElementById("username").value.trim();
    if (username.length > 0) {
        document.getElementById("usernameDisplay").textContent =   username;
        document.getElementById("usernameDisplay").style.display = "block";
        document.getElementById("usernameInput").style.display = "none";
    } else {
        alert("Username");
    }
}


document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("submitUsername").addEventListener("click", submitUsername);

function gotoTetris() {
    window.location.href = "Tetris.html";
}

function gotoHome() {
    window.location.replace("index.html");
}

function gotoPong() {
    window.location.href = "Pong.html";
}
