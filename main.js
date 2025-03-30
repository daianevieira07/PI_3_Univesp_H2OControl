document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("h2ocontrol_authenticated") !== "true") {
    window.location.href = "login.html";
    return;
  }

  const userElement = document.querySelector(".welcome p");
  if (userElement) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "logout-btn";
    logoutBtn.innerHTML = "Sair";

    const welcomeSection = document.querySelector(".welcome");
    welcomeSection.appendChild(logoutBtn);

    logoutBtn.addEventListener("click", function () {
      if (confirm("Deseja realmente sair?")) {
        localStorage.removeItem("h2ocontrol_authenticated");
        window.location.href = "login.html?logout=true";
      }
    });
  }

  const menuItems = document.querySelectorAll(".menu a");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((menuItem) => {
        menuItem.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
  document.getElementById("new-order").addEventListener("click", function () {
    alert("Formulário de novo pedido");
  });
  document.getElementById("add-product").addEventListener("click", function () {
    addNewProduct();
  });

  function formatDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function addNewProduct() {
    const productName = prompt("Nome do produto:");
    if (!productName) return;

    const quantity = prompt("Quantidade:");
    if (!quantity) return;

    const price = prompt("Valor da compra (R$):");
    if (!price) return;

    const supplier = prompt("Fornecedor:");
    if (!supplier) return;

    const description = prompt("Descrição:");
    if (!description) return;

    const tbody = document.querySelector(".purchases-table tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
          <td>${productName}</td>
          <td>${quantity}</td>
          <td>R$${parseFloat(price).toFixed(2)}</td>
          <td>${supplier}</td>
          <td>${description}</td>
          <td>${formatDate()}</td>
      `;

    tbody.appendChild(newRow);
  }

  const searchButton = document.querySelector(".search-btn");
  searchButton.addEventListener("click", function () {
    const searchTerm = prompt("Digite o nome do cliente:");
    if (searchTerm) {
      alert(`Buscando por cliente: ${searchTerm}`);
      // conectar ao banco de dados
    }
  });

  const dateFields = document.querySelectorAll("td:last-child");
  dateFields.forEach((field) => {
    if (field.textContent.includes("dd/mm/yyyy")) {
      field.textContent = formatDate();
    }
  });
});
