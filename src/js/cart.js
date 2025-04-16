class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.modal = document.getElementById('cartModal');
        this.overlay = document.getElementById('modalOverlay');
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        this.update();
        this.showNotification('Item added to cart!');
    }

    removeItem(productId) {
        console.log(productId);
        this.items = this.items.filter(
          (item) => parseInt(item.id) !== productId
        );
        console.log(
          this.items.filter((item) => parseInt(item.id) !== productId)
        ); 
        this.save();
        this.update();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.save();
            this.update();
        }
    }

    save() {
        console.log(this.items);
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    update() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        let total = 0;

        cartItems.innerHTML = this.items.map(item => {
            total += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="${
                      item.title
                    }">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                        <p class="item-quantity">Qty: ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" data-product-id="${
                      item.id
                    }">Remove</button>
                </div>
            `;
        }).join('');

        // Add event listeners to remove buttons
        const removeButtons = cartItems.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.removeItem(productId);
            });
        });

        cartTotal.textContent = total.toFixed(2);
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    toggle() {
        const isHidden = this.modal.getAttribute('aria-hidden') === 'true';
        this.modal.setAttribute('aria-hidden', !isHidden);
        this.modal.style.display = isHidden ? 'block' : 'none';
        this.overlay.style.display = isHidden ? 'block' : 'none';
        document.body.classList.toggle('modal-open', isHidden);
    }
}

window.Cart = Cart; 