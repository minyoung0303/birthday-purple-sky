import { motion } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  name: string;
  date: string;
}

function Hero({ title, name, date }: HeroProps) {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.sheepWrap}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className={styles.sheep} role="img" aria-label="sheep">
          🐑
        </span>
      </motion.div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className={styles.title}>{title}</p>
        <h1 className={styles.name}>{name}</h1>
        <span className={styles.date}>{date}</span>
      </motion.div>
    </section>
  );
}

export default Hero;