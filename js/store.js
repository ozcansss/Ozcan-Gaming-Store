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
        recentlyViewed: [],
        compare: [],
        discountRate: 0,
        sortBy: 'default',
        minPrice: 0,
        maxPrice: Infinity,
        builder: { cpu: null, mainboard: null, ram: null, gpu: null, storage: null, cooling: null, psu: null, case: null }
    },

    init() {
        // Load products
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            
            // Veri Senkronizasyonu: Sadece yeni ürün eklendiğinde güncelle (yorumların silinmemesi için)
            const isDataChanged = window.initialProducts && window.initialProducts.length !== parsed.length;

            if (isDataChanged) {
                console.log("Yeni ürünler algılandı, veritabanı eşitleniyor...");
                // Eski ürünlerdeki yorumları koruyarak yeni listeyi oluştur
                const mergedProducts = window.initialProducts.map(initialProduct => {
                    const savedProduct = parsed.find(p => p.id === initialProduct.id);
                    if (savedProduct && savedProduct.comments) {
                        initialProduct.comments = savedProduct.comments;
                    }
                    return initialProduct;
                });
                this.state.products = mergedProducts;
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

        const savedUsers = localStorage.getItem('users_db');
        if (savedUsers) {
            let parsedUsers = JSON.parse(savedUsers);
            parsedUsers = parsedUsers.filter(u => u.role !== 'admin'); // Tüm eski adminleri temizle
            const admin = { name: 'Erol Özcan', email: 'erolozcan954@gmail.com', password: 'ozocan10', role: 'admin' };
            parsedUsers.push(admin);
            this.state.users = parsedUsers;
            localStorage.setItem('users_db', JSON.stringify(this.state.users));
        } else {
            const admin = { name: 'Erol Özcan', email: 'erolozcan954@gmail.com', password: 'ozocan10', role: 'admin' };
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
        
        if (window.App) {
            window.App.showToast(`${product.name} sepete eklendi!`, 'shopping-cart');
            // Çapraz satış penceresini (Bunu alanlar bunu da aldı) tetikle
            setTimeout(() => {
                if(typeof window.App.showCrossSell === 'function') window.App.showCrossSell(product);
            }, 500);
        }
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

        // Fiyat Filtresi
        filtered = filtered.filter(p => p.price >= this.state.minPrice && p.price <= this.state.maxPrice);

        // Sıralama
        if (this.state.sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (this.state.sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
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

    login(email, pass) {
        // Doğrudan eşleşme kontrolü (Kopyala/yapıştır boşluk hatalarına karşı .trim() ile de temizlendi)
        const cleanEmail = email.trim();
        const cleanPass = pass.trim();
        
        const user = this.state.users.find(u => u.email === cleanEmail && u.password === cleanPass);
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
    },

    toggleCompare(product) {
        const index = this.state.compare.findIndex(p => p.id === product.id);
        if (index > -1) {
            this.state.compare.splice(index, 1);
        } else {
            if (this.state.compare.length >= 3) {
                if(window.App) window.App.showToast('En fazla 3 ürün karşılaştırabilirsiniz!', 'alert-triangle');
                return;
            }
            this.state.compare.push(product);
        }
        window.dispatchEvent(new CustomEvent('compareUpdated'));
    },

    removeFromCompare(id) {
        this.state.compare = this.state.compare.filter(p => p.id !== id);
        window.dispatchEvent(new CustomEvent('compareUpdated'));
    },

    applyDiscountCode(code) {
        const validCodes = ['GAMER10', 'OZCAN10'];
        if (validCodes.includes(code.toUpperCase())) {
            this.state.discountRate = 0.10; // %10 indirim
            return true;
        } else if (code.toUpperCase() === 'CILGINYUZDE50') {
            this.state.discountRate = 0.50; // %50 indirim
            return true;
        }
        this.state.discountRate = 0;
        return false;
    }
};

window.Store = Store;
Store.init();
