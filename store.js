const Store = {
    state: {
        products: [],
        filteredProducts: [],
        cart: [],
        wishlist: [],
        currentUser: null,
        isAdmin: false,
        currentPage: 1,
        itemsPerPage: 24,
        searchQuery: '',
        currentCategory: 'all',
        users: [],
        orders: [],
        recentlyViewed: []
    },

    init() {
        // Load products
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            
            // Veri Senkronizasyonu: data.js dosyasındaki her değişikliği algıla
            // Stringify karşılaştırması en garantisidir (id, resim, açıklama her şeyi kapsar)
            const isDataChanged = window.initialProducts && JSON.stringify(window.initialProducts) !== savedProducts;

            if (isDataChanged) {
                console.log("Veri değişikliği algılandı, güncelleniyor...");
                this.state.products = window.initialProducts || [];
                this.saveProducts();
            } else {
                this.state.products = parsed;
            }
        } else {
            this.state.products = window.initialProducts || [];
            this.saveProducts();
        }

        // Load cart
        const savedCart = localStorage.getItem('cart');
        if (savedCart) this.state.cart = JSON.parse(savedCart);

        // Load wishlist
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) this.state.wishlist = JSON.parse(savedWishlist);

        // Load user
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.state.currentUser = JSON.parse(savedUser);
            this.state.isAdmin = this.state.currentUser.role === 'admin';
        }

        // Load current page
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) this.state.currentPage = parseInt(savedPage);

        // Load users
        const savedUsers = localStorage.getItem('users_db');
        if (savedUsers) {
            this.state.users = JSON.parse(savedUsers);
        } else {
            // Default admin
            const admin = { name: 'Özcan Admin', email: 'admin@ozcan.com', password: 'admin123', role: 'admin' };
            this.state.users = [admin];
            localStorage.setItem('users_db', JSON.stringify(this.state.users));
        }

        // Load orders
        const savedOrders = localStorage.getItem('orders_db');
        if (savedOrders) this.state.orders = JSON.parse(savedOrders);

        // Load recently viewed
        const savedViewed = localStorage.getItem('viewed_db');
        if (savedViewed) this.state.recentlyViewed = JSON.parse(savedViewed);

        this.applyFilters();
    },

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.state.products));
    },

    savePage() {
        localStorage.setItem('currentPage', this.state.currentPage);
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.state.wishlist));
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    },

    // Actions
    addToCart(product, quantity = 1) {
        const index = this.state.cart.findIndex(item => item.id === product.id);
        if (index > -1) {
            this.state.cart[index].quantity += quantity;
        } else {
            this.state.cart.push({ ...product, quantity });
        }
        this.saveCart();
        if (window.App) window.App.showToast(`${product.name} sepete eklendi!`, 'shopping-cart');
    },

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCart();
        if (window.App) window.App.showToast(`Ürün sepetten çıkarıldı.`, 'trash-2');
    },

    updateCartQuantity(productId, delta) {
        const index = this.state.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            this.state.cart[index].quantity += delta;
            if (this.state.cart[index].quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    },

    toggleWishlist(product) {
        const index = this.state.wishlist.findIndex(item => item.id === product.id);
        if (index > -1) {
            this.state.wishlist.splice(index, 1);
        } else {
            this.state.wishlist.push(product);
        }
        this.saveWishlist();
        const msg = index > -1 ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi!';
        if (window.App) window.App.showToast(msg, 'heart');
    },

    // Filtering & Searching
    setCategory(category) {
        this.state.currentCategory = category;
        this.state.currentPage = 1;
        this.savePage();
        this.applyFilters();
    },

    setSearch(query) {
        this.state.searchQuery = query.toLowerCase();
        this.state.currentPage = 1;
        this.savePage();
        this.applyFilters();
    },

    applyFilters() {
        let filtered = [...this.state.products];

        if (this.state.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.state.currentCategory);
        }

        if (this.state.searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(this.state.searchQuery) ||
                p.brand.toLowerCase().includes(this.state.searchQuery)
            );
        }

        this.state.filteredProducts = filtered;
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    },

    getPaginatedProducts() {
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        return this.state.filteredProducts.slice(start, end);
    },

    getTotalPages() {
        return Math.ceil(this.state.filteredProducts.length / this.state.itemsPerPage);
    },

    // Admin Actions
    addProduct(product) {
        const newProduct = { ...product, id: Date.now() };
        this.state.products.push(newProduct);
        this.saveProducts();
        this.applyFilters();
    },

    deleteProduct(id) {
        this.state.products = this.state.products.filter(p => p.id !== id);
        this.saveProducts();
        this.applyFilters();
    },

    // Auth Actions
    register(name, email, password) {
        const exists = this.state.users.find(u => u.email === email);
        if (exists) return { success: false, message: 'Bu e-posta zaten kayıtlı.' };

        const newUser = { name, email, password, role: 'user' };
        this.state.users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(this.state.users));
        
        // Auto-login
        this.login(email, password);
        return { success: true };
    },

    login(email, password) {
        const user = this.state.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.state.currentUser = user;
            this.state.isAdmin = user.role === 'admin';
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.dispatchEvent(new CustomEvent('authUpdated'));
            return true;
        }
        return false;
    },

    logout() {
        this.state.currentUser = null;
        this.state.isAdmin = false;
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new CustomEvent('authUpdated'));
    },

    // New Professional Features
    saveOrder(orderData) {
        const order = {
            id: 'GZC-' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString('tr-TR'),
            userEmail: this.state.currentUser ? this.state.currentUser.email : 'misafir',
            ...orderData
        };
        this.state.orders.push(order);
        localStorage.setItem('orders_db', JSON.stringify(this.state.orders));
        return order.id;
    },

    addToRecentlyViewed(product) {
        let viewed = [...this.state.recentlyViewed];
        viewed = viewed.filter(p => p.id !== product.id);
        viewed.unshift(product);
        if (viewed.length > 5) viewed.pop();
        this.state.recentlyViewed = viewed;
        localStorage.setItem('viewed_db', JSON.stringify(viewed));
    },

    clearCart() {
        this.state.cart = [];
        this.saveCart();
    }
};

window.Store = Store;
Store.init();
