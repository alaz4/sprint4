import { useEffect, useState } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import { filterByCategory, findEventById, searchEvents } from "./utils/filter-events";

// Sayfa isimleri tipi
type PageName = "home" | "events" | "detail" | "add" | "edit";

// Menü ögeleri
const navItems: { label: string; page: PageName }[] = [
  { label: "Ana Sayfa", page: "home" },
  { label: "Etkinlikler", page: "events" },
  { label: "Ekle", page: "add" },
];

// Tarih Formatlama Yardımcı Fonksiyonu
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parts[0];
    const month = Number(parts[1]) - 1;
    const year = parts[2];
    const d = new Date(Number(year), month, Number(day));
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  return dateStr;
}

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Arama metni ve seçili kategori için State'ler
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  // Kategori seçeneklerini veriden dinamik üret
  const categories = [...new Set(events.map((e) => e.category))];

  // Filtreli listeyi her çizimde (render) hesapla
  const searched = searchEvents(events, searchText);
  const filteredEvents = filterByCategory(searched, selectedCategory);

  // Seçili etkinliği hesapla
  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  // ADIM 11: useEffect ile Dinamik Sekme Başlığı (document.title)
  useEffect(() => {
    let title = "Ana Sayfa";

    if (page === "events") {
      title = "Etkinlikler";
    } else if (page === "add") {
      title = "Etkinlik Ekle";
    } else if (page === "edit") {
      title = "Etkinlik Güncelle";
    } else if (page === "detail") {
      title = selected ? selected.title : "Etkinlik Detayı";
    }

    document.title = `Kampüs Etkinlikleri — ${title}`;
  }, [page, selectedId, selected]);

  // Ana Sayfa için yaklaşan 2 etkinlik
  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  // Kart JSX'ini döndüren yardımcı fonksiyon
  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="kart-gorsel"
            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
          />
        )}
        <h3>{event.title}</h3>
        <p className="kategori">🏷️ {event.category}</p>
        <p className="tarih">📅 {formatDate(event.date)} - {event.time}</p>
        <p className="mekan">📍 {event.location}</p>
        <p className="kontenjan">👥 Kontenjan: {event.capacity} kişi</p>
        <p className="aciklama">{event.description}</p>
        <button
          className="btn-detail"
          onClick={() => go("detail", event.id)}
          style={{ marginTop: "10px", cursor: "pointer" }}
        >
          Detayları Gör
        </button>
      </article>
    );
  }

  return (
    <>
      <header className="site-baslik">
        <h1>🎓 Kampüs Etkinlikleri</h1>
        <p>Üniversitemizdeki tüm etkinlikler tek bir platformda!</p>
      </header>

      <nav className="menu">
        <ul>
          {navItems.map((item) => (
            <li key={item.page}>
              <a
                href="#"
                aria-current={page === item.page ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.page);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {/* ANA SAYFA BLOĞU */}
        {page === "home" && (
          <section className="ana-sayfa">
            <h2>🔥 Yaklaşan Etkinlikler</h2>
            <div className="etkinlik-listesi">
              {upcoming.map(renderCard)}
            </div>
          </section>
        )}

        {/* ETKİNLİKLER SAYFASI BLOĞU */}
        {page === "events" && (
          <section className="etkinlikler-sayfasi">
            <h2>🎉 Tüm Etkinlikler</h2>

            <div className="filtre-alani" style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
              <input
                type="search"
                placeholder="Etkinlik veya açıklama ara..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", flex: "1" }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category | "")}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <p className="sonuc-sayisi" style={{ marginBottom: "15px", fontWeight: "bold" }}>
              {filteredEvents.length === 0
                ? "⚠️ Arama kriterlerinize uygun etkinlik bulunamadı."
                : `Toplam ${filteredEvents.length} etkinlik gösteriliyor.`}
            </p>

            <div className="etkinlik-listesi">
              {filteredEvents.map(renderCard)}
            </div>
          </section>
        )}

        {/* DETAY SAYFASI BLOĞU */}
        {page === "detail" && (
          <section className="detay-sayfasi">
            {!selected && (
              <div className="hata-kutusu" style={{ backgroundColor: "#fef2f2", border: "1px solid #ef4444", padding: "20px", borderRadius: "8px", color: "#991b1b" }}>
                <h2>⚠️ Etkinlik Bulunamadı</h2>
                <p>Aradığınız etkinlik sistemde mevcut değil veya kaldırılmış olabilir.</p>
                <br />
                <button className="btn-detail" onClick={() => go("events")}>
                  ← Etkinliklere Dön
                </button>
              </div>
            )}

            {selected && (
              <article className="detay" style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                {selected.image && (
                  <figure style={{ margin: 0, flex: "1 1 300px" }}>
                    <img
                      src={selected.image}
                      alt={selected.title}
                      style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                    />
                  </figure>
                )}

                <div className="kunye" style={{ flex: "2 1 300px" }}>
                  <h2>{selected.title}</h2>
                  <hr style={{ margin: "10px 0" }} />
                  <p>🏷️ <strong>Kategori:</strong> {selected.category}</p>
                  <p>📅 <strong>Tarih & Saat:</strong> {formatDate(selected.date)} - {selected.time}</p>
                  <p>📍 <strong>Mekan:</strong> {selected.location}</p>
                  <p>👥 <strong>Kontenjan:</strong> {selected.capacity} kişi</p>
                  <p style={{ marginTop: "15px", lineHeight: "1.6" }}>{selected.description}</p>

                  <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button className="btn-detail" onClick={() => go("events")}>
                      ← Listeye Dön
                    </button>
                    <button
                      className="btn-detail"
                      onClick={() => go("edit", selected.id)}
                      style={{ backgroundColor: "#d97706" }}
                    >
                      ✏️ Bu Etkinliği Güncelle
                    </button>
                  </div>
                </div>
              </article>
            )}
          </section>
        )}

        {/* ADIM 13: EKLE VE GÜNCELLE FORM BLOĞU */}
        {(page === "add" || page === "edit") && (
          <section className="form-sayfasi" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2>{page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Etkinlik Adı:
                </label>
                <input
                  type="text"
                  id="title"
                  maxLength={80}
                  placeholder="Örn: Kariyer Günleri"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="category" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Kategori:
                </label>
                <select
                  id="category"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  <option value="">Seçiniz...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="date" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Tarih:
                  </label>
                  <input
                    type="date"
                    id="date"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="time" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Saat:
                  </label>
                  <input
                    type="time"
                    id="time"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="location" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Mekan:
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Örn: A Blok Amfi 1"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="capacity" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Kontenjan:
                </label>
                <input
                  type="number"
                  id="capacity"
                  min={1}
                  max={1000}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="description" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Açıklama:
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Etkinlik detaylarını yazınız..."
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <button
                type="submit"
                className="btn-detail"
                style={{ width: "100%", padding: "10px", backgroundColor: "#059669", color: "#fff", fontWeight: "bold" }}
              >
                {page === "add" ? "Kaydet" : "Güncelle"}
              </button>
            </form>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Kampüs Etkinlik Portalı &middot; Tüm Hakları Saklıdır.</p>
      </footer>
    </>
  );
}

export default App;