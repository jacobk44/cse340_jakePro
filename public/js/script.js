function togglePasswordVisibility() {
  const passwordInput = document.getElementById("account_password")
  const toggleButton = document.getElementById("togglePassword")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleButton.textContent = "Hide Password"
  } else {
    passwordInput.type = "password"
    toggleButton.textContent = "Show Password"
  }
}
