
document.addEventListener("DOMContentLoaded", function () {
  const pswdBtn = document.querySelector("#pswdBtn");
  const pswInput = document.getElementById("password"); // match the HTML id

  pswdBtn.addEventListener("click", function () {
    const type = pswInput.getAttribute("type");

    if (type === "password") {
      pswInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide Password";
    } else {
      pswInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show Password";
    }
  });
});



// function togglePasswordVisibility() {
//   const passwordInput = document.getElementById("account_password")
//   const toggleButton = document.getElementById("togglePassword")

//   if (passwordInput.type === "password") {
//     passwordInput.type = "text"
//     toggleButton.textContent = "Hide Password"
//   } else {
//     passwordInput.type = "password"
//     toggleButton.textContent = "Show Password"
//   }
// }
