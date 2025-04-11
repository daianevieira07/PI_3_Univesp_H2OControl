document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "http://localhost:8000/api";

  // Email login form submission
  const emailLoginForm = document.getElementById("email-login-form");
  emailLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Get JWT token directly (não precisamos mais buscar o usuário primeiro)
      const tokenResponse = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.detail || "Credenciais inválidas");
      }

      const tokens = await tokenResponse.json();
      
      // Store tokens
      localStorage.setItem("h2ocontrol_access_token", tokens.access);
      localStorage.setItem("h2ocontrol_refresh_token", tokens.refresh);
      
      // Get user info
      const userResponse = await fetch(`${API_URL}/usuarios/me/`, {
        headers: {
          "Authorization": `Bearer ${tokens.access}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem("h2ocontrol_user", JSON.stringify(userData));
      }
      
      loginSuccessful();
    } catch (error) {
      console.error("Erro no login:", error);
      showError("Erro ao fazer login. Verifique suas credenciais.");
    }
  });

  // Google login - to be implemented later
  const googleLogin = document.getElementById("google-login");
  googleLogin.addEventListener("click", function () {
    showInfo("Login com Google será implementado em breve!");
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
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById("register-confirm-password");
  
  // Add real-time password validation
  passwordInput.addEventListener("input", validatePasswords);
  confirmPasswordInput.addEventListener("input", validatePasswords);
  
  function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Remove any existing password error messages
    const existingErrors = document.querySelectorAll(".password-error");
    existingErrors.forEach(error => error.remove());
    
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        showPasswordError("As senhas não coincidem");
      } else if (password.length < 8) {
        showPasswordError("A senha deve ter pelo menos 8 caracteres");
      }
    }
  }
  
  function showPasswordError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "password-error";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    errorDiv.style.marginTop = "5px";
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = confirmPasswordInput.parentElement.querySelector(".password-error");
    if (existingError) {
      existingError.remove();
    }
    
    confirmPasswordInput.parentElement.appendChild(errorDiv);
  }

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;

    try {
      // Create new user
      const response = await fetch(`${API_URL}/usuarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          login: email,
          password: password,
          password_confirm: confirmPassword
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error("Erro ao parsear resposta:", e);
        console.error("Resposta do servidor:", await response.text());
        throw new Error("Erro ao processar resposta do servidor");
      }

      if (!response.ok) {
        let errorMessage = "Erro ao criar conta:";
        
        if (responseData && typeof responseData === 'object') {
          Object.entries(responseData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessage += `\n${field}: ${errors.join(', ')}`;
            } else if (typeof errors === 'string') {
              errorMessage += `\n${field}: ${errors}`;
            }
          });
        } else {
          errorMessage += "\n" + (responseData?.detail || "Tente novamente mais tarde.");
        }
        
        throw new Error(errorMessage);
      }

      // If we get here, the account was created successfully
      showSuccess("Conta criada com sucesso! Você já pode fazer login.");
      registerModal.style.display = "none";
      registerForm.reset();
      
      // Auto-fill login form
      document.getElementById("email").value = email;
      document.getElementById("password").value = password;
    } catch (error) {
      console.error("Erro no registro:", error);
      showError(error.message);
    }
  });

  // Forgot password link
  const forgotPassword = document.querySelector(".forgot-password");
  forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();
    showInfo("Funcionalidade de recuperação de senha será implementada em breve!");
  });

  // Helper functions
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    showNotification(errorDiv);
  }

  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    showNotification(successDiv);
  }

  function showInfo(message) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'alert alert-info';
    infoDiv.textContent = message;
    showNotification(infoDiv);
  }

  function showNotification(element) {
    // Remove any existing notifications
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Add the new notification
    document.body.appendChild(element);

    // Position it at the top of the page
    element.style.position = 'fixed';
    element.style.top = '20px';
    element.style.left = '50%';
    element.style.transform = 'translateX(-50%)';
    element.style.zIndex = '1000';
    element.style.padding = '15px 30px';
    element.style.borderRadius = '5px';
    element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // Auto-remove after 5 seconds
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.5s ease-in-out';
      setTimeout(() => element.remove(), 500);
    }, 5000);
  }

  function loginSuccessful() {
    localStorage.setItem("h2ocontrol_authenticated", "true");
    window.location.href = "index.html";
  }

  // Check if we should redirect the user back to login
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("logout") === "true") {
    localStorage.clear();
    showInfo("Você foi desconectado com sucesso.");
  } else if (urlParams.get("session_expired") === "true") {
    showError("Sua sessão expirou. Por favor, faça login novamente.");
  }

  // Check if the user is already logged in
  const token = localStorage.getItem("h2ocontrol_access_token");
  if (token) {
    const stayLoggedIn = confirm("Você já está conectado. Deseja continuar?");
    if (stayLoggedIn) {
      window.location.href = "index.html";
    } else {
      localStorage.clear();
    }
  }
});
