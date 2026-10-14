// Kategori için Union Type (sadece belirli string değerleri alabilir)
export type Category = "Seminer" | "Atölye" | "Söyleşi" | "Yarışma" | "Konser";

// Etkinlik nesnesinin tip tanımı (Interface)
export interface CampusEvent {
  id: string;
  title: string;
  category: Category;
  capacity: number;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string; // Afiş görseli isteğe bağlı (?)
}