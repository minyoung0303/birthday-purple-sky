import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Home.module.css';
import { birthdayConfig, navItems } from '../../data/content';
import type { BirthdayMessage, NavSection } from '../../types';
import { supabase, hasSupabaseEnv } from '../../supabase/client';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import ParticleBackground from '../../components/ParticleBackground/ParticleBackground';
import MessageForm from '../../components/MessageForm/MessageForm';
import MessageList from '../../components/MessageList/MessageList';
import Gallery from '../../components/Gallery/Gallery';

const sectionIds: NavSection[] = ['main', 'messages', 'gallery'];

function Home() {
  const [activeSection, setActiveSection] = useState<NavSection>('main');
  const [messages, setMessages] = useState<BirthdayMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState('');

  const fetchMessages = async () => {
    if (!hasSupabaseEnv || !supabase) {
      setLoadingMessages(false);
      setMessageError('Supabase 환경변수가 없어 메시지 기능이 비활성화되어 있어요.');
      return;
    }

    setLoadingMessages(true);
    setMessageError('');

    const { data, error } = await supabase
      .from('birthday_messages')
      .select('id, nickname, text, image_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setMessageError('메시지를 불러오지 못했어요.');
      setLoadingMessages(false);
      return;
    }

    setMessages((data ?? []) as BirthdayMessage[]);
    setLoadingMessages(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          threshold: 0.35,
          rootMargin: '-20% 0px -20% 0px'
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (section: NavSection) => {
    const target = document.getElementById(section);
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className={styles.page}>
      <ParticleBackground />

      <Navbar
        activeSection={activeSection}
        navItems={navItems}
        onNavigate={scrollToSection}
      />

      <main className={styles.main}>
        <Hero
          title={birthdayConfig.title}
          name={birthdayConfig.name}
          date={birthdayConfig.date}
        />

        <motion.section
          id="main"
          className={styles.section}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Main</span>
            <h2>For your brightest day</h2>
          </div>

          <motion.div
            className={styles.heroCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', damping: 20, stiffness: 160 }}
          >
            <img
              src={birthdayConfig.heroImage}
              alt="대표 생일 사진"
              className={styles.heroImage}
            />
          </motion.div>

          <div className={styles.mainMessage}>
            <h3>{birthdayConfig.heroMessage}</h3>
            <p>{birthdayConfig.heroSubMessage}</p>
          </div>
        </motion.section>

        <motion.section
          id="messages"
          className={styles.section}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Messages</span>
            <h2>Write a warm note</h2>
          </div>

          <div className={styles.messageSection}>
            <MessageForm
              onSuccess={fetchMessages}
              disabled={!hasSupabaseEnv}
            />
            <MessageList
              messages={messages}
              loading={loadingMessages}
              error={messageError}
            />
          </div>
        </motion.section>

        <motion.section
          id="gallery"
          className={styles.section}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Gallery</span>
            <h2>Moments under violet lights</h2>
          </div>

          <Gallery images={birthdayConfig.galleryImages} />
        </motion.section>
      </main>
    </div>
  );
}

export default Home;