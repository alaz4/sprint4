import type { CampusEvent } from "../types/campus-event";

export const events: CampusEvent[] = [
  {
    id: "event-1",
    title: "Kariyer Günleri 2026",
    category: "Seminer",
    capacity: 120,
    date: "12-10-2026",
    time: "14:00",
    location: "A Blok Konferans Salonu",
    description: "Mezunlarla söyleşiler ve kariyer tavsiyeleri.",
    image: "/resim1.jpeg"
  },
  {
    id: "event-2",
    title: "Web Teknolojileri Çalıştayı",
    category: "Atölye",
    capacity: 40,
    date: "15-10-2026",
    time: "10:30",
    location: "Yazılım Laboratuvarı 2",
    description: "Modern HTML, CSS ve JS ile web geliştirme eğitimi.",
    image: "/resim1.jpeg"
  },
  {
    id: "event-3",
    title: "Yapay Zeka ve Gelecek Semineri",
    category: "Seminer",
    capacity: 150,
    date: "18-10-2026",
    time: "13:00",
    location: "C Blok Amfi 1",
    description: "Üretken yapay zeka modelleri ve günlük kullanım alanları.",
    image: "/resim1.jpeg"
  },
  {
    id: "event-4",
    title: "Mobil Uygulama Geliştirme Atölyesi",
    category: "Atölye",
    capacity: 35,
    date: "22-10-2026",
    time: "11:00",
    location: "Yazılım Laboratuvarı 1",
    description: "Cross-platform mobil uygulama geliştirme pratikleri.",
    image: "/resim1.jpeg"
  },
  {
    id: "event-5",
    title: "Kampüs Müzik Festivali",
    category: "Konser",
    capacity: 500,
    date: "28-10-2026",
    time: "18:00",
    location: "Açık Hava Şenlik Alanı",
    description: "Öğrenci grupları ve konuk sanatçıların sahne performansı.",
    image: "/resim1.jpeg"
  },
  {
    id: "event-6",
    title: "Algoritma ve Problem Çözme Yarışması",
    category: "Yarışma",
    capacity: 60,
    date: "05-11-2026",
    time: "09:30",
    location: "Bilgisayar Mühendisliği Katı",
    description: "Ödüllü 24 saatlik hackathon ve kodlama maratonu.",
    image: "/resim1.jpeg"
  }
];