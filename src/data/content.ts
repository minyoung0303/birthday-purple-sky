import heroImage from '../assets/happybirthday.gif';
import cookiesImage from '../assets/cookies.png';
import hakjoongImage from '../assets/hakjoong.png';
import outingImage from '../assets/outing.png';
import type { BirthdayConfig, TimelineItem } from '../types';

export const birthdayConfig: BirthdayConfig = {
  title: 'Happy Birthday',
  name: '김학중',
  date: '2026.07.06',
  heroMessage: 'Happy Birthday!',
  heroSubMessage: '오늘이 가장 행복한 하루가 되길 바라.',
  heroImage,
  galleryImages: [outingImage, hakjoongImage, cookiesImage]
};

export const timelineItems: TimelineItem[] = [
  { year: '2023', title: '첫 여행' },
  { year: '2024', title: '첫 콘서트' },
  { year: '2025', title: '맛있는 케이크' }
];

export const navItems = [
  { key: 'main', label: 'Main' },
  { key: 'messages', label: 'Messages' },
  { key: 'gallery', label: 'Gallery' }
] as const;

export const messageEmojis = ['🎂', '✨', '🦋', '🌙', '⭐'];