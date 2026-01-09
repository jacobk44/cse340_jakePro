const menuButton = document.querySelector("#myButton");
const navElement = document.querySelector("#animateme");
menuButton.addEventListener("click", () => {
    navElement.classList.toggle("open");
    menuButton.classList.toggle("open");
});


