// Shopping Cart Functionality
let cart = [];
let cartTotal = 0;

// Product data
const products = {
    smartphone: { name: 'Ultra Pro Smartphone', price: 899, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97' },
    laptop: { name: 'MacBook Pro M3', price: 1599, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a0a6' },
    headphones: { name: 'AirPods Pro Max', price: 449, image: 'https://images.unsplash.com/photo-1505740106531-4243f3831145' },
    watch: { name: 'Apple Watch Ultra', price: 699, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12' }
};

// Add to cart function
function addToCart(productId, price) {
    const product = products[productId];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        updateCartUI();
        showNotification('Cart updated!');
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Item removed from cart');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart modal or checkout page
    if (document.getElementById('cartItems')) {
        if (window.location.pathname.includes('checkout.html')) {
            updateCheckoutUI();
        } else {
            updateCartModal();
        }
    }
    
    // Save cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--muted-foreground); padding: 2rem;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius);">
                    <div>
                        <h4 style="margin-bottom: 0.25rem;">${item.name}</h4>
                        <p style="color: var(--muted-foreground); font-size: 0.9rem;">Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 600; color: var(--primary);">$${(item.price * item.quantity).toLocaleString()}</p>
                    <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: var(--destructive); cursor: pointer; font-size: 0.8rem;">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    cartTotalElement.textContent = cartTotal.toLocaleString();
}

// Update checkout UI
function updateCheckoutUI() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const summarySubtotalElement = document.getElementById('summarySubtotal');
    const summaryTotalElement = document.getElementById('summaryTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--muted-foreground); padding: 2rem;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', this.value)">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
    
    const shipping = 20;
    cartSubtotalElement.textContent = cartTotal.toLocaleString();
    summarySubtotalElement.textContent = `$${cartTotal.toLocaleString()}`;
    summaryTotalElement.textContent = `$${(cartTotal + shipping).toLocaleString()}`;
}

// Show cart modal
function showCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('active');
    updateCartModal();
}

// Close cart modal
function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Redirecting to checkout...', 'success');
    sessionStorage.setItem('cart', JSON.stringify(cart));
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

// Submit order
function submitOrder(event) {
    event.preventDefault();
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Order placed successfully!', 'success');
    setTimeout(() => {
        cart = [];
        sessionStorage.removeItem('cart');
        updateCartUI();
        window.location.href = 'index.html';
    }, 2000);
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing!', 'success');
        event.target.reset();
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Header scroll effect
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Initialize animations for elements in viewport
function initAnimations() {
    const elements = document.querySelectorAll('.product-card, .benefit-card, .testimonial-card, .checkout-cart, .checkout-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from sessionStorage
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Add click event to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.location.pathname.includes('checkout.html')) {
                window.location.href = 'index.html';
            } else {
                showCart();
            }
        });
    }
    
    // Add click event to hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Close modal when clicking outside
    const modal = document.getElementById('cartModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCart();
            }
        });
    }
    
    // Initialize animations
    initAnimations();
    
    // Initialize cart UI
    updateCartUI();
    
    console.log('[v0] E-commerce page initialized successfully');
});

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('animated') ? 'translateY(0) scale(1)' : 'translateY(20px)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-add-cart');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});