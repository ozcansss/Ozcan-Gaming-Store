const initialProducts = [
    // GPU (EKRAN KARTLARI)
    {
        id: 1, name: "ASUS ROG STRIX GeForce RTX 4090 24GB GDDR6X", category: "gpu", brand: "ASUS", price: 95000.00,
        images: ["https://media.ldlc.com/r1600/ld/products/00/06/07/12/LD0006071243.jpg", "https://www.incehesap.com/resim/urun/202312/65814fa7d1aac8.47247038_lgpnqijhfkoem_500.webp"],
        description: "Dünyanın en güçlü ekran kartı. Ada Lovelace mimarisi ve üstün soğutma.",
        features: ["24GB GDDR6X", "Aura Sync RGB", "DLSS 3.5"],
        comments: [{ user: "Hakan", date: "12.04.2024", rating: 5, text: "Kutusu çok büyük, kart zaten devasa." }]
    },
    {
        id: 2, name: "MSI GeForce RTX 4080 SUPER 16GB SUPRIM X", category: "gpu", brand: "MSI", price: 48000.00,
        images: ["https://www.gaming.gen.tr/wp-content/uploads/2023/10/msi-geforce-rtx-4080-super-suprim-x-16gb-gddr6x-256-bit-dlss-3-ekran-karti.jpg", "https://www.gaming.gen.tr/wp-content/uploads/2023/10/msi-geforce-rtx-4080-super-suprim-x-16gb-gddr6x-256-bit-dlss-3-ekran-karti-3.jpg"],
        description: "Fırçalanmış alüminyum gövdesiyle zarafet ve gücün zirvesi.",
        features: ["16GB GDDR6X", "Torx Fan 5.0", "Hava Akışı Kontrolü"],
        comments: [{ user: "Mert", date: "10.04.2024", rating: 5, text: "Sessiz ve çok güçlü." }]
    },
    {
        id: 3, name: "ASUS TUF Gaming GeForce RTX 4070 Ti SUPER", category: "gpu", brand: "ASUS", price: 36000.00,
        images: ["https://www.gaming.gen.tr/wp-content/uploads/2024/10/asus-tuf-gaming-geforce-rtx-4070-ti-super-og-oc-16gb-gddr6x-256-bit-ekran-karti-517761-600x600.jpg", "https://dlcdnwebimgs.asus.com/files/media/1c72a8b6-d96e-4602-9d6e-ef1a06c14a89/v1/img/explosion/pd.png"],
        description: "Dayanıklı askeri sınıf bileşenler ve muazzam soğutma performansı.",
        features: ["16GB GDDR6X Bellek", "Askeri Sınıf Kapasitörler", "Auto-Extreme Teknoloji"],
        comments: []
    },
    {
        id: 4, name: "GIGABYTE RTX 4070 SUPER EAGLE OC 12GB", category: "gpu", brand: "GIGABYTE", price: 26500.00,
        images: ["https://cdn.akakce.com/z/gigabyte/gigabyte-rtx-4070-super-eagle-oc-12g-gv-n407seagle-oc-12gd-192-bit-gddr6x-12-gb.jpg", "https://platincdn.com/3393/pictures/AXMKKZLYQI2232024203244_Gigabyte-RTX-4070-Super-Eagle-OC-12G-GV-N407SEAGLE.jpg"],
        description: "Windforce soğutma sistemiyle serin and sessiz bir oyun deneyimi.",
        features: ["12GB GDDR6X", "Windforce 3X Soğutma", "RGB Fusion 2.0"],
        comments: []
    },
    {
        id: 5, name: "Sapphire Nitro+ Radeon RX 7900 XTX 24GB", category: "gpu", brand: "SAPPHIRE", price: 41000.00,
        images: ["https://cdn.akakce.com/z/sapphire/sapphire-radeon-rx-7900-xtx-nitro-vapor-x-11322-01-40g-384-bit-gddr6-24-gb.jpg", "https://m.media-amazon.com/images/I/71SFpwUjXFL._AC_UF1000,1000_QL80_.jpg"],
        description: "AMD'nin bayrak gemisi. 24GB devasa bellek ile 4K oyunların efendisi.",
        features: ["24GB GDDR6 Bellek", "Vapor-X Soğutma", "RDNA 3 Mimarisi"],
        comments: []
    },
    {
        id: 6,
        name: "ZOTAC Gaming RTX 4060 Ti 8GB Twin Edge",
        category: "gpu",
        brand: "ZOTAC",
        price: 15500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/zotac/thumb/zt-d40610e-10m_large.jpg", "https://www.zotac.com/download/files/page/4060/moblie_asset/4060_VGA_cover_flow1.png"],
        description: "Kompakt tasarım, devasa performans. Her kasaya sığar.",
        features: ["8GB GDDR6", "IceStorm 2.0", "Spectra RGB"],
        comments: []
    },
    {
        id: 7,
        name: "ASUS Dual RTX 4060 8GB EVO OC Edition",
        category: "gpu",
        brand: "ASUS",
        price: 11500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/148680-1_large.jpg", "https://dlcdnwebimgs.asus.com/gain/e06849ab-c1f9-4920-8a20-3119f97f6abe/w692"],
        description: "Verimli soğutma, şık tasarım. Full HD oyun için ideal.",
        features: ["8GB GDDR6", "Eksenel Fanlar", "Alüminyum Arka Plaka"],
        comments: []
    },
    {
        id: 8,
        name: "MSI RTX 4070 SUPER Gaming X Slim White",
        category: "gpu",
        brand: "MSI",
        price: 29000.00,
        images: ["https://cdn.akakce.com/z/msi/msi-rtx-4070-super-gaming-x-slim-white-12g-192-bit-gddr6x-12-gb.jpg", "https://www.gaming.gen.tr/wp-content/uploads/2024/02/msi-geforce-rtx-4070-super-gaming-x-slim-white-12gb-gddr6x-192-bit-dlss-3-ekran-karti-4.jpg"],
        description: "Beyaz sistemler için kusursuz estetik ve ince tasarım.",
        features: ["12GB GDDR6X", "Tri Frozr 3 Soğutma", "Beyaz Estetik"],
        comments: []
    },
    {
        id: 9,
        name: "XFX Speedster SWFT Radeon RX 7600 8GB",
        category: "gpu",
        brand: "XFX",
        price: 10500.00,
        images: ["https://cdn.akakce.com/z/xfx/xfx-speedster-swft-210-rx-7600-xt-rx-76tswftfp-128-bit-gddr6-16-gb.jpg", "https://m.media-amazon.com/images/I/61p7SvkUxML._AC_UF894,1000_QL80_.jpg"],
        description: "Fiyat/performans canavarı. AMD kalitesiyle akıcı oyunlar.",
        features: ["8GB GDDR6", "AMD FidelityFX", "Sessiz Fan Tasarımı"],
        comments: []
    },
    {
        id: 10,
        name: "Palit GeForce RTX 4090 GameRock 24GB",
        category: "gpu",
        brand: "PALIT",
        price: 84000.00,
        images: ["https://www.palit.com/product/vga/picture/p04608/p04608_propng_432639055285edc7.png", "https://www.palit.com/product/vga/picture/p04608/p04608_bigimage_95632ab5ab6e6e0.png"],
        description: "Kristal tasarımıyla kasanıza ihtişam katan zirve performans.",
        features: ["24GB GDDR6X", "Kristal RGB Tasarım", "Yüksek OC Potansiyeli"],
        comments: []
    },

    // CPU (İŞLEMCİLER)
    {
        id: 11,
        name: "Intel Core i9-14900K 6.0GHz 24 Çekirdek",
        category: "cpu",
        brand: "INTEL",
        price: 21500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/intel/thumb/142151-1-1_large.jpg"],
        description: "Dünyanın en hızlı masaüstü işlemcisi. 6.0 GHz barajını aşın.",
        features: ["24 Çekirdek (8P+16E)", "6.0 GHz Turbo", "36MB L3 Cache"],
        comments: []
    },
    {
        id: 12,
        name: "AMD Ryzen 9 7950X3D 4.2GHz 16 Çekirdek",
        category: "cpu",
        brand: "AMD",
        price: 24000.00,
        images: ["https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_106480575?x=536&y=402&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=536&ey=402&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=536&cdy=402", "https://img.yenieera22.com/cdn/1000/yeni-proje-2023-02-23t163547905-ba19fe.jpg"],
        description: "AMD 3D V-Cache™ teknolojisiyle oyun performansında devrim.",
        features: ["16 Çekirdek / 32 İzlek", "128MB L3 Cache", "Oyun Canavarı"],
        comments: []
    },
    {
        id: 13,
        name: "Intel Core i7-14700K 5.6GHz 20 Çekirdek",
        category: "cpu",
        brand: "INTEL",
        price: 15000.00,
        images: ["https://www.gaming.gen.tr/wp-content/uploads/2023/08/intel-core-i7-14700k-5-6ghz-28mb-onbellek-20-cekirdek-1700-islemci-y.jpg"],
        description: "Hem içerik üretimi hem oyun için yüksek performanslı hibrit mimari.",
        features: ["20 Çekirdek", "5.6 GHz Turbo", "Yeni Intel 7 Proses"],
        comments: []
    },
    {
        id: 14,
        name: "AMD Ryzen 7 7800X3D 4.2GHz 8 Çekirdek",
        category: "cpu",
        brand: "AMD",
        price: 14000.00,
        images: ["https://cdn.akakce.com/z/amd/amd-ryzen-7-7800x3d-sekiz-cekirdek-4-2-ghz.jpg", "https://img.yenieera22.com/cdn/1000/yeni-proje-2023-02-23t163547905-634768.jpg"],
        description: "Espor oyuncularının bir numaralı tercihi. Saf oyun performansı.",
        features: ["8 Çekirdek", "96MB L3 V-Cache", "AM5 Soket"],
        comments: []
    },
    {
        id: 15,
        name: "Intel Core i5-14600K 5.3GHz 14 Çekirdek",
        category: "cpu",
        brand: "INTEL",
        price: 11000.00,
        images: ["https://m.media-amazon.com/images/I/61mTntMQ4OL.jpg"],
        description: "Fiyat/performans dengesinde zirve. Her işin üstesinden gelir.",
        features: ["14 Çekirdek", "DDR5/DDR4 Desteği", "PCIe 5.0"],
        comments: []
    },
    {
        id: 16,
        name: "AMD Ryzen 5 7600X 4.7GHz 6 Çekirdek",
        category: "cpu",
        brand: "AMD",
        price: 8000.00,
        images: ["https://percdn.com/f/145222/bzR6WmFtNG0vcUp3ZUdGbEdzOG5ZTDBQYmNFPQ/p/amd-ryzen-5-7600-380ghz-6-cekirdek-38mb-onbellek-5nm-soket-am5-islemci-166100852-sw600sh600.webp", "https://platincdn.com/466/dosyalar/images/oem/amd-ryzen-7000-islemci.jpg"],
        description: "Modern oyunlar için AM5 platformuna giriş kapısı.",
        features: ["6 Çekirdek / 12 İzlek", "5.3 GHz Boost", "5nm İşlem"],
        comments: []
    },
    {
        id: 17,
        name: "Intel Core i5-13400F 4.6GHz 10 Çekirdek",
        category: "cpu",
        brand: "INTEL",
        price: 7500.00,
        images: ["https://www.gaming.gen.tr/wp-content/uploads/2023/01/intel-core-i5-13400-4-6ghz-20mb-onbellek-10-cekirdek-1700-islemci-bx8071513400-2.jpg"],
        description: "Bütçe dostu, yüksek performanslı oyun sistemleri için.",
        features: ["10 Çekirdek", "Harici Grafik Yok", "Verimli Güç Tüketimi"],
        comments: []
    },
    {
        id: 18,
        name: "AMD Ryzen 7 5800X3D (Legacy AM4 Platform)",
        category: "cpu",
        brand: "AMD",
        price: 12000.00,
        images: ["https://www.novabilgisayar.com/urunler/Amd-Ryzen-5800X3D.jpg", "https://cdn.mos.cms.futurecdn.net/UWqaYL9HkycVJ7TjAEpJzR-1200-80.jpg"],
        description: "AM4 platformunu kullananlar için en büyük oyun güncellemesi.",
        features: ["8 Çekirdek", "3D V-Cache", "AM4 Uyumluluk"],
        comments: []
    },

    // LAPTOP (DİZÜSTÜ)
    {
        id: 19,
        name: "MSI Titan GT77 HX i9-13980HX RTX 4090",
        category: "laptop",
        brand: "MSI",
        price: 140000.00,
        images: ["https://www.gaming.gen.tr/wp-content/uploads/2023/02/msi-titan-gt77hx-13vi-069tr-intel-core-i9-13980hx-128gb-4tb-ssd-rtx4090-17-3-inc-144hz-ultra-hd-w11-gaming-notebook-1.jpg", "https://cdn.akakce.com/z/msi/msi-titan-gt77hx-13vi-069tr-i9-13980hx-128-gb-4-tb-ssd-rtx4090-17-3-notebook.jpg", "https://www.gaming.gen.tr/wp-content/uploads/2023/02/msi-titan-gt77hx-13vi-069tr-intel-core-i9-13980hx-128gb-4tb-ssd-rtx4090-17-3-inc-144hz-ultra-hd-w11-gaming-notebook-7.jpg"],
        description: "Masaüstü bilgisayarınızın yerini alacak tek canavar.",
        features: ["17.3\" 4K Mini-LED", "RTX 4090", "64GB DDR5"],
        comments: []
    },
    {
        id: 20,
        name: "ASUS ROG Strix SCAR 18 i9-14900HX RTX 4091",
        category: "laptop",
        brand: "ASUS",
        price: 125000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/144813-3-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/g834jzr-n6036w-gaming_large.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9kuEIwut7hRGZjxv73l4L9ZDs65-IOW9Sw&s"],
        description: "18 inçlik Nebula Display ile kendinizi oyunun içinde hissedin.",
        features: ["18\" QHD+ 240Hz", "Core i9 14. Nesil", "Üçlü Fan Soğutma"],
        comments: []
    },
    {
        id: 21,
        name: "Razer Blade 16 i9-14900HX RTX 4092",
        category: "laptop",
        brand: "RAZER",
        price: 165000.00,
        images: ["https://productimages.hepsiburada.net/s/777/375-375/110000764794175.jpg", "https://productimages.hepsiburada.net/s/777/375-375/110000763405603.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW3zUaoAkMRhbZvNrJBthpGHbc4cgkSE8jqg&s"],
        description: "İnce tasarım, devasa güç. Tek parça alüminyum gövde.",
        features: ["Dual Mode Mini-LED", "RTX 4090", "Chroma RGB"],
        comments: []
    },
    {
        id: 22,
        name: "ROG Zephyrus G16 OLED Ultra 9 RTX 4082",
        category: "laptop",
        brand: "ASUS",
        price: 95000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/144350-3-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/gu605mi-qr044w-gaming_large.jpg", "data:image/jpeg;base64,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"],
        description: "Dünyanın en şık oyuncu laptopu. OLED ekranla kusursuz renkler.",
        features: ["16\" 2.5K OLED", "RTX 4080", "1.85kg Hafiflik"],
        comments: []
    },
    {
        id: 23,
        name: "MacBook Pro 16\" Apple M3 Max 128GB RAM Space Black",
        category: "laptop",
        brand: "APPLE",
        price: 135000.00,
        images: ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-macbook-pro-finish-select-202601-16inch?wid=5120&hei=3280&fmt=webp&qlt=90&.v=aXlkdGF0T0RUUVdDckNLaUc0OEE0MEhGUTRkVVZndC9KWVVLOUdiOXdHbU9oQVd6ak9Ob0IrdjlmU1RKd0dmVEtZMGFKbG9yanhQdjZDS1dZUFFhRVE4bm1RcmlWRWp2eDN1WHNkSjNmUlplbUFLakxuY2U2Mk9HV3J6eUtTaWs&traceId=1", "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-macbook-pro-finish-select-202601-16inch_AV1_GEO_TR?wid=5120&hei=3280&fmt=webp&qlt=90&.v=aXlkdGF0T0RUUVdDckNLaUc0OEE0MEhGUTRkVVZndC9KWVVLOUdiOXdHbHllQy8zRmIxVDNZS250QXNyZ0ltQ29ZaEVtTllwRGMzODk4UEtRMkZ3UGtvbDF6d2tlR0VmV2RIWCtmOCtid1V0aFZWdUhmKzBZN29JbWdHWUFNNnVqcjIyVWlWWEdWMFZlYUdYV1NFQy9B&traceId=1", "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-macbook-pro-finish-select-202601-16inch_AV2?wid=5120&hei=3280&fmt=webp&qlt=90&.v=aXlkdGF0T0RUUVdDckNLaUc0OEE0MEhGUTRkVVZndC9KWVVLOUdiOXdHbVFsQ2hNeGliaFR2RWJJTW0zNVQ0RUVlNEJLYXlpcWN3dVUzSHNPQldJNDUyTGQvczVjTzVnd1B6UVQwaE1kY2lpVnB4OWcwRlJiTDUyRGhlZTVmTEdoK1I2TVlSTEdGbVZzUlErcndBTnZ3&traceId=1"],
        description: "Yaratıcı profesyoneller için sınırsız güç ve pil ömrü.",
        features: ["M3 Max 16-Core", "128GB Unified Memory", "Liquid Retina XDR"],
        comments: []
    },
    {
        id: 24,
        name: "MSI Stealth 16 Mercedes-AMG Motorsport A13V",
        category: "laptop",
        brand: "MSI",
        price: 110000.00,
        images: ["https://storage-asset.msi.com/global/picture/product/product_1684823628ee9fd2fb935bf0ae4268b22b1e19d75c.webp", "https://storage-asset.msi.com/global/picture/product/product_1684823630c287cf82ac21e4edb4fb3e83ebc928f2.webp", "https://storage-asset.msi.com/global/picture/product/product_1684823637625513dce7b52d7bbec9e546f8f58586.webp", "https://storage-asset.msi.com/global/picture/product/product_1684823634257687253fc3e0a9d76228ea118402bc.webp", "https://storage-asset.msi.com/global/picture/product/product_16848236396e7b0ad397d7f1e1f31546248b0237a2.webp"],
        description: "Hız ve lüksün buluşma noktası. Özel AMG tasarımı.",
        features: ["4K OLED Ekran", "Özel AMG Kutu İçeriği", "RTX 4070"],
        comments: []
    },
    {
        id: 25,
        name: "ASUS TUF Gaming A15 Ryzen 9 RTX 4074",
        category: "laptop",
        brand: "ASUS",
        price: 52000.00,
        images: ["https://www.incehesap.com/resim/urun/202502/67a9c872c769c5.64414434_mpoefinjglkqh_500.webp", "https://dlcdnwebimgs.asus.com/gain/8b25250f-bf55-425f-93bd-b5d8e2744b3e/", "https://dlcdnwebimgs.asus.com/gain/3f72ffb4-f1a5-47f6-afb2-32be91033ccf/"],
        description: "Dayanıklı ve güçlü. Her ortamda oyun oynamak için tasarlandı.",
        features: ["Ryzen 9 7940HS", "RTX 4070 140W", "90Wh Batarya"],
        comments: []
    },
    {
        id: 26,
        name: "HP Victus 16 Core i7 RTX 4064 Performance",
        category: "laptop",
        brand: "HP",
        price: 38000.00,
        images: ["https://m.media-amazon.com/images/I/71hPcioT75L._AC_UF1000,1000_QL80_.jpg", "data:image/jpeg;base64,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", "data:image/jpeg;base64,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"],
        description: "Dengeli performans, sade tasarım. Öğrenciler ve oyuncular için.",
        features: ["Core i7-13700H", "RTX 4060", "Geniş Ekran"],
        comments: []
    },

    // MAINBOARD (ANAKART)
    {
        id: 27,
        name: "ASUS ROG Maximus Z790 Dark Hero WiFi",
        category: "mainboard",
        brand: "ASUS",
        price: 28000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/142601-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/142601-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/142601-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/142601-8_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/142601-9_large.jpg"],
        description: "En ekstrem Intel sistemler için özel güç tasarımı.",
        features: ["Z790 Chipset", "WiFi 7 Desteği", "PCIe 5.0 Ready"],
        comments: []
    },
    {
        id: 28,
        name: "MSI MPG B650 Carbon WiFi AM5 Gaming",
        category: "mainboard",
        brand: "MSI",
        price: 11000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136058-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136058-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136058-4_large.jpg ", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136058-5_large.jpg"],
        description: "AMD Ryzen 7000 serisi için en istikrarlı platform.",
        features: ["DDR5 Desteği", "Gelişmiş Soğutma", "Zengin Bağlantı"],
        comments: []
    },
    {
        id: 29,
        name: "ASUS ROG STRIX X670E-F Gaming WiFi Motherboard",
        category: "mainboard",
        brand: "ASUS",
        price: 16000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/rog-strix-x670e-f-gaming-wifi-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/rog-strix-x670e-f-gaming-wifi-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/rog-strix-x670e-f-gaming-wifi-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/rog-strix-x670e-f-gaming-wifi-5_large.jpg"],
        description: "Hızaşırtma tutkunları için AMD'nin güç merkezi.",
        features: ["Dual PCIe 5.0", "18+2 Güç Fazı", "Q-Release Mandalı"],
        comments: []
    },
    {
        id: 30,
        name: "GIGABYTE Z790 AORUS Master E-ATX High-End",
        category: "mainboard",
        brand: "GIGABYTE",
        price: 22000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gigabyte/thumb/144848-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gigabyte/thumb/144848-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gigabyte/thumb/144848-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gigabyte/thumb/144848-6_large.jpg"],
        description: "Maksimum genişleme ve soğutma kapasitesine sahip anakart.",
        features: ["Direkt 20+1+2 Faz", "Gelişmiş Isı Boruları", "Marvell 10GbE LAN"],
        comments: []
    },
    {
        id: 31,
        name: "MSI MAG Z790 Tomahawk WiFi DDR5 Edition",
        category: "mainboard",
        brand: "MSI",
        price: 10500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136322-1-min_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136322-2-min_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136322-4-min_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/136322-5-min_large.jpg"],
        description: "Dayanıklı bileşenler, şık ve sade tasarım.",
        features: ["DDR5 7200+(OC)", "Geniş Heatsink", "Lightning Gen5"],
        comments: []
    },
    {
        id: 32,
        name: "ASUS TUF B760-PLUS WiFi DDR4 Stable",
        category: "mainboard",
        brand: "ASUS",
        price: 6500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/137499-7_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/137499-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/137499-2_large.jpg", ""],
        description: "Kararlı ve uzun ömürlü sistem kurmak isteyenler için.",
        features: ["DDR4 Uyumluluk", "TUF Koruma", "WiFi 6"],
        comments: []
    },

    // RAM
    {
        id: 33,
        name: "Corsair Dominator Titanium 32GB 7200MHz RGB",
        category: "ram",
        brand: "CORSAIR",
        price: 7500.00,
        images: ["https://reimg-teknosa-cloud-prod.mncdn.com/mnresize/600/600/productimage/784952643/784952643_0_MC/66f05f57c7b449c2a724c00a2611b7bd.jpg", "https://reimg-teknosa-cloud-prod.mncdn.com/mnresize/600/600/productimage/784952643/784952643_1_MC/dda4fe46cf7f48b9acd4d7d8df527b87.jpg", "https://reimg-teknosa-cloud-prod.mncdn.com/mnresize/600/600/productimage/784952643/784952643_4_MC/b1a6dbee7bcd416fafac9ba468f0da4d.jpg"],
        description: "Dünyanın en iyi bellekleri. Değiştirilebilir üst kapak tasarımı.",
        features: ["DHX Soğutma", "iCUE Kontrol", "Yüksek Limitli Çipler"],
        comments: []
    },
    {
        id: 34,
        name: "G.Skill Trident Z5 RGB 64GB 6000MHz Kit",
        category: "ram",
        brand: "G.SKILL",
        price: 9000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gskill/thumb/149393-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gskill/thumb/149393-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/gskill/thumb/149393-4_large.jpg"],
        description: "İkonik tasarım, sınırsız performans. Bellek dünyasının stili.",
        features: ["64GB Devasa Kapasite", "Ryzen Uyumluluk", "Kristal RGB"],
        comments: []
    },
    {
        id: 35,
        name: "Kingston Fury Beast 16GB 5200MHz DDR5 Single",
        category: "ram",
        brand: "KINGSTON",
        price: 2000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/kingston/thumb/137464-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/kingston/thumb/137464-2_large.jpg"],
        description: "Hızlı, şık ve bütçe dostu DDR5 geçişi.",
        features: ["Düşük Profil", "Intel XMP 3.0", "Hata Düzeltme (ODECC)"],
        comments: []
    },
    {
        id: 36,
        name: "Crucial Pro 32MHz DDR5 Performance Kit",
        category: "ram",
        brand: "CRUCIAL",
        price: 4000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/crucial/thumb/143624-1-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/crucial/thumb/143624-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/crucial/thumb/143624-3_large.jpg"],
        description: "İş istasyonları ve oyun bilgisayarları için stabilize bellekler.",
        features: ["ECC Desteği", "Yüksek Kararlılık", "Siyah Soğutucu"],
        comments: []
    },

    // STORAGE (DEPOLAMA)
    {
        id: 37,
        name: "Samsung 990 Pro 2TB NVMe Gen4 SSD",
        category: "storage",
        brand: "SAMSUNG",
        price: 7200.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/136354-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/136354-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/136354-5_large.jpg"],
        description: "Sektörün en hızlı Gen4 sürücüsü. Hızda rakipsiz.",
        features: ["7450MB/s Okuma", "Samsung Kontrolcü", "Isı Kontrol Yazılımı"],
        comments: []
    },
    {
        id: 38,
        name: "Crucial T700 1TB Gen5 NVMe (Heat Sink)",
        category: "storage",
        brand: "CRUCIAL",
        price: 7500.00,
        images: ["https://www.shoppingexpress.com.au/assets/full/CT1000T700SSD5.jpg?20230615122520", "https://productimages.hepsiburada.net/s/432/960-1280/110000464218692.jpg"],
        description: "Gen5 teknolojisiyle okuma hızlarında yeni çağ.",
        features: ["12000MB/s Okuma", "Özel Soğutma Bloğu", "Gecikmesiz Yükleme"],
        comments: []
    },
    {
        id: 39,
        name: "Kingston KC3000 1TB NVMe M.2 Fast",
        category: "storage",
        brand: "KINGSTON",
        price: 3500.00,
        images: ["https://productimages.hepsiburada.net/s/777/424-600/110000890342512.jpg/format:webp", "https://productimages.hepsiburada.net/s/777/424-600/110000890342514.jpg/format:webp"],
        description: "Performans ve dayanıklılığın buluştuğu nokta.",
        features: ["7000MB/s Yazma", "Grafen Isı Dağıtıcı", "Full Güvenlik"],
        comments: []
    },
    {
        id: 40,
        name: "Seagate IronWolf 8TB NAS Hard Drive",
        category: "storage",
        brand: "SEAGATE",
        price: 9000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/seagate/thumb/TeoriV2-104890_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/seagate/thumb/TeoriV2-104890-1_large.jpg"],
        description: "7/24 çalışma odaklı, devasa veri depolama alanı.",
        features: ["8TB Kapasite", "RV Sensörleri", "AgileArray Teknolojisi"],
        comments: []
    },

    // CASE (KASA)
    {
        id: 41,
        name: "Lian Li O11 Dynamic EVO RGB White Chassis",
        category: "case",
        brand: "LIAN LI",
        price: 6500.00,
        images: ["https://m.media-amazon.com/images/I/61a0VWNb7UL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/61hkwVSw5-L._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/615NZy6zU6L._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/61w5FUhtO-L._AC_SL1000_.jpg"],
        description: "Beyaz akvaryum tasarımı. Sisteminizi her açıdan görün.",
        features: ["Ön Panel Cam", "RGB Desteği", "Dikey GPU Desteği"],
        comments: []
    },
    {
        id: 42,
        name: "NZXT H9 Flow RGB Dual-Chamber Black Box",
        category: "case",
        brand: "NZXT",
        price: 5500.00,
        images: ["https://cdn.akakce.com/z/nzxt/nzxt-h9-flow-rgb-large-fanli-e-atx-oyuncu-kasasi.jpg"],
        description: "Maksimum hava akışı ve şık bölmeli tasarım.",
        features: ["Geniş Hacim", "360mm Radyatör Desteği", "NZXT HUB Dahil"],
        comments: []
    },
    {
        id: 43,
        name: "Corsair iCUE 5000D RGB Airflow Mid-Tower",
        category: "case",
        brand: "CORSAIR",
        price: 5000.00,
        images: ["https://m.media-amazon.com/images/I/61zTrUPEzSL._AC_SY879_.jpg", "https://m.media-amazon.com/images/I/81uhPiHPG6L._AC_SX522_.jpg", "https://m.media-amazon.com/images/I/81XM13L9bPL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/81kpe98J6bL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/61bLMZyvhLL._AC_SL1068_.jpg"],
        description: "Kolay kablo yönetimi ve devasa hava akışı kanalları.",
        features: ["RapidRoute Kablo", "3x RGB Fan", "Mıknatıslı Filtreler"],
        comments: []
    },
    {
        id: 44,
        name: "ASUS ROG Helios GX601 Luxury Chassis",
        category: "case",
        brand: "ASUS",
        price: 11000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/155324-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/155324-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/155324-7_large.jpg"],
        description: "Taşıma kayışları ve fırçalanmış alüminyum ile premium tasarım.",
        features: ["E-ATX Desteği", "Ön Panel LED", "Çizilmez Cam"],
        comments: []
    },

    // COOLING (SOĞUTUCU)
    {
        id: 45,
        name: "ASUS ROG Ryujin III 360 LCD Liquid Cooler",
        category: "cooling",
        brand: "ASUS",
        price: 14000.00,
        images: ["https://cdn.akakce.com/z/asus/asus-rog-ryujin-iii-360-argb-islemci-sivi-sogutucu.jpg", "https://productimages.hepsiburada.net/s/777/848-1200/110000888747991.jpg/format:webp", "https://productimages.hepsiburada.net/s/777/848-1200/110000888747994.jpg/format:webp"],
        description: "LCD ekranıyla sistem verilerini anlık takip edin.",
        features: ["3.5\" LCD Ekran", "Noctua Fanlar", "8. Nesil Asetek Pompa"],
        comments: []
    },
    {
        id: 46,
        name: "NZXT Kraken Elite 360 RGB White LCD",
        category: "cooling",
        brand: "NZXT",
        price: 11000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/nzxt/thumb/152824-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/nzxt/thumb/152824-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/nzxt/thumb/152824-4_large.jpg"],
        description: "Farklı GIF'ler yükleyebileceğiniz yüksek çözünürlüklü ekran.",
        features: ["Wide Angle LCD", "F Serisi RGB Fan", "Sessiz Operasyon"],
        comments: []
    },
    {
        id: 47,
        name: "DeepCool AK620 Digital Air Cooler Tower",
        category: "cooling",
        brand: "DEEPCOOL",
        price: 3000.00,
        images: ["https://www.novabilgisayar.com/urunler/DEEPCOOL-AK620-DIGITAL-PRO.jpg", "https://www.novabilgisayar.com/urunler/DEEPCOOL-AK620-DIGITAL-PRO-1.jpg", "https://www.novabilgisayar.com/urunler/DEEPCOOL-AK620-DIGITAL-PRO-2.jpg"],
        description: "Hava soğutmanın zirvesi. Dijital sıcaklık paneli ile.",
        features: ["Sıcaklık Ekranı", "Altı Isı Borusu", "Çift Kule Tasarım"],
        comments: []
    },
    {
        id: 48,
        name: "ARCTIC Liquid Freezer II 360 A-RGB High-End",
        category: "cooling",
        brand: "ARCTIC",
        price: 4500.00,
        images: ["https://inventus.com.tr/Images/products/v3/14057_01.jpg", "https://inventus.com.tr/Images/products/v3/14057_02.jpg", "https://inventus.com.tr/Images/products/v3/14057_07.jpg", "https://inventus.com.tr/Images/products/v3/14057_08.jpg"],
        description: "Anakart VRM'lerini soğutan özel pompa tasarımı.",
        features: ["PWM Pompa", "Gömülü Fan (VRM)", "Kalın Radyatör"],
        comments: []
    },

    // MONITOR
    {
        id: 49,
        name: "Samsung Odyssey Neo G9 49\" 240Hz OLED Box",
        category: "monitor",
        brand: "SAMSUNG",
        price: 45000.00,
        images: ["https://images.samsung.com/is/image/samsung/p6pim/tr/ls49dg934suxuf/gallery/tr-odyssey-oled-g9-g93sd-ls49dg934suxuf-545072647?$Q90_1920_1280_F_PNG$", "https://images.samsung.com/is/image/samsung/p6pim/tr/ls49dg934suxuf/gallery/tr-odyssey-oled-g9-g93sd-ls49dg934suxuf-545072618?$Q90_1368_1094_F_JPG$", "https://images.samsung.com/is/image/samsung/p6pim/tr/ls49dg934suxuf/gallery/tr-odyssey-oled-g9-g93sd-ls49dg934suxuf-545072621?$Q90_1368_1094_F_JPG$", "https://images.samsung.com/is/image/samsung/p6pim/tr/ls49dg934suxuf/gallery/tr-odyssey-oled-g9-g93sd-ls49dg934suxuf-545072624?$Q90_1368_1094_F_JPG$", "https://images.samsung.com/is/image/samsung/p6pim/tr/ls49dg934suxuf/gallery/tr-odyssey-oled-g9-g93sd-ls49dg934suxuf-545072630?$Q90_1368_1094_F_JPG$"],
        description: "Oyunun içinde yaşayın. Ultra geniş kavisli panel.",
        features: ["240Hz OLED", "49 İnç Dev Ekran", "Infinite Lighting"],
        comments: []
    },
    {
        id: 50,
        name: "ASUS ROG Swift OLED PG27AQDM Gaming Monitor",
        category: "monitor",
        brand: "ASUS",
        price: 32000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/138395_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/138395-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/138395-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/138395-6_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/asus/thumb/138395-7_large.jpg"],
        description: "Espor için mükemmel OLED. Gerçek 0.03ms gecikme.",
        features: ["240Hz Refresh Rate", "Intelligent Heat Sink", "Uniform Brightness"],
        comments: []
    },
    {
        id: 51,
        name: "MSI MAG 274UPF 4K 144Hz IPS Pro Gaming",
        category: "monitor",
        brand: "MSI",
        price: 18000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/141918-2-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/141918-4-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/141918-6_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/msi/thumb/141918-8_large.jpg"],
        description: "4K Keskinlik ve 144Hz akıcılık bir arada.",
        features: ["4K UHD Çözünürlük", "IPS Canlı Renkler", "65W USB-C PD"],
        comments: []
    },

    // ACCESSORIES (AKSESUARLAR)
    {
        id: 52,
        name: "Logitech G Pro X Superlight 2 (Pink Version)",
        category: "accessories",
        brand: "LOGITECH",
        price: 5200.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-2-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-4-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-5-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-6-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-7-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/153350-9-1_large.jpg"],
        description: "Dünyanın en hafif ve en hızlı kablosuz faresi.",
        features: ["60g Ağırlık", "HERO 2 Sensör", "95 Saat Pil"],
        comments: []
    },
    {
        id: 53,
        name: "ASUS ROG Azoth Wireless Mechanical 75% Keyboard",
        category: "accessories",
        brand: "ASUS",
        price: 9500.00,
        images: ["https://m.media-amazon.com/images/I/61UvNbsmDrL._SX522_.jpg", "https://m.media-amazon.com/images/I/810Jo2bHccL._SX522_.jpg", "https://m.media-amazon.com/images/I/81B3uf9s78L._SX522_.jpg", "https://m.media-amazon.com/images/I/810ntHwIlmL._SX522_.jpg", "https://m.media-amazon.com/images/I/81-MMIJ2iuL._SX522_.jpg"],
        description: "Yazma deneyiminde devrim. OLED ekranlı lüks klavye.",
        features: ["Hot-Swappable Switch", "OLED Gösterge", "Gasket Mount"],
        comments: []
    },
    {
        id: 54,
        name: "SteelSeries Arctis Nova Pro Wireless High-End",
        category: "accessories",
        brand: "STEELSERIES",
        price: 14500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137554-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137554-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137554-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137554-4_large.jpg"],
        description: "Oyun dünyasının en iyi ses kalitesi. Aktif gürültü engelleme.",
        features: ["GameDAC Gen 2", "Multi-System Connect", "Değiştirilebilir Pil"],
        comments: []
    },
    {
        id: 55,
        name: "Razer DeathAdder V3 Pro Wireless Viper Gen",
        category: "accessories",
        brand: "RAZER",
        price: 5000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/146350-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/146350-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/146350-5_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/146350-6_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/146350-7_large.jpg"],
        description: "Profesyonel ergonomi ve inanılmaz hafiflik.",
        features: ["30K Optik Sensör", "63g Ağırlık", "90 Saat Pil Ömrü"],
        comments: []
    },
    {
        id: 56,
        name: "ASUS ROG Delta S Animate Special Edition",
        category: "accessories",
        brand: "ASUS",
        price: 8500.00,
        images: ["https://productimages.hepsiburada.net/s/253/424-600/110000235707262.jpg/format:webp", "https://productimages.hepsiburada.net/s/253/424-600/110000235707263.jpg/format:webp"],
        description: "AniMe Matrix göstergeli, Hi-Res ses sertifikalı kulaklık.",
        features: ["Custom matrix LED", "Quad-DAC Teknolojisi", "Gürültü Engelleyici Mic"],
        comments: []
    },
    {
        id: 57,
        name: "Razer BlackWidow V4 Pro Mechanical Gaming Keyboard",
        category: "accessories",
        brand: "RAZER",
        price: 9000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/139491-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/139491-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/razer/thumb/139491-5_large.jpg"],
        description: "Kontrolün zirvesi. 8 atanabilir makro tuşu ve Razer Command Dial.",
        features: ["Razer Green Switches", "Çift Taraflı Underglow", "Manyetik Deri Bilek Desteği"],
        comments: []
    },
    {
        id: 58,
        name: "Logitech G502 X Plus Lightspeed Wireless RGB",
        category: "accessories",
        brand: "LOGITECH",
        price: 5500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/135532-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/135532-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/135532-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/logitech/thumb/135532-6_large.jpg"],
        description: "Efsanevi G502 tasarımının en gelişmiş kablosuz versiyonu.",
        features: ["LIGHTFORCE Hibrit Switchler", "LIGHTSYNC RGB", "HERO 25K Sensör"],
        comments: []
    },
    {
        id: 59,
        name: "HyperX Cloud III Wireless Gaming Headset",
        category: "accessories",
        brand: "HYPERX",
        price: 6000.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-3_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-7_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/hyperx/thumb/143752-6_large.jpg"],
        description: "Efsanevi konfor ve 120 saate kadar inanılmaz pil ömrü.",
        features: ["53mm Açılı Sürücüler", "DTS Headphone:X v2.0", "Ultra Temiz Mic"],
        comments: []
    },
    {
        id: 60,
        name: "SteelSeries Rival 5 Destiny 2 Edition Mouse",
        category: "accessories",
        brand: "STEELSERIES",
        price: 2500.00,
        images: ["https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137437-1_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137437-2_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137437-4_large.jpg", "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/steelseries/thumb/137437-6_large.jpg"],
        description: "Çok yönlü, hafif ve Destiny 2 temalı özel tasarım.",
        features: ["9 Atanabilir Tuş", "PrismSync RGB", "TrueMove Air Sensör"],
        comments: []
    },
    {
        id: 61,
        name: "Corsair MM700 RGB Extended Mouse Pad",
        category: "accessories",
        brand: "CORSAIR",
        price: 2500.00,
        images: ["https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Mousepads/base-mm700-rgb-config/Gallery/MM700_RGB_01.webp", "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Mousepads/base-mm700-rgb-config/Gallery/MM700_RGB_02.webp", "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Mousepads/base-mm700-rgb-config/Gallery/MM700_RGB_03.webp", "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Mousepads/base-mm700-rgb-config/Gallery/MM700_RGB_06.webp"],
        description: "Geniş yüzey, 360 derece RGB aydınlatma ve USB hub.",
        features: ["930mm x 400mm Boyut", "3 Bölmeli RGB", "Düşük Sürtünmeli Kumaş"],
        comments: []
    }


];

window.initialProducts = initialProducts;

