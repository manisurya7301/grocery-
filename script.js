// Main JavaScript file for the General Store website

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const proceedCheckoutBtn = document.getElementById('proceed-checkout');
const placeOrderBtn = document.getElementById('place-order');

// Sample product data (in a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Premium Basmati Rice",
        price: 199,
        category: "groceries",
        image: "images/rice.jpg",
        description: "5kg pack of premium quality basmati rice, perfect for biryani and pulao.",
        rating: 4.5
    },
    {
        id: 2,
        name: "Potato Chips",
        price: 35,
        category: "snacks",
        image: "images/chips.jpg",
        description: "Crunchy and delicious potato chips, salted flavor.",
        rating: 4.2
    },
    {
        id: 3,
        name: "Mineral Water Bottle",
        price: 20,
        category: "beverages",
        image: "images/water.jpg",
        description: "1 liter mineral water bottle, pure and refreshing.",
        rating: 4.0
    },
    {
        id: 4,
        name: "Dishwashing Liquid",
        price: 85,
        category: "household",
        image: "images/dishwash.jpg",
        description: "Effective dishwashing liquid that cuts through grease easily.",
        rating: 4.3
    }
];

// Featured Products (on homepage)
function displayFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured .products');
    if (featuredContainer) {
        // Display first 4 products as featured
        const featuredProducts = products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productHTML = `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="rating">
                            ${getStarRating(product.rating)}
                            <span>(${product.rating})</span>
                        </div>
                        <p class="price">₹${product.price}</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
            featuredContainer.innerHTML += productHTML;
        });
    }
}

// Helper function to create star rating
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Display products on categories page
function displayAllProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        products.forEach(product => {
            const productHTML = `
                <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="rating">
                            ${getStarRating(product.rating)}
                            <span>(${product.rating})</span>
                        </div>
                        <p class="price">₹${product.price}</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productHTML;
        });
    }
}

// Filter products by category
function setupCategoryFilters() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Sort products
function setupSorting() {
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            const productsGrid = document.querySelector('.products-grid');
            const productCards = Array.from(document.querySelectorAll('.product-card'));
            
            productCards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', ''));
                
                switch(this.value) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'popular':
                        // In a real app, you would sort by actual popularity
                        return Math.random() - 0.5;
                    case 'newest':
                        // In a real app, you would sort by date added
                        return Math.random() - 0.5;
                    default:
                        return 0;
                }
            });
            
            // Clear the grid and append sorted cards
            productsGrid.innerHTML = '';
            productCards.forEach(card => productsGrid.appendChild(card));
        });
    }
}

// Product details page
function displayProductDetails() {
    const productName = document.getElementById('product-name');
    if (productName) {
        // Get product ID from URL (in a real app)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 1;
        
        // Find the product (in a real app, you'd fetch from API)
        const product = products.find(p => p.id == productId) || products[0];
        
        // Update the page with product details
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `₹${product.price}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('main-image').src = product.image;
        
        // Set up thumbnail click events
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                document.getElementById('main-image').src = thumb.src;
            });
        });
        
        // Display related products (same category)
        const relatedProducts = products.filter(p => p.category === product.category && p.id != product.id);
        const relatedContainer = document.querySelector('.related-products .products');
        
        if (relatedContainer && relatedProducts.length > 0) {
            relatedProducts.forEach(product => {
                const productHTML = `
                    <div class="product-card" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="rating">
                                ${getStarRating(product.rating)}
                                <span>(${product.rating})</span>
                            </div>
                            <p class="price">₹${product.price}</p>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                `;
                relatedContainer.innerHTML += productHTML;
            });
        } else if (relatedContainer) {
            relatedContainer.innerHTML = '<p>No related products found.</p>';
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    displayAllProducts();
    setupCategoryFilters();
    setupSorting();
    displayProductDetails();
    
    // Event listeners
    if (loginBtn) loginBtn.addEventListener('click', () => alert('Login functionality will be added later'));
    if (signupBtn) signupBtn.addEventListener('click', () => alert('Signup functionality will be added later'));
    
    // Add to cart functionality is in cart.js
});