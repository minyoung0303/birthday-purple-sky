export type NavSection = 'main' | 'messages' | 'gallery' | 'memories';

export interface BirthdayConfig {
  title: string;
  name: string;
  date: string;
  heroMessage: string;
  heroSubMessage: string;
  heroImage: string;
  galleryImages: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
}

export interface BirthdayMessage {
  id: string;
  nickname: string;
  text: string;
  image_url: string | null;
  created_at: string;
}