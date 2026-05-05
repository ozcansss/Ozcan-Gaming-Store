const fs = require('fs');

let data = fs.readFileSync('js/data.js', 'utf8');

// Parse initialProducts by evaluating the file content (mostly safe since it's just data)
// We'll extract the array part.
const startIndex = data.indexOf('const initialProducts = [');
const endIndex = data.lastIndexOf('];') + 2;

let arrayContent = data.substring(startIndex + 'const initialProducts = '.length, endIndex);

// Just executing to get the object
let products;
try {
    eval('products = ' + arrayContent);
} catch (e) {
    console.error('Parse error:', e);
    process.exit(1);
}

const extraFeatures = {
    gpu: ["NVIDIA DLSS 3 veya AMD FSR Desteği", "Gelişmiş Işın İzleme (Ray Tracing) Çekirdekleri", "PCIe 4.0 Uyumluluğu", "3 Adet DisplayPort 1.4a", "1 Adet HDMI 2.1a", "Genişletilmiş Bakır Soğutma Boruları", "0dB Zero-Fan Teknolojisi"],
    cpu: ["Çoklu Çekirdek Performansı", "Gelişmiş L3 Önbellek Bellek", "PCIe 5.0 ve DDR5 Desteği", "Düşük Güç Tüketimi (TDP)", "Yüksek Saat Hızı Frekansları"],
    mainboard: ["M.2 Termal Koruma (Shield Frozr)", "Çift Kanal DDR Bellek Mimarisi", "Gelişmiş Dijital VRM Soğutma Sızdırmazlığı", "Çoklu ARGB ve RGB Başlıkları", "Gelişmiş LAN ve Kablosuz Ağ Opsiyonları", "PCI-E Çelik Zırh Desteği"],
    ram: ["Yüksek Kaliteli Alüminyum Soğutucu", "XMP / EXPO Destekli Otomatik Hız Aşırtma", "Düşük Gecikme (CL) Değerleri", "Ömür Boyu Sınırlı Garanti", "Geniş Uyumluluk Onayı"],
    case: ["Çizilmeye Dayanıklı Temperli Cam Yan Panel", "Yüksek Hava Akışlı (High-Airflow) Mesh Ön Panel", "Kablo Yönetimi (Cable Management) Alanları", "Manyetik Toz Filtreleri", "ATX, Micro-ATX, Mini-ITX Uyumlu", "Dahili aRGB Fan Sistemi"],
    monitor: ["NVIDIA G-Sync & AMD FreeSync Premium Desteği", "Flicker-Free (Titreşim Engelleme) Teknolojisi", "Low Blue Light (Düşük Mavi Işık) Filtresi", "VESA Duvara Montaj Uyumu", "İnce Çerçeveli Ergonomik Tasarım", "Ultra Düşük Gecikmeli Panel (1ms/0.5ms)"],
    laptop: ["Yeni Nesil Wi-Fi 6E ve Bluetooth 5.3", "RGB Özelleştirilebilir Oyuncu Klavyesi", "Gelişmiş Bakır/Buhar Odacıklı Soğutma Sistemi", "Thunderbolt 4 / Type-C Güç Dağıtımı", "Dolby Atmos Destekli Ses Sistemi", "İnce, Hafif ve Taşınabilir Kasa"],
    accessories: ["Kopmaya Karşı Korumalı Örgü Kablo", "Altın Kaplama Gecikmesiz USB Uçları", "Özelleştirilebilir Makro Tuşları", "Uzun Ömürlü Mekanik veya Optik Switchler", "Ergonomik Uzun Süreli Kullanım Tasarımı"],
    storage: ["Gelişmiş 3D NAND Katman Mimarisi", "Sıralı ve Rastgele Yüksek Okuma/Yazma Hızı", "Şok ve Titreşimlere Karşı Gelişmiş Dayanıklılık", "Pasif Soğutucu Blok Uyumluluğu", "Veri Kurtarma ve Şifreleme Sistemleri"],
    cooling: ["Ultra Sessiz ve Uzun Ömürlü Fan Motoru", "Örgülü ve Sızdırmaz Sıvı Soğutma Hortumları", "Tamamen Özelleştirilebilir ARGB Pompa Yüzeyi", "Yüksek Statik Basınç Değerleri", "Kolay Montaj (Intel/AMD Uyumlu) braketleri"],
    psu: ["OVP/OPP/UVP Aşırı Akım ve Güç Korumaları", "Aktif PFC (>0.9) Enerji Dönüşümü", "Yüksek Sıcaklığa Dayanıklı Japon Kapasitörler", "Sessiz Çalışan Smart Fan Kontrolcüsü", "Modüler Esnek Kablolama Sistemi"],
    oem: ["2 Yıl Ücretsiz Özcan Gaming Garantisi", "Uzman Ekip Tarafından Montaj ve Stres Testi Yapılmıştır", "4 Adet 120mm aRGB Fanlı Oyuncu Kasası", "Lisanslı Windows 11 Deneme Sürümü Yüklü", "Tak-Çalıştır Kullanıma Hazır Tasarım", "Geleceğe Dönük Upgrade (Parça Değiştirme) İmkanı"]
};

products.forEach(p => {
    // Basic fix for features
    if (!p.features) p.features = [];

    // Add class extra features safely
    const extras = extraFeatures[p.category] || [];

    // Pick 3 random or top 3 extra features to add so it doesn't get ridiculously long
    // actually, let's just add 4 of them
    const newExtras = extras.slice(0, 4);

    newExtras.forEach(f => {
        if (!p.features.includes(f)) {
            p.features.push(f);
        }
    });

    // Special fix for OEM based on recent user changes
    if (p.id === 65) {
        p.features = [
            "Intel Core i5 12400F İşlemci",
            "GeForce RTX 5060 Ekran Kartı",
            "16GB (2x8) DDR4 RAM",
            "500GB M.2 Nvme SSD",
            "H610M Anakart",
            ...extras
        ];
    }
    if (p.id === 66) {
        p.features = [
            "AMD Ryzen 5 5500 İşlemci",
            "GeForce RTX 5060 Ekran Kartı",
            "16GB (2x8) DDR4 RAM",
            "500GB M.2 Nvme SSD",
            "A520M Anakart",
            ...extras
        ];
    }
    if (p.id === 67) {
        p.features = [
            "AMD Ryzen 5 7500F İşlemci",
            "GeForce RTX 5060 Ekran Kartı",
            "16GB (2x8) DDR5 RAM",
            "500GB M.2 Nvme SSD",
            "A620M Anakart",
            ...extras
        ];
    }
});

let newData = data.substring(0, startIndex) + 'const initialProducts = ' + JSON.stringify(products, null, 4) + ';\n\nwindow.initialProducts = initialProducts;\n';

fs.writeFileSync('js/data.js', newData, 'utf8');
console.log('Update successful');
