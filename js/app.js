const App = {
    categoryNames: {
        all: "Tüm Ürünler",
        gpu: "Ekran Kartı",
        cpu: "İşlemci",
        mainboard: "Anakart",
        ram: "Bellek (RAM)",
        case: "Kasa",
        laptop: "Laptop",
        monitor: "Monitör",
        peripherals: "Ekipmanlar",
        storage: "Depolama",
        wishlist: "Favorilerim"
    },

    init() {
        this.renderAll();
        this.bindEvents();
        this.updateBadges();
        this.updateAuthUI();
    },

    renderAll() {
        this.renderProducts();
        this.renderPagination();
        this.renderCart();
    },

    bindEvents() {
        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            Store.setSearch(e.target.value);
        });

        // Categories
        document.querySelectorAll('#category-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;

                if (category === 'wishlist') {
                    window.location.hash = 'wishlist';
                } else {
                    document.querySelectorAll('#category-list a').forEach(l => l.classList.remove('active'));
                    e.target.classList.add('active');
                    Store.setCategory(category);
                    window.location.hash = 'shop'; // Mağaza sayfasına git
                }
            });
        });

        // Search Autocomplete
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            const matches = Store.state.products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.brand.toLowerCase().includes(query)
            ).slice(0, 6);

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(p => `
                    <div class="search-item" onclick="window.location.hash = 'product/${p.id}'">
                        <img src="${(p.images && p.images[0]) ? p.images[0] : p.image}" alt="${p.name}">
                        <div class="search-item-info">
                            <div class="search-item-name">${p.name}</div>
                            <div class="search-item-price">${p.price.toLocaleString('tr-TR')} TL</div>
                        </div>
                    </div>
                `).join('');
                searchResults.classList.add('active');
            } else {
                searchResults.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Cart Drawer
        const cartBtn = document.getElementById('nav-cart');
        const cartDrawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('overlay');
        const closeCart = document.getElementById('close-cart');

        const toggleCart = () => {
            cartDrawer.classList.toggle('active');
            overlay.classList.toggle('active');
        };

        cartBtn.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        overlay.addEventListener('click', toggleCart);

        // Wishlist Navigation
        document.getElementById('nav-wishlist').addEventListener('click', () => {
            window.location.hash = 'wishlist';
        });

        // Tab Visibility Change (Dynamic Title)
        const originalTitle = document.title;
        window.addEventListener('blur', () => {
            document.title = "Seni Özledik! 🎮 | Özcan Gaming";
        });
        window.addEventListener('focus', () => {
            document.title = originalTitle;
        });

        // Scroll Progress & Scroll To Top
        const scrollBtn = document.getElementById('scroll-to-top');
        const progressBar = document.getElementById('scroll-progress');
        
        window.addEventListener('scroll', () => {
            // Progress Bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (progressBar) progressBar.style.width = scrolled + "%";

            // Scroll Top Button
            if (window.scrollY > 400) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // State changes
        window.addEventListener('productsUpdated', () => {
            this.renderProducts();
            this.renderPagination();
        });

        window.addEventListener('cartUpdated', () => {
            this.renderCart();
            this.updateBadges();
        });

        window.addEventListener('wishlistUpdated', () => {
            this.updateBadges();
            this.renderProducts(); // Kalplerin anlık güncellenmesi için
        });

        window.addEventListener('authUpdated', () => {
            this.updateAuthUI();
        });

        // Routing (Simplistic)
        window.addEventListener('hashchange', () => this.handleRouting());
        this.handleRouting();
    },

    handleRouting() {
        const hash = window.location.hash;
        const main = document.getElementById('main-content');
        
        // Product Detail Route check (e.g., #product/1)
        if (hash.startsWith('#product/')) {
            const productId = parseInt(hash.split('/')[1]);
            this.renderProductDetailPage(main, productId);
            lucide.createIcons();
            return;
        }

        switch (hash) {
            case '#admin':
                this.renderAdminPage(main);
                break;
            case '#login':
                this.renderLoginPage(main);
                break;
            case '#wishlist':
                this.renderWishlistPage(main);
                break;
            case '#contact':
                this.renderContactPage(main);
                break;
            case '#about':
                this.renderAboutPage(main);
                break;
            case '#bank':
                this.renderBankPage(main);
                break;
            case '#warranty':
                this.renderWarrantyPage(main);
                break;
            case '#shipping':
                this.renderShippingPage(main);
                break;
            case '#faq':
                this.renderFAQPage(main);
                break;
            case '#shop':
                this.renderStorePage(main);
                break;
            case '#checkout':
                this.renderCheckoutPage(main);
                break;
            case '#register':
                this.renderRegisterPage(main);
                break;
            case '#orders':
                this.renderOrdersPage(main);
                break;
            default:
                this.renderHomePage(main);
                break;
        }
        lucide.createIcons();
    },

    renderProductDetailPage(container, productId) {
        const product = Store.state.products.find(p => p.id === productId);
        if (!product) {
            container.innerHTML = '<div class="container"><h2>Ürün bulunamadı.</h2></div>';
            return;
        }

        Store.addToRecentlyViewed(product);

        // Stock status
        const isLimited = productId % 7 === 0;
        const stockHTML = isLimited 
            ? '<span class="stock-status stock-low"><i data-lucide="alert-triangle"></i> Son 3 Ürün!</span>'
            : '<span class="stock-status stock-in"><i data-lucide="check"></i> Stokta Var</span>';

        const images = product.images || [product.image];
        
        container.innerHTML = `
            <div class="container" style="padding: 2rem 1rem;">
                <div class="breadcrumbs">
                    <a href="#">Ana Sayfa</a> <span class="breadcrumb-separator">></span>
                    <a href="#shop" onclick="Store.setCategory('${product.category}')">${(App.categoryNames[product.category] || product.category).toUpperCase()}</a> <span class="breadcrumb-separator">></span>
                    <span>${product.name}</span>
                </div>
                <div class="product-detail-grid">
                    <div class="detail-gallery">
                        <div class="slider-container" id="product-slider">
                            <div class="slider-wrapper">
                                ${images.map(img => `<img src="${img}" class="slider-image" onerror="this.src='https://via.placeholder.com/500x500/161616/e31e24?text=Görsel+Yok'">`).join('')}
                            </div>
                            ${images.length > 1 ? `
                                <button class="slider-btn prev" onclick="App.moveSlide(-1)"><i data-lucide="chevron-left"></i></button>
                                <button class="slider-btn next" onclick="App.moveSlide(1)"><i data-lucide="chevron-right"></i></button>
                                <div class="slider-dots">
                                    ${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="App.goToSlide(${i})"></span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="detail-info">
                        <span class="brand-tag">${product.brand}</span>
                        <h1 class="mb-1">${product.name}</h1>
                        ${stockHTML}
                        <div class="product-price-large">${product.price.toLocaleString('tr-TR')} TL</div>
                        <p class="product-description">${product.description || 'Bu ürün hakkında henüz detaylı açıklama girilmemiş.'}</p>
                        
                        <div class="detail-actions">
                            <button class="btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;" 
                                    onclick="Store.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <i data-lucide="shopping-cart"></i> SEPETE EKLE
                            </button>
                            <button class="btn-outline wishlist-btn ${Store.state.wishlist.some(w => w.id === product.id) ? 'active' : ''}"
                                    onclick="Store.toggleWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <i data-lucide="heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="detail-tabs">
                    <div class="section-header"><h2>Ürün Özellikleri</h2></div>
                    <ul class="features-list">
                        ${(product.features || ['Yüksek Performans', '2 Yıl Garanti', 'Hızlı Teslimat']).map(f => `<li><i data-lucide="check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                </div>

                ${this.renderRecentlyViewedHTML()}
            </div>
        `;

        this.currentSlide = 0;
        this.totalSlides = images.length;
        lucide.createIcons();
        window.scrollTo(0, 0);
    },

    renderRecentlyViewedHTML() {
        // En son gezilen 4 ürünü (kendisi hariç) göster
        const viewed = Store.state.recentlyViewed.slice(1, 5);
        if (viewed.length === 0) return '';
        return `
            <div class="section-header" style="margin-top: 4rem;"><h2>Son Gezdikleriniz</h2></div>
            <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                ${viewed.map(p => this.createProductCardHTML(p)).join('')}
            </div>
        `;
    },

    currentSlide: 0,
    totalSlides: 0,

    moveSlide(delta) {
        this.goToSlide(this.currentSlide + delta);
    },

    goToSlide(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentSlide = index;
        const wrapper = document.querySelector('.slider-wrapper');
        if (wrapper) {
            wrapper.style.transform = `translateX(-${index * 100}%)`;
        }
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },

    renderWishlistPage(container) {
        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Favorilerim</h2>
                </div>
                <div id="product-grid" class="product-grid"></div>
            </div>
        `;

        const grid = document.getElementById('product-grid');
        if (Store.state.wishlist.length === 0) {
            grid.innerHTML = '<p class="text-center">Henüz favori ürününüz yok.</p>';
            return;
        }

        grid.innerHTML = Store.state.wishlist.map(p => {
            const displayImage = (p.images && p.images[0]) ? p.images[0] : (p.image || 'https://via.placeholder.com/300x300/161616/e31e24?text=Resim+Yok');
            return `
                <article class="product-card" onclick="window.location.hash = 'product/${p.id}'" style="cursor:pointer">
                    <div class="wishlist-btn-pos">
                        <button class="wishlist-btn active" 
                                onclick="event.stopPropagation(); Store.toggleWishlist(${JSON.stringify(p).replace(/"/g, '&quot;')}); App.handleRouting();">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                    <img src="${displayImage}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x300/161616/e31e24?text=Açılmadı'">
                    <div class="product-brand">${p.brand}</div>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-footer">
                        <div class="product-price">${p.price.toLocaleString('tr-TR')} TL</div>
                        <button class="btn-primary" onclick="event.stopPropagation(); Store.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                            <i data-lucide="shopping-cart"></i> Sepete Ekle
                        </button>
                    </div>
                </article>
            `;
        }).join('');
        lucide.createIcons();
    },

    renderContactPage(container) {
        container.innerHTML = `
            <div class="container small-container">
                <div class="auth-card">
                    <h2>Bize Ulaşın</h2>
                    <p class="mb-2 text-center text-muted">Sorularınız için aşağıdaki formu doldurabilirsiniz.</p>
                    <form id="contact-form">
                        <div class="form-group">
                            <label>Adınız Soyadınız</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>E-posta Adresiniz</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Mesajınız</label>
                            <textarea style="width:100%; background:var(--input-bg); border:1px solid var(--border-color); color:white; padding:1rem; border-radius:4px; min-height:150px;"></textarea>
                        </div>
                        <button type="submit" class="btn-primary full-width">Gönder</button>
                    </form>
                    <div id="contact-success" class="hidden mt-1 text-center text-red">
                        Mesajınız başarıyla gönderildi! Simüle edilen e-posta yöneticiye iletildi.
                    </div>
                </div>
            </div>
        `;

        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('contact-form').classList.add('hidden');
            document.getElementById('contact-success').classList.remove('hidden');
        });
    },

    renderAboutPage(container) {
        container.innerHTML = `
            <div class="container" style="max-width:800px; padding:4rem 0;">
                <div class="auth-card">
                    <h2 class="mb-2">Hakkımızda</h2>
                    <p class="mb-1"><b>Özcan Gaming Store</b>, 2026 yılında oyuncuların en iyi deneyimi yaşaması amacıyla kurulmuştur.</p>
                    <p class="mb-1">Müşteri memnuniyetini en ön planda tutarak, en yeni teknolojiye sahip donanımları en uygun fiyatlarla sizlere ulaştırıyoruz.</p>
                    <p class="mb-1">Ekibimiz, tutkulu oyunculardan ve teknik uzmanlardan oluşmaktadır. Sadece donanım satmıyor, aynı zamanda size en uygun konfigürasyonu bulmanızda yardımcı oluyoruz.</p>
                </div>
            </div>
        `;
    },

    renderBankPage(container) {
        container.innerHTML = `
            <div class="container" style="max-width:800px; padding:4rem 0;">
                <div class="auth-card">
                    <h2 class="mb-2">Banka Hesap Bilgileri</h2>
                    <div style="background:var(--input-bg); padding:1rem; border-radius:4px; margin-bottom:1rem;">
                        <p><b>Banka:</b> Özcan Bank A.Ş.</p>
                        <p><b>Alıcı:</b> Özcan Gaming Store Ltd. Şti.</p>
                        <p><b>IBAN:</b> TR00 1111 2222 3333 4444 55</p>
                    </div>
                    <p class="text-muted" style="font-size:0.8rem;">* Havale/EFT yaparken açıklama kısmına sipariş numaranızı yazmayı unutmayınız.</p>
                </div>
            </div>
        `;
    },

    renderWarrantyPage(container) {
        container.innerHTML = `
            <div class="container" style="max-width:800px; padding:4rem 0;">
                <div class="auth-card">
                    <h2 class="mb-2">Garanti ve İade</h2>
                    <h4 class="mb-1">Garanti Koşulları</h4>
                    <p class="mb-2">Satılan tüm ürünlerimiz, Türkiye distribütörleri tarafından en az 2 yıl garantilidir.</p>
                    <h4 class="mb-1">İade ve Değişim</h4>
                    <p class="mb-1">Cayma hakkı kapsamında, kutusu açılmamış ve hasar görmemiş ürünleri 14 gün içerisinde iade edebilirsiniz.</p>
                </div>
            </div>
        `;
    },

    renderShippingPage(container) {
        container.innerHTML = `
            <div class="container" style="max-width:800px; padding:4rem 0;">
                <div class="auth-card">
                    <h2 class="mb-2">Kargo Takip</h2>
                    <p class="mb-2">Siparişiniz kargoya verildiğinde size gelen SMS'teki takip numarası ile sorgulama yapabilirsiniz.</p>
                    <div class="form-group" style="display:flex; gap:10px;">
                        <input type="text" placeholder="GÖZC-123456789" style="flex:1;">
                        <button class="btn-primary" style="padding:10px 20px;">Sorgula</button>
                    </div>
                    <p class="mt-1 text-center text-muted">Şu an sistemde kargo kaydı bulunmamaktadır.</p>
                </div>
            </div>
        `;
    },

    renderFAQPage(container) {
        container.innerHTML = `
            <div class="container" style="max-width:800px; padding:4rem 0;">
                <div class="auth-card">
                    <h2 class="mb-2">Sıkça Sorulan Sorular</h2>
                    <div class="mb-2">
                        <h4 class="text-red">Soru: Kargo kaç günde gelir?</h4>
                        <p>Cevap: Siparişleriniz 24 saat içinde kargoya verilir ve genellikle 1-3 iş günü içinde teslim edilir.</p>
                    </div>
                    <div class="mb-2">
                        <h4 class="text-red">Soru: Kredi kartına taksit imkanı var mı?</h4>
                        <p>Cevap: Evet, tüm bonus özellikli kartlara peşin fiyatına 3-6-9 taksit imkanımız mevcuttur.</p>
                    </div>
                </div>
            </div>
        `;
    },


    featuredIds: [1, 2, 19, 20, 49, 54, 52, 53, 11, 44],

    renderHomePage(container) {
        container.innerHTML = `
            <section class="hero-banner">
                <div class="container">
                    <div class="banner-content">
                        <h2>PERFORMANS TUTKUNLARININ<br><span class="text-red">TEK ADRESİ</span></h2>
                        <p>En premium donanımlar ve şık tasarımlar Özcan Gaming kalitesiyle.</p>
                        <a href="#shop" class="btn-primary">ŞİMDİ KEŞFET</a>
                        <div id="countdown" class="countdown-timer"></div>
                    </div>
                </div>
            </section>
            <div class="container">
                <div class="section-header">
                    <h2>Öne Çıkan Ürünler</h2>
                </div>
                <div id="featured-grid" class="product-grid"></div>
                
                <div class="text-center mt-3 mb-4">
                    <a href="#shop" class="btn-primary" style="padding: 1.2rem 3rem; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 10px;">
                        TÜM ÜRÜNLERİ KEŞFET <i data-lucide="arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        this.renderFeaturedProducts();
        this.startCountdown();
    },

    startCountdown() {
        const timer = document.getElementById('countdown');
        if (!timer) return;

        const target = new Date();
        target.setHours(23, 59, 59);

        const update = () => {
            const now = new Date();
            const diff = target - now;
            
            const hours = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            timer.innerHTML = `
                <div class="timer-item"><span class="timer-val">${hours}</span><span class="timer-label">Saat</span></div>
                <div class="timer-item"><span class="timer-val">${mins}</span><span class="timer-label">Dk</span></div>
                <div class="timer-item"><span class="timer-val">${secs}</span><span class="timer-label">Sn</span></div>
            `;
            if (diff > 0) setTimeout(update, 1000);
        };
        update();
    },

    renderFeaturedProducts() {
        const grid = document.getElementById('featured-grid');
        if (!grid) return;

        const featuredProducts = Store.state.products.filter(p => this.featuredIds.includes(p.id));

        grid.innerHTML = featuredProducts.map(p => this.createProductCardHTML(p)).join('');
        lucide.createIcons();
    },

    renderStorePage(container) {
        container.innerHTML = `
            <div class="container" style="padding-top: 2rem;">
                <div class="section-header">
                    <h2>${App.categoryNames[Store.state.currentCategory] || Store.state.currentCategory.toUpperCase()}</h2>
                </div>
                <div id="product-grid" class="product-grid"></div>
                <div id="pagination" class="pagination"></div>
            </div>
        `;
        this.renderProducts();
        this.renderPagination();
    },

    createProductCardHTML(p) {
        const displayImage = (p.images && p.images[0]) ? p.images[0] : (p.image || 'https://via.placeholder.com/300x300/161616/e31e24?text=Resim+Yok');
        
        // Rozet Belirleme
        let badge = '';
        if ([1, 11, 19, 49, 31, 27].includes(p.id)) badge = '<span class="badge-new">YENİ</span>';
        else if ([2, 20, 52, 54, 45, 3].includes(p.id)) badge = '<span class="badge-best">BEST</span>';

        return `
            <article class="product-card" onclick="window.location.hash = 'product/${p.id}'" style="cursor:pointer">
                ${badge}
                <div class="wishlist-btn-pos">
                    <button class="wishlist-btn ${Store.state.wishlist.some(w => w.id === p.id) ? 'active' : ''}" 
                            onclick="event.stopPropagation(); Store.toggleWishlist(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                <img src="${displayImage}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x300/161616/e31e24?text=Açılmadı'">
                <div class="product-brand">${p.brand}</div>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-footer">
                    <div class="product-price">${p.price.toLocaleString('tr-TR')} TL</div>
                    <button class="btn-primary" onclick="event.stopPropagation(); Store.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                        <i data-lucide="shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </article>
        `;
    },

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const products = Store.getPaginatedProducts();
        if (products.length === 0) {
            grid.innerHTML = '<p class="text-center">Ürün bulunamadı.</p>';
            return;
        }

        grid.innerHTML = products.map(p => this.createProductCardHTML(p)).join('');
        lucide.createIcons();
    },

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Store.getTotalPages();
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<div class="page-item ${Store.state.currentPage === i ? 'active' : ''}" 
                          onclick="App.setPage(${i})">${i}</div>`;
        }
        container.innerHTML = html;
    },

    setPage(page) {
        Store.state.currentPage = page;
        Store.savePage();
        this.renderProducts();
        this.renderPagination();
        window.scrollTo(0, 0);
    },

    renderCart() {
        const container = document.getElementById('cart-items-container');
        const cartTotalDisplay = document.getElementById('cart-total');
        const navCartTotal = document.querySelector('#nav-cart span:last-child');

        if (Store.state.cart.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Sepetiniz boş.</div>';
            cartTotalDisplay.innerText = '0.00 TL';
            if (navCartTotal) navCartTotal.innerText = '0.00 TL';
            return;
        }

        container.innerHTML = Store.state.cart.map(item => {
            const displayImage = (item.images && item.images[0]) ? item.images[0] : (item.image || 'https://via.placeholder.com/60x60/161616/e31e24?text=Yok');
            return `
                <div class="cart-item">
                    <img src="${displayImage}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price.toLocaleString('tr-TR')} TL</div>
                        <div class="cart-item-qty">
                            <button onclick="Store.updateCartQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="Store.updateCartQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="Store.removeFromCart(${item.id})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;
        }).join('');

        const total = Store.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalStr = total.toLocaleString('tr-TR') + ' TL';
        cartTotalDisplay.innerText = totalStr;
        if (navCartTotal) navCartTotal.innerText = totalStr;

        lucide.createIcons();
    },

    updateBadges() {
        const cartBadge = document.getElementById('cart-badge');
        const wishlistBadge = document.getElementById('wishlist-badge');
        
        const cartCount = Store.state.cart.reduce((s, i) => s + i.quantity, 0);
        
        // Pop animation if cart changed
        if (cartBadge.innerText !== cartCount.toString() && cartCount > 0) {
            cartBadge.classList.remove('cart-pop-animation');
            void cartBadge.offsetWidth; // Trigger reflow
            cartBadge.classList.add('cart-pop-animation');
        }

        cartBadge.innerText = cartCount;
        wishlistBadge.innerText = Store.state.wishlist.length;
    },

    updateAuthUI() {
        const authBtn = document.getElementById('nav-auth');
        const adminBtn = document.getElementById('nav-admin');
        const user = Store.state.currentUser;

        if (user) {
            authBtn.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <a href="#orders" style="color:var(--text-secondary); font-size:0.85rem; display:flex; align-items:center; gap:4px;">
                        <i data-lucide="box" style="width:16px;"></i> Siparişlerim
                    </a>
                    <button class="nav-icon-btn" onclick="Store.logout()" title="Çıkış">
                        <i data-lucide="log-out"></i>
                        <span>${user.name.split(' ')[0]} (Çıkış)</span>
                    </button>
                </div>
            `;

            if (Store.state.isAdmin) {
                adminBtn.classList.remove('hidden');
                adminBtn.onclick = () => window.location.hash = 'admin';
            } else {
                adminBtn.classList.add('hidden');
            }
        } else {
            authBtn.innerHTML = `<button class="nav-icon-btn" onclick="window.location.hash='login'"><i data-lucide="user"></i><span>Giriş</span></button>`;
            adminBtn.classList.add('hidden');
        }
        lucide.createIcons();
    },

    renderLoginPage(container) {
        container.innerHTML = `
            <div class="container small-container">
                <div class="auth-card">
                    <h2>Giriş Yap</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label>E-posta</label>
                            <input type="email" id="login-email" required placeholder="admin@ozcan.com">
                        </div>
                        <div class="form-group">
                            <label>Şifre</label>
                            <input type="password" id="login-pass" required placeholder="admin123">
                        </div>
                        <button type="submit" class="btn-primary full-width">Giriş Yap</button>
                    </form>
                    <div class="text-center mt-1">
                        Henüz hesabınız yok mu? <a href="#register" class="text-red">Kayıt Ol</a>
                    </div>
                    <p class="mt-1" style="font-size: 0.8rem; color: var(--text-muted);">Admin: admin@ozcan.com / admin123</p>
                </div>
            </div>
        `;
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            if (Store.login(email, pass)) {
                this.showToast('Başarıyla giriş yapıldı!', 'user');
                window.location.hash = '';
            } else {
                this.showToast('Hatalı e-posta veya şifre.', 'alert-circle');
            }
        });
    },

    renderRegisterPage(container) {
        container.innerHTML = `
            <div class="container small-container">
                <div class="auth-card">
                    <h2>Hesap Oluştur</h2>
                    <form id="register-form">
                        <div class="form-group">
                            <label>Ad Soyad</label>
                            <input type="text" id="reg-name" required placeholder="Özcan Karaca">
                        </div>
                        <div class="form-group">
                            <label>E-posta</label>
                            <input type="email" id="reg-email" required placeholder="ozcan@gaming.com">
                        </div>
                        <div class="form-group">
                            <label>Şifre</label>
                            <input type="password" id="reg-pass" required placeholder="******">
                        </div>
                        <button type="submit" class="btn-primary full-width">Kayıt Ol</button>
                    </form>
                    <div class="text-center mt-1">
                        Zaten hesabınız var mı? <a href="#login" class="text-red">Giriş Yap</a>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            
            const res = Store.register(name, email, pass);
            if (res.success) {
                this.showToast('Hesabınız başarıyla oluşturuldu!', 'user-plus');
                window.location.hash = '';
            } else {
                this.showToast(res.message, 'alert-circle');
            }
        });
    },

    renderAdminPage(container) {
        if (!Store.state.isAdmin) {
            window.location.hash = 'login';
            return;
        }

        container.innerHTML = `
            <div class="container">
                <h2 class="mb-2">Yönetim Paneli</h2>
                <div class="admin-grid">
                    <div class="admin-sidebar">
                        <button class="btn-primary full-width mb-1" id="btn-add-product">Yeni Ürün Ekle</button>
                    </div>
                    <div class="admin-content">
                        <h3>Ürün Listesi</h3>
                        <div id="admin-product-list"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderAdminProductList();

        document.getElementById('btn-add-product').onclick = () => this.renderAddProductForm(container);
    },

    renderAdminProductList() {
        const listContainer = document.getElementById('admin-product-list');
        listContainer.innerHTML = Store.state.products.map(p => `
            <div class="admin-product-item">
                <div class="info">
                    <strong>${p.name}</strong>
                    <span>${p.price} TL - ${p.category}</span>
                </div>
                <div class="actions">
                    <button class="text-red" onclick="App.deleteProduct(${p.id})">Sil</button>
                </div>
            </div>
        `).join('');
    },

    deleteProduct(id) {
        if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            Store.deleteProduct(id);
            this.renderAdminProductList();
        }
    },

    renderAddProductForm(container) {
        container.innerHTML = `
            <div class="container small-container">
                <div class="auth-card">
                    <h2>Yeni Ürün Ekle</h2>
                    <form id="add-product-form">
                        <div class="form-group">
                            <label>Ürün Adı</label>
                            <input type="text" id="p-name" required>
                        </div>
                        <div class="form-group">
                            <label>Marka</label>
                            <input type="text" id="p-brand" required>
                        </div>
                        <div class="form-group">
                            <label>Kategori</label>
                            <select id="p-cat">
                                <option value="gpu">Ekran Kartı</option>
                                <option value="cpu">İşlemci</option>
                                <option value="ram">RAM</option>
                                <option value="laptop">Laptop</option>
                                <option value="case">Kasa</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Fiyat (TL)</label>
                            <input type="number" id="p-price" required>
                        </div>
                        <button type="submit" class="btn-primary full-width">Kaydet</button>
                        <button type="button" onclick="window.location.hash='admin'" class="btn-outline full-width mt-1">İptal</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('add-product-form').onsubmit = (e) => {
            e.preventDefault();
            const product = {
                name: document.getElementById('p-name').value,
                brand: document.getElementById('p-brand').value,
                category: document.getElementById('p-cat').value,
                price: parseFloat(document.getElementById('p-price').value),
                image: 'placeholder'
            };
            Store.addProduct(product);
            window.location.hash = 'admin';
        };
    },

    renderCheckoutPage(container) {
        // Close cart drawer if open
        const cartDrawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('overlay');
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        if (Store.state.cart.length === 0) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 5rem 0;">
                    <i data-lucide="shopping-cart" style="width: 64px; height: 64px; margin-bottom: 1rem; color: var(--text-muted);"></i>
                    <h2>Sepetiniz Boş</h2>
                    <p class="mb-2">Sipariş verebilmek için önce sepetinize ürün eklemelisiniz.</p>
                    <a href="#shop" class="btn-primary">Alışverişe Başla</a>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const total = Store.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        container.innerHTML = `
            <div class="container" style="padding: 3rem 0;">
                <div class="checkout-grid" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem;">
                    <div class="checkout-form">
                        <div class="auth-card" style="text-align: left; max-width: 100%;">
                            <h2 class="mb-2">Teslimat & Ödeme</h2>
                            <form id="checkout-form">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <div class="form-group">
                                        <label>Ad</label>
                                        <input type="text" required id="c-name">
                                    </div>
                                    <div class="form-group">
                                        <label>Soyad</label>
                                        <input type="text" required id="c-surname">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>E-posta</label>
                                    <input type="email" required id="c-email" value="${Store.state.currentUser ? Store.state.currentUser.email : ''}">
                                </div>
                                <div class="form-group">
                                    <label>Adres</label>
                                    <textarea required id="c-address" style="width: 100%; min-height: 100px; background: var(--input-bg); color: white; border: 1px solid var(--border-color); padding: 10px; border-radius: 4px;"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Ödeme Yöntemi</label>
                                    <select id="c-payment" style="width: 100%; background: var(--input-bg); color: white; border: 1px solid var(--border-color); padding: 10px; border-radius: 4px;">
                                        <option value="cc">Kredi Kartı</option>
                                        <option value="transfer">Banka Havalesi / EFT</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn-primary full-width mt-1" style="padding: 1.2rem;">SİPARİŞİ ONAYLA</button>
                            </form>
                        </div>
                    </div>

                    <div class="checkout-summary">
                        <div class="auth-card" style="text-align: left; max-width: 100%;">
                            <h3 class="mb-2">Sipariş Özeti</h3>
                            <div class="cart-items-preview" style="max-height: 400px; overflow-y: auto;">
                                ${Store.state.cart.map(item => `
                                    <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                                        <img src="${(item.images && item.images[0]) ? item.images[0] : item.image}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
                                        <div style="flex: 1;">
                                            <div style="font-size: 0.9rem; font-weight: 600;">${item.name}</div>
                                            <div style="font-size: 0.8rem; color: var(--text-muted);">${item.quantity} Adet x ${item.price.toLocaleString('tr-TR')} TL</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="margin-top: 1rem; border-top: 2px solid var(--bg-accent); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                                <strong>TOPLAM TUTAR:</strong>
                                <span style="font-size: 1.4rem; color: var(--bg-accent); font-weight: 800;">${total.toLocaleString('tr-TR')} TL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('checkout-form').onsubmit = (e) => {
            e.preventDefault();
            this.completeOrder(container);
        };
        lucide.createIcons();
    },

    completeOrder(container) {
        const total = Store.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderId = Store.saveOrder({
            items: [...Store.state.cart],
            total: total
        });

        Store.clearCart();
        
        container.innerHTML = `
            <div class="container text-center" style="padding: 5rem 0;">
                <div class="success-icon" style="background: var(--bg-accent); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                    <i data-lucide="check" style="width: 48px; height: 48px; color: white;"></i>
                </div>
                <h1 class="mb-1" style="font-size: 2.5rem;">Teşekkürler!</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">Siparişiniz başarıyla alındı. En kısa sürede kargoya verilecektir.</p>
                <div style="background: var(--input-bg); padding: 1.5rem; border-radius: 8px; max-width: 400px; margin: 0 auto 2rem;">
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">Sipariş Numaranız:</p>
                    <code style="font-size: 1.2rem; color: white; display: block;">#${orderId}</code>
                </div>
                <div style="display:flex; justify-content:center; gap:10px;">
                    <a href="#orders" class="btn-outline" style="padding: 1rem 2rem;">Siparişimi Takip Et</a>
                    <a href="#shop" class="btn-primary" style="padding: 1rem 2rem;">Alışverişe Devam Et</a>
                </div>
            </div>
        `;
        lucide.createIcons();
        window.scrollTo(0, 0);
    },

    renderOrdersPage(container) {
        if (!Store.state.currentUser) {
            window.location.hash = 'login';
            return;
        }

        const myOrders = Store.state.orders.filter(o => o.userEmail === Store.state.currentUser.email);

        container.innerHTML = `
            <div class="container" style="padding: 3rem 0;">
                <div class="section-header"><h2>Siparişlerim</h2></div>
                ${myOrders.length === 0 ? `
                    <div class="auth-card" style="text-align:center;">
                        <p>Henüz bir siparişiniz bulunmuyor.</p>
                        <a href="#shop" class="btn-primary mt-1">Hemen Alışverişe Başla</a>
                    </div>
                ` : myOrders.reverse().map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <strong>Sipariş No: ${order.id}</strong>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">${order.date}</div>
                            </div>
                            <span class="order-badge">Hazırlanıyor</span>
                        </div>
                        <div class="order-body">
                            ${order.items.map(item => `<div style="font-size:0.9rem; margin-bottom:4px;">• ${item.name} x ${item.quantity}</div>`).join('')}
                        </div>
                        <div style="margin-top:1rem; text-align:right; font-weight:700; color:var(--bg-accent);">
                            Toplam: ${order.total.toLocaleString('tr-TR')} TL
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        lucide.createIcons();
    },

    showToast(message, icon = 'check-circle') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) container.removeChild(toast);
            }, 300);
        }, 3000);
    }
};

window.App = App;
App.init();
