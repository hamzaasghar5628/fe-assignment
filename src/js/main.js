document.addEventListener('DOMContentLoaded', () => {
    // Add type declarations to fix linter errors
    /** @type {import('./productsoducts').ProductService} */
    const productService = new window.ProductService();
    /** @type {import('./cart').Cart} */
    const cart = new window.Cart();

    // Initial product load
    productService.loadInitialProducts();
    cart.update();

    // Event Listeners
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            productService.loadMoreProducts();
        });
        
        // Ensure button is visible initially
        loadMoreBtn.style.display = 'block';
    }

    document.getElementById('cartButton').addEventListener('click', () => {
        cart.toggle();
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        cart.toggle();
    });

    // Close modal when clicking overlay
    document.getElementById('modalOverlay').addEventListener('click', () => {
        cart.toggle();
    });

    // Event delegation for product list
    document.getElementById('productList').addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            const response = await fetch(`http://localhost:9000/products/${productId}`);
            const product = await response.json();
            cart.addItem(product);
        }
    });

    // Event delegation for cart items
    document.getElementById('cartItems').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            cart.removeItem(productId);
        } else if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
            const item = cart.items.find(item => item.id === productId);
            if (!item) return;
            
            const action = e.target.dataset.action;
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            cart.updateQuantity(productId, newQuantity);
        }
    });
});