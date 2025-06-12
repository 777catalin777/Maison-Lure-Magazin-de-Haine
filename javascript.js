document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartDisplay = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const itemCount = document.getElementById("item-count");
  const cartButton = document.querySelector(".cart-button");
  const cartContent = document.querySelector(".cart-content");
  const clearCartButton = document.querySelector(".clear-cart");
  const noResultsMessage = document.querySelector(".no-results");

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  function updateCart() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartDisplay.textContent = totalQuantity;
    itemCount.textContent = totalQuantity;
    cartDisplay.classList.toggle("hidden", totalQuantity === 0);
    cartItems.innerHTML = "";
    let total = 0;

    const groupedItems = cart.reduce((acc, item) => {
      const existingItem = acc.find(i => i.name.toLowerCase() === item.name.toLowerCase());
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.totalPrice = item.price * existingItem.quantity;
      } else {
        acc.push({ ...item, totalPrice: item.price * item.quantity });
      }
      return acc;
    }, []);

    const cartEmpty = document.getElementById("cart-empty");
    cartEmpty.style.display = totalQuantity === 0 ? "block" : "none";
    cartItems.style.display = totalQuantity === 0 ? "none" : "block";

    groupedItems.forEach(item => {
      total += item.totalPrice;
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="70">
        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">Cantitate: ${item.quantity}</span>
        </div>
        <span class="item-price">${item.totalPrice.toFixed(0)} MDL</span>
        <div class="quantity-controls">
          <button class="decrease-quantity" data-name="${item.name}">−</button>
          <button class="remove-item" data-name="${item.name}">×</button>
        </div>
      `;
      cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(0);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  document.querySelectorAll(".buy-button").forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productCard = this.closest(".product");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const image = productCard.querySelector("img").src;

      const existingItemIndex = cart.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      updateCart();
      showNotification("Produsul a fost adăugat în coș!");
    });
  });

  cartItems.addEventListener("click", function (e) {
    const itemName = e.target.getAttribute("data-name");
    if (e.target.classList.contains("decrease-quantity")) {
      const index = cart.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (index !== -1) {
        cart[index].quantity > 1 ? cart[index].quantity-- : cart.splice(index, 1);
        updateCart();
      }
    } else if (e.target.classList.contains("remove-item")) {
      cart = cart.filter(i => i.name.toLowerCase() !== itemName.toLowerCase());
      updateCart();
    }
  });

  cartButton.addEventListener("click", function (e) {
    e.stopPropagation();
    cartContent.classList.toggle("active");
  });

  document.addEventListener("click", function () {
    cartContent.classList.remove("active");
  });

  cartContent.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  clearCartButton.addEventListener("click", function () {
    cart = [];
    updateCart();
  });

  const searchInput = document.querySelector('input[name="search"]');
  const products = document.querySelectorAll('.product');
  let searchTimeout;

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let hasResults = false;

    products.forEach(product => {
      const name = product.querySelector('h1').textContent.toLowerCase();
      const desc = product.querySelector('p')?.textContent.toLowerCase() || '';
      const match = name.includes(searchTerm) || desc.includes(searchTerm);
      product.style.display = match || searchTerm === '' ? 'flex' : 'none';
      if (match) hasResults = true;
    });

    if (noResultsMessage) {
      noResultsMessage.classList.toggle('active', !hasResults && searchTerm !== '');
    }
  }

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
  });

  document.querySelector('.search-form button').addEventListener('click', function (e) {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('search', function () {
    if (this.value === '') performSearch();
  });

  updateCart();
});