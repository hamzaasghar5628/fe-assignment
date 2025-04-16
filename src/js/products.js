class ProductService {
    constructor() {
        this.currentPage = 0;
        this.itemsPerPage = 6;
        this.isLoading = false;
        this.hasMoreProducts = true;
        this.spinner = document.getElementById('spinner');
        this.loadMoreBtn = document.getElementById('loadMore');
        this.PLACEHOLDER_IMAGE = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
    }

    showSpinner() {
        this.spinner.style.display = 'block';
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
    }

    async fetchProducts() {
        try {
            const response = await fetch(
                `http://localhost:9000/products?_page=${this.currentPage}&_limit=${this.itemsPerPage}`
            );
            
            const products = await response.json();
            const totalCount = 30; // Total products in db.json
            
            // Update hasMoreProducts based on total products and current page
            const totalPages = Math.ceil(totalCount / this.itemsPerPage);
            this.hasMoreProducts = this.currentPage < totalPages;
            
            // Update load more button visibility
            this.updateLoadMoreButton();
            
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    updateLoadMoreButton() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = this.hasMoreProducts ? 'block' : 'none';
        }
    }

    createProductElement(product) {
        const article = document.createElement('article');
        article.className = 'product-card';
        
        const img = document.createElement('img');
        img.src = this.PLACEHOLDER_IMAGE;
        img.alt = product.title;
        // Add error handler for broken images
        img.onerror = function() {
            this.src = this.PLACEHOLDER_IMAGE;
            this.alt = 'Product image placeholder';
        };
        
        article.innerHTML = `
            <img src="${img.src}" alt="${img.alt}">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
            <button class="add-to-cart-btn" data-product-id="${product.id}">ADD TO CART</button>
        `;
        return article;
    }

    async loadInitialProducts() {
        this.currentPage = 1;
        const products = await this.fetchProducts();
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Clear existing products
        this.displayProducts(products);
        
        // Show load more button if we have more products
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = 'block';
        }
    }

    async loadMoreProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showSpinner();
        
        try {
            this.currentPage++;
            const products = await this.fetchProducts();
            
            if (products.length > 0) {
                this.displayProducts(products);
            }
            
            // Update button visibility
            if (this.loadMoreBtn) {
                this.loadMoreBtn.style.display = this.hasMoreProducts ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            this.isLoading = false;
            this.hideSpinner();
        }
    }

    displayProducts(products) {
        const productList = document.getElementById('productList');
        products.forEach(product => {
            productList.appendChild(this.createProductElement(product));
        });
    }
}

// Export the class for use in main.js
window.ProductService = ProductService; 