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
        cooling: "Soğutucu & Fan",
        psu: "Güç Kaynağı (PSU)",
        oem: "Hazır Sistem",
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
                const category = e.currentTarget.dataset.category;
                const href = e.currentTarget.getAttribute('href');

                if (href && href.startsWith('#') && href !== '#shop') {
                    // Eğer link doğrudan bir hash rotasyona sahipse (örn: #builder) ona izin ver.
                    if (category) {
                         // İstisna varsa
                    } else {
                         return; // default davranışı engelleme (ki href çalışsın)
                    }
                }

                e.preventDefault();
                if (category === 'wishlist') {
                    window.location.hash = 'wishlist';
                } else if (href === '#builder' || e.currentTarget.id === 'nav-builder') {
                    window.location.hash = 'builder';
                } else {
                    document.querySelectorAll('#category-list a').forEach(l => l.classList.remove('active'));
                    e.currentTarget.classList.add('active');
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

        window.addEventListener('compareUpdated', () => {
            this.renderCompareBar();
        });

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
            if (localStorage.getItem('theme') === 'light') {
                document.body.classList.add('light-theme');
            }
        }

        // Routing (Simplistic)
        window.addEventListener('hashchange', () => this.handleRouting());
        this.handleRouting();
    },

    handleRouting() {
        const hash = window.location.hash;
        const main = document.getElementById('main-content');
        
        // Page Loading Bar Animation
        const loader = document.getElementById('top-loader');
        if (loader) {
            loader.style.opacity = '1';
            loader.style.width = '30%';
            setTimeout(() => loader.style.width = '70%', 100);
            setTimeout(() => {
                loader.style.width = '100%';
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.width = '0', 300);
                }, 300);
            }, 300);
        }

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
            case '#builder':
                this.renderBuilderPage(main);
                break;
            case '#compare':
                this.renderComparePage(main);
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
                        ${[...(product.features || []), ...App.getExtraFeatures(product.category)].map((f, i, arr) => arr.indexOf(f) === i ? `<li><i data-lucide="check-circle" style="color:var(--bg-accent);"></i> ${f}</li>` : '').join('')}
                    </ul>
                </div>

                <div class="section-header"><h2>Yorumlar ve Değerlendirmeler</h2></div>
                <div class="comments-section" style="margin-bottom: 40px;">
                    <div id="disqus_thread" style="margin-top: 30px; background:var(--bg-secondary); padding:20px; border-radius:12px;"></div>
                </div>

                ${this.renderRecentlyViewedHTML()}
            </div>
        `;

        this.currentSlide = 0;
        this.totalSlides = images.length;
        lucide.createIcons();
        window.scrollTo(0, 0);

        // --- DISQUS YÜKLEME / YENİLEME MANTIĞI ---
        setTimeout(() => {
            if (window.DISQUS) {
                window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = 'product-' + productId;
                        this.page.url = window.location.href.split('#')[0] + '#product/' + productId;
                    }
                });
            } else {
                window.disqus_config = function () {
                    this.page.identifier = 'product-' + productId;
                    this.page.url = window.location.href.split('#')[0] + '#product/' + productId;
                };
                var d = document, s = d.createElement('script');
                s.src = 'https://ozcan-gaming-store.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            }
        }, 100);
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
        this.initTiltEffect();
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
        this.initTiltEffect();
    },

    renderStorePage(container) {
        container.innerHTML = `
            <div class="container" style="padding-top: 2rem;">
                <div class="section-header">
                    <h2>${App.categoryNames[Store.state.currentCategory] || Store.state.currentCategory.toUpperCase()}</h2>
                </div>
                <div class="store-layout">
                    <aside class="store-sidebar">
                        <div class="filter-group">
                            <h4>Fiyat Aralığı</h4>
                            <input type="number" id="filter-min" placeholder="Min TL" value="${Store.state.minPrice === 0 ? '' : Store.state.minPrice}">
                            <input type="number" id="filter-max" placeholder="Max TL" value="${Store.state.maxPrice === Infinity ? '' : Store.state.maxPrice}">
                            <button class="btn-primary full-width" style="padding: 10px; font-size: 0.8rem;" onclick="App.applyPriceFilter()">Uygula</button>
                        </div>
                        <div class="filter-group">
                            <h4>Sıralama</h4>
                            <select id="filter-sort" onchange="App.applySort(this.value)">
                                <option value="default" ${Store.state.sortBy === 'default' ? 'selected' : ''}>Varsayılan</option>
                                <option value="price-asc" ${Store.state.sortBy === 'price-asc' ? 'selected' : ''}>En Ucuz</option>
                                <option value="price-desc" ${Store.state.sortBy === 'price-desc' ? 'selected' : ''}>En Pahalı</option>
                            </select>
                        </div>
                    </aside>
                    <div class="store-main">
                        <div id="product-grid" class="product-grid"></div>
                        <div id="pagination" class="pagination"></div>
                    </div>
                </div>
            </div>
        `;
        this.renderProducts();
        this.renderPagination();
    },

    applyPriceFilter() {
        const min = parseFloat(document.getElementById('filter-min').value) || 0;
        const max = parseFloat(document.getElementById('filter-max').value) || Infinity;
        Store.state.minPrice = min;
        Store.state.maxPrice = max;
        Store.state.currentPage = 1;
        Store.applyFilters();
    },

    applySort(val) {
        Store.state.sortBy = val;
        Store.state.currentPage = 1;
        Store.applyFilters();
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
                <div class="compare-btn-pos">
                    <button class="compare-btn ${Store.state.compare.some(c => c.id === p.id) ? 'active' : ''}" 
                            onclick="event.stopPropagation(); Store.toggleCompare(${JSON.stringify(p).replace(/"/g, '&quot;')}); App.handleRouting();" title="Karşılaştır">
                        <i data-lucide="bar-chart-2"></i>
                    </button>
                </div>
                <img src="${displayImage}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x300/161616/e31e24?text=Açılmadı'">
                <div class="product-brand" style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${p.brand}</span>
                    <span class="disqus-comment-count" data-disqus-identifier="product-${p.id}" style="font-size:0.75rem; color:var(--text-muted);">
                        <i data-lucide="message-circle" style="width:12px; height:12px; margin-right:2px;"></i>...
                    </span>
                </div>
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
        this.initTiltEffect();

        if (typeof DISQUSWIDGETS !== 'undefined') {
            DISQUSWIDGETS.getCount({ reset: true });
        }
    },

    initTiltEffect() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
                const rotateY = ((x - centerX) / centerX) * 12;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                card.style.transition = 'none'; // removing transition during movement makes it snappy
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
                card.style.transition = 'transform 0.5s ease-out'; // smooth return
            });
        });
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

        let total = Store.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (Store.state.discountRate > 0) {
            total = total * (1 - Store.state.discountRate);
            cartTotalDisplay.parentElement.innerHTML = `<span>Toplam (<span style="color:var(--bg-accent)">%${Store.state.discountRate*100} İndirim</span>):</span> <span id="cart-total">${total.toLocaleString('tr-TR')} TL</span>`;
        } else {
            cartTotalDisplay.parentElement.innerHTML = `<span>Toplam:</span> <span id="cart-total">${total.toLocaleString('tr-TR')} TL</span>`;
        }
        
        const totalStr = total.toLocaleString('tr-TR') + ' TL';
        if (navCartTotal) navCartTotal.innerText = totalStr;

        lucide.createIcons();
    },

    applyCoupon() {
        const input = document.getElementById('coupon-input');
        if (!input) return;
        const code = input.value.trim();
        if (Store.applyDiscountCode(code)) {
            this.showToast('Kupon başarıyla uygulandı!', 'check');
            this.renderCart();
        } else {
            this.showToast('Geçersiz kupon kodu!', 'alert-circle');
            this.renderCart();
        }
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
                            <input type="email" id="login-email" required placeholder="isim@ornek.com">
                        </div>
                        <div class="form-group">
                            <label>Şifre</label>
                            <input type="password" id="login-pass" required placeholder="********">
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
    },

    renderCompareBar() {
        const bar = document.getElementById('compare-bar');
        const itemsContainer = document.getElementById('compare-items-bar');
        const count = document.getElementById('compare-count');
        
        if (!bar || !itemsContainer || !count) return;

        const compareItems = Store.state.compare;
        count.innerText = compareItems.length;

        if (compareItems.length > 0) {
            bar.classList.add('active');
            itemsContainer.innerHTML = compareItems.map(p => `
                <div class="compare-item-mini">
                    <img src="${(p.images && p.images[0]) ? p.images[0] : (p.image || 'https://via.placeholder.com/30px')}" alt="${p.name}">
                    <span style="font-size:0.8rem; font-weight:bold; max-width:100px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</span>
                    <button onclick="Store.removeFromCompare(${p.id}); App.renderCompareBar();" style="color:var(--text-muted);"><i data-lucide="x" style="width:14px;"></i></button>
                </div>
            `).join('');
        } else {
            bar.classList.remove('active');
        }
        lucide.createIcons();
    },

    renderComparePage(container) {
        const items = Store.state.compare;
        if (items.length === 0) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 5rem 0;">
                    <h2>Karşılaştırma Listesi Boş</h2>
                    <p class="text-muted mb-2">Karşılaştırmak istediğiniz ürünleri ürün kartlarındaki karşılaştırma butonuna tıklayarak ekleyebilirsiniz.</p>
                    <a href="#shop" class="btn-primary" style="display:inline-flex;">Ürünlere Göz At</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="container" style="padding: 3rem 0;">
                <div class="section-header">
                    <h2>Ürün Karşılaştırma</h2>
                </div>
                <div style="overflow-x: auto;">
                    <table class="compare-table">
                        <thead>
                            <tr>
                                <th>Özellikler</th>
                                ${items.map(p => `
                                    <th>
                                        <button onclick="Store.removeFromCompare(${p.id}); App.renderComparePage(document.getElementById('main-content'));" style="color:var(--bg-accent); margin-bottom:10px;"><i data-lucide="trash-2"></i> Listeden Çıkar</button>
                                        <br>
                                        <img src="${(p.images && p.images[0]) ? p.images[0] : (p.image || 'https://via.placeholder.com/150px')}">
                                        <h4 style="font-size:1rem; margin-bottom:10px;">${p.name}</h4>
                                        <div style="font-size:1.5rem; color:var(--bg-accent); font-weight:bold;">${p.price.toLocaleString('tr-TR')} TL</div>
                                        <button class="btn-primary full-width mt-1" onclick="Store.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Sepete Ekle</button>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Marka</strong></td>
                                ${items.map(p => `<td>${p.brand}</td>`).join('')}
                            </tr>
                            <tr>
                                <td><strong>Kategori</strong></td>
                                ${items.map(p => `<td>${App.categoryNames[p.category] || p.category.toUpperCase()}</td>`).join('')}
                            </tr>
                            <tr>
                                <td><strong>Bağlantı & Diğer T.</strong></td>
                                ${items.map(p => `
                                    <td style="text-align:left; font-size:0.85rem; color:var(--text-muted);">
                                        <ul style="list-style-type:none; padding-left:0;">
                                            ${App.getExtraFeatures(p.category).map(f => `<li style="margin-bottom:4px;">- ${f}</li>`).join('')}
                                        </ul>
                                    </td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td><strong>Açıklama</strong></td>
                                ${items.map(p => `<td style="font-size:0.85rem; color:var(--text-muted);">${p.description || '-'}</td>`).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    builderSteps: [
        { id: 'cpu', name: 'İşlemci (CPU)', category: 'cpu' },
        { id: 'mainboard', name: 'Anakart', category: 'mainboard' },
        { id: 'ram', name: 'Bellek (RAM)', category: 'ram' },
        { id: 'gpu', name: 'Ekran Kartı', category: 'gpu' },
        { id: 'storage', name: 'Depolama', category: 'storage' },
        { id: 'cooling', name: 'Soğutma', category: 'cooling' },
        { id: 'psu', name: 'Güç Kaynağı', category: 'psu' },
        { id: 'case', name: 'Kasa', category: 'case' }
    ],
    currentBuilderStep: 0,

    renderBuilderPage(container) {
        const step = this.builderSteps[this.currentBuilderStep];
        const state = Store.state.builder;

        // Hesaplamalar
        const totalCost = Object.values(state).reduce((sum, item) => sum + (item ? item.price : 0), 0);
        const allCompleted = Object.values(state).every(item => item !== null);

        let html = `
            <div class="container" style="padding: 3rem 0;">
                <div class="section-header text-center" style="border:none;">
                    <h2>PC Toplama Sihirbazı <i data-lucide="cpu" style="width:30px;height:30px;color:var(--bg-accent);"></i></h2>
                    <p class="text-muted">Hayalinizdeki sistemi adım adım toplayın.</p>
                </div>
                
                <div class="builder-steps">
                    ${this.builderSteps.map((s, index) => `
                        <div class="builder-step ${index === this.currentBuilderStep ? 'active' : ''} ${state[s.id] ? 'completed' : ''}" 
                             onclick="App.currentBuilderStep = ${index}; App.renderBuilderPage(document.getElementById('main-content'));">
                            ${index + 1}. ${s.name} ${state[s.id] ? '<i data-lucide="check-circle" style="width:14px; display:inline-block; margin-left:5px;"></i>' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="store-layout">
                    <div class="store-main">
                        <h3 class="mb-1">${step.name} Seçimi</h3>
                        <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                            ${Store.state.products.filter(p => p.category === step.category).map(p => {
                                const isSelected = state[step.id] && state[step.id].id === p.id;
                                return `
                                    <article class="product-card ${isSelected ? 'selected-item' : ''}" style="${isSelected ? 'border-color: #10b981; box-shadow: 0 0 15px rgba(16,185,129,0.3);' : ''}">
                                        <img src="${(p.images && p.images[0]) ? p.images[0] : (p.image || 'https://via.placeholder.com/200x200')}" class="product-image">
                                        <div class="product-brand">${p.brand}</div>
                                        <h3 class="product-title" style="font-size:0.85rem; height:40px;">${p.name}</h3>
                                        <div class="product-footer">
                                            <div class="product-price" style="font-size:1.1rem;">${p.price.toLocaleString('tr-TR')} TL</div>
                                            <button class="btn-${isSelected ? 'outline' : 'primary'}" onclick="App.selectBuilderItem('${step.id}', ${p.id})">
                                                ${isSelected ? 'Seçildi <i data-lucide="check"></i>' : 'Seç'}
                                            </button>
                                        </div>
                                    </article>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <aside class="store-sidebar">
                        <h4>Sistem Özeti</h4>
                        <div class="builder-summary-item">
                            <span>İşlemci:</span>
                            <strong style="text-align:right;">${state.cpu ? state.cpu.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Anakart:</span>
                            <strong style="text-align:right;">${state.mainboard ? state.mainboard.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>RAM:</span>
                            <strong style="text-align:right;">${state.ram ? state.ram.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Ekran K.:</span>
                            <strong style="text-align:right;">${state.gpu ? state.gpu.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Depolama:</span>
                            <strong style="text-align:right;">${state.storage ? state.storage.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Soğutma:</span>
                            <strong style="text-align:right;">${state.cooling ? state.cooling.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Güç Kay.:</span>
                            <strong style="text-align:right;">${state.psu ? state.psu.name : '-'}</strong>
                        </div>
                        <div class="builder-summary-item">
                            <span>Kasa:</span>
                            <strong style="text-align:right;">${state.case ? state.case.name : '-'}</strong>
                        </div>
                        
                        <div style="margin-top:20px; font-size:1.2rem; font-weight:900; color:var(--bg-accent); text-align:center;">
                            Toplam: ${totalCost.toLocaleString('tr-TR')} TL
                        </div>
                        
                        <button class="btn-primary full-width mt-1" 
                                onclick="App.addAllBuilderToCart()" 
                                ${!allCompleted ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                            TÜMÜNÜ SEPETE EKLE
                        </button>
                    </aside>
                </div>
            </div>
        `;

        container.innerHTML = html;
        lucide.createIcons();
    },

    selectBuilderItem(stepId, productId) {
        const product = Store.state.products.find(p => p.id === productId);
        Store.state.builder[stepId] = product;
        if (this.currentBuilderStep < this.builderSteps.length - 1) {
            this.currentBuilderStep++;
        }
        this.renderBuilderPage(document.getElementById('main-content'));
    },

    addAllBuilderToCart() {
        const state = Store.state.builder;
        Object.values(state).forEach(product => {
            if (product) Store.addToCart(product);
        });
        this.showToast('Tüm PC bileşenleri sepete eklendi!', 'cpu');
        window.location.hash = 'checkout';
    },

    getExtraFeatures(category) {
        const extras = {
            gpu: ["NVIDIA DLSS / AMD FSR Gelişmiş Desteği", "Gerçek Zamanlı Işın İzleme (Ray Tracing) Çekirdekleri", "PCIe 4.0 Uyumluluğu", "3 Adet DisplayPort, 1 Adet HDMI", "Genişletilmiş Bakır Soğutma Boruları", "0dB (Sıfır Ses) Zero-Fan Teknolojisi"],
            cpu: ["Yüksek Çoklu Çekirdek Performansı", "Gelişmiş L3 Önbellek (Cache)", "DDR5 / DDR4 Çift Platform Desteği", "Optimize Edilmiş TDP Değerleri", "Termal Kontrol Algoritması"],
            mainboard: ["M.2 Termal Shield (Soğutmalı) Yuvalar", "Çift Kanal DDR Mimarisi", "Gelişmiş Dijital VRM Güç Besleme", "5V ve 12V Çoklu ARGB/RGB Başlıkları", "2.5G LAN ve Düşük Gecikmeli Ağ İletişimi", "PCI-E Güçlendirilmiş Çelik Zırh Desteği"],
            ram: ["Yüksek Kaliteli Alüminyum Isı Dağıtıcıları", "XMP / EXPO Destekli Otomatik Hız Aşırtma", "Düşük Gecikme Saniyesi (CL) Akıcılığı", "Ömür Boyu Sınırlı Marka Garantisi"],
            case: ["Çizilmeye Dayanıklı Kalın Temperli Cam Yan Panel", "Yüksek Hava Akışlı Hava Filtreli Mesh Ön Panel", "Geniş Kablo Yönetim Alanı", "ATX, Micro-ATX, Mini-ITX Tam Uyum", "Dahili aRGB Kumandalı Işıklandırma Sistemi"],
            monitor: ["NVIDIA G-Sync & AMD FreeSync Uyumlu", "Titreşim Engelleme (Flicker-Free)", "Düşük Mavi Işık Göz Koruma Filtresi", "VESA Standardı Duvara Montaj Uyumu", "Ultra İnce Çerçeveli Ergonomik Çizgi"],
            laptop: ["Yeni Nesil Çok Kanallı Wi-Fi ve Bluetooth", "Özelleştirilebilir RGB Oyuncu Klavyesi", "Buhar Odacıklı veya Bakır Borulu Sıvı Soğutma", "Hızlı Uyanma (Instant Wake) Özelliği", "İnce, Hafif ve Taşınabilir Alüminyum Şasi"],
            accessories: ["Kopmaya Karşı Örgü Kaplama Koruyucu Kablo", "Altın Uçlu Gecikmesiz Konnektörler", "Özelleştirilebilir Yazılım Desteği", "Uzun Süreli Ergonomik Konfor Tasarımı"],
            storage: ["Gelişmiş 3D NAND Çok Katmanlı Mimari", "Ultra Yüksek Hızda Sıralı/Rastgele Okuma ve Yazma", "Şok ve Titreşimlere Karşı Kusursuz Dayanıklılık", "Pasif Anakart Soğutucu Blok Tam Uyumlu"],
            cooling: ["Ultra Sessiz Geometrik Kanat Tasarımı", "Örgülü, Bükülmeye Dirençli Soğutma Hortumları", "Saf Bakır Taban Kontağı", "Zorlu Şartlara Dayanıklı Pompa / Fan Motoru"],
            psu: ["OVP/OPP/UVP Endüstriyel Koruma Protokolleri", "Aktif PFC (%99) Kusursuz Enerji Verimliliği", "Isıya Dirençli %100 Japon Kondansatörler", "Sessizlik Odaklı Smart Fan Karakteristiği"],
            oem: ["2 Yıl Ücretsiz Özcan Gaming Garantisi", "Mühendislerimiz Tarafından Kablolama ve Tam Montaj Yapılmıştır", "12 Saati Aşan Ağır Stres ve Sıcaklık Testleri", "Aydınlatmalı ve Yüksek Soğutmalı Oyuncu Kasası", "Prize Tak-Kullan Özel Konfigürasyon", "Donanım Özelleştirmesine Açık Tasarım"]
        };
        const defaultExtras = ["Distribütör Garantili Orijinal Ürün", "Aynı Gün Güvenli Kargo Seçeneği", "Destek ve Kurulum Hizmeti"];
        return extras[category] || defaultExtras;
    },

    addComment(productId) {
        const userInp = document.getElementById('new-comment-user').value.trim();
        const textInp = document.getElementById('new-comment-text').value.trim();
        const ratingInp = document.getElementById('new-comment-rating').value;

        if (!userInp || !textInp) {
            this.showToast('Lütfen isminizi ve yorumunuzu giriniz.', 'alert-circle');
            return;
        }

        const product = Store.state.products.find(p => p.id === productId);
        if (product) {
            const today = new Date();
            const dateStr = today.toLocaleDateString('tr-TR');
            
            if (!product.comments) product.comments = [];
            
            product.comments.push({
                user: userInp,
                date: dateStr,
                rating: parseInt(ratingInp),
                text: textInp
            });

            Store.saveProducts(); // Bu localStorage'a yazar, yenilemede kaybolmaz
            this.showToast('Yorumunuz onaylandı ve yayınlandı!', 'check-circle');
            
            // Re-render
            this.renderProductDetailPage(document.getElementById('main-content'), productId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

window.App = App;
App.init();
