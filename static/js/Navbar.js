//only run this code when the html page is fully loaded, to prevent accessing elements that aren't ready
document.addEventListener("DOMContentLoaded", function () { 
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser")); // get current user as a string then convert it into js object
    let navLinks = document.getElementById("nav-links"); // get the ul with the navbar links


    if (currentUser?.role) {
        document.body.className = currentUser.role; // apply the css body based on currentuser: "user" or "admin"
    }

    if (!navLinks) return;// if the ul is not found stop running the code to prevent runtime errors
    
    else if (currentUser?.role === "user") {  // for user
        navLinks.innerHTML = `
            <li><a href="search.html">Search</a></li>
            <li><a href="books_list.html">View Books</a></li>
            <li><a href="borrowed_books.html">My Borrowed Books</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    } 
    else if (currentUser?.role === "admin") { // for admin
        navLinks.innerHTML = `
            <li><a href="search.html">Search</a></li>
            <li><a href="books_list.html">View Books</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    }

    let welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage && currentUser) {
        welcomeParagraph.style.display = "none";
        if (currentUser.role === "admin") {
            welcomeMessage.textContent = "Welcome Admin!";
        } else {
            welcomeMessage.textContent = "Welcome User!";
        }
    }

});

// logout outside
function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function login(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "search.html";
    } else {
        window.location.href = "search.html";
    }
    } else {
        alert("Invalid login");
    }
}

// SIGNUP FUNCTION
document.getElementById("signupForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let role = document.querySelector('input[name="role"]:checked')?.value;

    if (!role) {
        alert("Please select account type");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert("Email already registered");
        return;
    }

    let newUser = {
        username,
        email,
        password,
        role
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    sessionStorage.setItem("currentUser", JSON.stringify(newUser));

    // redirect
    if (role === "admin") {
        window.location.href = "index.html";
    } else {
        window.location.href = "index.html";
    }
});

// HANDLE LOGIN FORM
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem("currentUser", JSON.stringify(user));

        if (user.role) {
            window.location.href = "index.html";
        } 

    } else {
        alert("Invalid email or password");
    }
});
