const h1 = document.querySelector('h1');

const username = localStorage.getItem("username");
console.log(username);

if (username) {
    h1.textContent = "Hej! " + username;
}