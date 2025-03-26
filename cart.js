// Cart functionality for the General Store website

// Cart object to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('subtotal');
const cartDelivery = document.getElementById('delivery');
const cartTotal = document.getElementById('total');
const proceedCheckoutBtn = document.getElementById('proceed-checkout');
const placeOrderBtn = document.getElementById('place-order');
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const orderedItemsContainer = document.getElementById('ordered-items');
const orderTotal = document.getElementById('order-total');
const deliveryAddress = document.getElementById('delivery-address');
const paymentMethod = document.getElementById('payment-method');
const deliveryDate = document.getElementById('delivery-date');

// Add to cart functionality
function setupAddToCart() {
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, you'd get the product ID from the button/data attribute
            const productCard = this.closest('.product-card');
            const productId = productCard ? productCard.dataset.id : 1;
            
            // Find the product (in a real app, you'd fetch from API)
            const product = products.find(p => p.id == productId) || products[0];
            const quantity = document.getElementById('quantity') ? parseInt(document.getElementById('quantity').value) : 1;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count in header
            updateCartCount();
            
            // Show confirmation
            alert(`${quantity} ${product.name} added to cart!`);
        });
    });
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    } else {
        // Create cart count if it doesn't exist
        const header = document.querySelector('header');
        if (header) {
            const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                const cartLink = document.createElement('a');
                cartLink.href = 'cart.html';
                cartLink.className = 'cart-link';
                cartLink.innerHTML = `Cart (<span id="cart-count">${totalItems}</span>)`;
                authButtons.insertBefore(cartLink, authButtons.firstChild);
            }
        }
    }
}

// Display cart items
function displayCartItems() {
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="categories.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = '';
            
            cart.forEach(item => {
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="item-price">₹${item.price}</p>
                            <div class="quantity-selector">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="item-quantity">
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    const quantityInput = this.nextElementSibling;
                    let quantity = parseInt(quantityInput.value);
                    
                    if (quantity > 1) {
                        quantityInput.value = quantity - 1;
                        updateCartItem(itemId, quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    const quantityInput = this.previousElementSibling;
                    const quantity = parseInt(quantityInput.value) + 1;
                    
                    quantityInput.value = quantity;
                    updateCartItem(itemId, quantity);
                });
            });
            
            document.querySelectorAll('.item-quantity').forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    const quantity = parseInt(this.value) || 1;
                    
                    this.value = quantity; // Ensure it's at least 1
                    updateCartItem(itemId, quantity);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    removeCartItem(itemId);
                });
            });
        }
        
        // Calculate and display totals
        calculateCartTotals();
    }
}

// Update cart item quantity
function updateCartItem(itemId, quantity) {
    const item = cart.find(item => item.id == itemId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateCartTotals();
        updateCartCount();
    }
}

// Remove item from cart
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Calculate cart totals
function calculateCartTotals() {
    if (cartSubtotal && cartDelivery && cartTotal) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const delivery = subtotal > 500 ? 0 : 50; // Free delivery for orders over ₹500
        
        cartSubtotal.textContent = `₹${subtotal}`;
        cartDelivery.textContent = `₹${delivery}`;
        cartTotal.textContent = `₹${subtotal + delivery}`;
    }
}

// Display checkout items
function displayCheckoutItems() {
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemHTML = `
                <div class="checkout-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            `;
            checkoutItemsContainer.innerHTML += itemHTML;
        });
        
        // Calculate and display total
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const delivery = subtotal > 500 ? 0 : 50;
        checkoutTotal.textContent = `₹${subtotal + delivery}`;
    }
}

// Display order confirmation
function displayOrderConfirmation() {
    if (orderedItemsContainer && orderTotal && deliveryAddress && paymentMethod && deliveryDate) {
        // In a real app, you'd get this data from the order confirmation
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const delivery = subtotal > 500 ? 0 : 50;
        const total = subtotal + delivery;
        
        // Display ordered items
        orderedItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemHTML = `
                <div class="ordered-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            `;
            orderedItemsContainer.innerHTML += itemHTML;
        });
        
        // Display totals and details
        orderTotal.textContent = `₹${total}`;
        deliveryAddress.textContent = '123 Main Street, City, State - 123456';
        paymentMethod.textContent = 'Cash on Delivery';
        
        // Set delivery date (tomorrow 3-6 PM)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
        deliveryDate.textContent = `Tomorrow, 3-6 PM`;
        
        // Clear the cart after order is placed
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// Proceed to checkout
if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some items before checkout.');
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// Place order
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function() {
        // In a real app, you'd validate the form and process payment
        const deliveryForm = document.getElementById('delivery-form');
        if (deliveryForm.checkValidity()) {
            // Generate random order ID
            const orderId = 'GS' + Math.floor(1000 + Math.random() * 9000);
            
            // Redirect to confirmation page with order ID
            window.location.href = `order-confirmation.html?order=${orderId}`;
        } else {
            alert('Please fill in all required delivery details.');
        }
    });
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    setupAddToCart();
    displayCartItems();
    displayCheckoutItems();
    displayOrderConfirmation();
    updateCartCount();
    
    // Set up payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    if (paymentOptions) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                const paymentDetails = document.getElementById('payment-details');
                if (this.value === 'card') {
                    paymentDetails.innerHTML = `
                        <div class="form-group">
                            <label for="card-number">Card Number</label>
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                        </div>
                        <div class="form-group">
                            <label for="card-expiry">Expiry Date</label>
                            <input type="text" id="card-expiry" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="card-cvv">CVV</label>
                            <input type="text" id="card-cvv" placeholder="123">
                        </div>
                    `;
                } else if (this.value === 'upi') {
                    paymentDetails.innerHTML = `
                        <div class="form-group">
                            <label for="upi-id">UPI ID</label>
                            <input type="text" id="upi-id" placeholder="yourname@upi">
                        </div>
                    `;
                } else if (this.value === 'netbanking') {
                    paymentDetails.innerHTML = `
                        <div class="form-group">
                            <label for="bank">Select Bank</label>
                            <select id="bank">
                                <option value="">Select your bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                            </select>
                        </div>
                    `;
                } else {
                    paymentDetails.innerHTML = '<p>Pay when your order is delivered.</p>';
                }
            });
        });
    }
});