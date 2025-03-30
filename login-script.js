document.addEventListener("DOMContentLoaded", function () {
  // Email login form submission
  const emailLoginForm = document.getElementById("email-login-form");
  emailLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Email validation
    if (!isValidEmail(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Simple password validation
    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Mock authentication - In a real app, this would connect to a backend
    // For demo purposes, we'll just redirect to the main page
    console.log("Login com email:", email);
    loginSuccessful();
  });

  // Google login
  const googleLogin = document.getElementById("google-login");
  googleLogin.addEventListener("click", function () {
    // Ainda precisa fazer o login com o google
    console.log("Iniciando login com Google");

    // Simulate a delay for "authentication"
    setTimeout(function () {
      console.log("Login com Google bem-sucedido");
      loginSuccessful();
    }, 1500);
  });

  // Signup link opens the registration modal
  const signupLink = document.getElementById("signup-link");
  const registerModal = document.getElementById("register-modal");
  const closeModal = document.querySelector(".close-modal");

  signupLink.addEventListener("click", function (e) {
    e.preventDefault();
    registerModal.style.display = "block";
  });

  closeModal.addEventListener("click", function () {
    registerModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", function (e) {
    if (e.target === registerModal) {
      registerModal.style.display = "none";
    }
  });

  // Registration form submission
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    // Validation
    if (name.length < 3) {
      alert("Por favor, insira seu nome completo.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Mock registration - Conectar com backend
    console.log("Novo usuário registrado:", name, email);
    alert("Conta criada com sucesso! Você já pode fazer login.");

    // Close the modal and reset the form
    registerModal.style.display = "none";
    registerForm.reset();
  });

  // Forgot password link
  const forgotPassword = document.querySelector(".forgot-password");
  forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();

    const email = prompt("Digite seu email para redefinir a senha:");
    if (email && isValidEmail(email)) {
      alert(`Um link para redefinir sua senha foi enviado para ${email}`);
    } else if (email) {
      alert("Por favor, insira um email válido.");
    }
  });

  // Helper functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function loginSuccessful() {
    // In a real app, you would store authentication tokens here
    localStorage.setItem("h2ocontrol_authenticated", "true");
    localStorage.setItem("h2ocontrol_lastLogin", new Date().toISOString());

    // Redirect to the main application
    window.location.href = "index.html";
  }

  // Check if we should redirect the user back to login
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("logout") === "true") {
    localStorage.removeItem("h2ocontrol_authenticated");
    alert("Você foi desconectado com sucesso.");
  }

  // Check if the user is already logged in
  if (localStorage.getItem("h2ocontrol_authenticated") === "true") {
    const stayLoggedIn = confirm("Você já está conectado. Deseja continuar?");
    if (stayLoggedIn) {
      window.location.href = "index.html";
    } else {
      localStorage.removeItem("h2ocontrol_authenticated");
    }
  }
});
