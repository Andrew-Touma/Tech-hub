// --- Shopping Cart JS ---
const CART_STORAGE_KEY = 'shoppingCart';

// Load cart from localStorage
function loadCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Add item to cart
function addItem(product) {
    const cart = loadCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartDisplay();
}

// Remove item from cart
function removeItem(productId) {
    let cart = loadCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartDisplay();
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartDisplay();
}

// Get total items in cart
function getTotalItems() {
    return loadCart().reduce((sum, item) => sum + item.quantity, 0);
}

// Get total price of cart
function getTotalPrice() {
    return loadCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update cart display (icon or cart page)
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-item-count');
    if (cartCount) cartCount.textContent = getTotalItems();

    // If we are on the shoppingCart.html page, render cart table
    if (window.location.pathname.includes('shoppingCart.html')) {
        renderCartPage();
    }
}

// Render cart items on shoppingCart.html
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');

    if (!container || !totalElement) return;

    const cart = loadCart();
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalElement.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-row d-flex justify-content-between align-items-center py-2 border-bottom';
        row.innerHTML = `
            <div class="d-flex align-items-center">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;margin-right:15px;">` : ''}
                <div>
                    <h5>${item.name}</h5>
                    <p class="text-muted mb-0">Quantity: ${item.quantity}</p>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="price me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-danger btn-sm remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
            </div>
        `;
        container.appendChild(row);
    });

    totalElement.textContent = getTotalPrice().toFixed(2);
}

// Event delegation for buttons
document.addEventListener('click', e => {
    // Add to cart
    if (e.target.classList.contains('add-to-cart-btn')) {
        const product = {
            id: e.target.dataset.productId,
            name: e.target.dataset.productName,
            price: parseFloat(e.target.dataset.productPrice),
            image: e.target.dataset.productImage || ''
        };

        if (!product.id || !product.name || isNaN(product.price)) {
            console.warn('Product missing required data attributes!', product);
            return;
        }

        addItem(product);
    }

    // Remove from cart
    if (e.target.classList.contains('remove-from-cart-btn')) {
        const productId = e.target.dataset.productId;
        if (productId) removeItem(productId);
    }

    // Clear cart
    if (e.target.id === 'clear-cart-btn') {
        clearCart();
    }

    // Submit order
    if (e.target.id === 'submit-order-btn') {
        clearCart();
        alert('Your order has been submitted!');
    }
});

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);
