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

    document.querySelectorAll(".product").forEach((product, index) => {
        product.style.setProperty("--order", index);
    });

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
                acc.push({
                    ...item,
                    totalPrice: item.price * item.quantity
                });
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
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70?text=Produs'">
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">${item.quantity} buc - ${item.price} MDL</span>
                </div>
                <span class="item-price">${item.totalPrice.toFixed(2)} MDL</span>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-name="${item.name}">−</button>
                    <button class="remove-item" data-name="${item.name}" aria-label="Remove item">×</button>
                </div>
            `;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
        localStorage.setItem("cart", JSON.stringify(cart));
        cartButton.style.animation = "shake 0.5s ease";
        setTimeout(() => {
            cartButton.style.animation = "";
        }, 500);
    }

    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const productCard = this.closest(".product");
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            const image = productCard.querySelector("img").src;

            if (!name || isNaN(price)) {
                console.error("Invalid product data:", { name, price });
                return;
            }

            const existingItemIndex = cart.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            updateCart();
            productCard.style.transform = "scale(0.95)";
            setTimeout(() => {
                productCard.style.transform = "scale(1)";
            }, 200);

            const originalText = this.textContent;
            this.textContent = "Adăugat!";
            this.style.backgroundColor = "#28a745";
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = "";
            }, 1000);
        });
    });

    cartItems.addEventListener("click", function (e) {
        if (e.target.classList.contains("decrease-quantity")) {
            e.preventDefault();
            const itemName = e.target.getAttribute("data-name");
            const itemIndex = cart.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
            if (itemIndex !== -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    cart.splice(itemIndex, 1);
                }
                updateCart();
            }
        } else if (e.target.classList.contains("remove-item")) {
            e.preventDefault();
            const itemName = e.target.getAttribute("data-name");
            cart = cart.filter(item => item.name.toLowerCase() !== itemName.toLowerCase());
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
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 200);
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
            const productName = product.querySelector('h1').textContent.toLowerCase();
            const productDescription = product.querySelector('p')?.textContent.toLowerCase() || '';
            if (searchTerm === '' || productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                product.style.display = 'flex';
                hasResults = true;
            } else {
                product.style.display = 'none';
            }
        });
        noResultsMessage.classList.toggle('active', !hasResults && searchTerm !== '');
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
        if (this.value === '') {
            performSearch();
        }
    });

    updateCart();
});