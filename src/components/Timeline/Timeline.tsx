import { motion } from 'framer-motion';
import styles from './Timeline.module.css';
import type { TimelineItem } from '../../types';

interface TimelineProps {
  items: TimelineItem[];
}

function Timeline({ items }: TimelineProps) {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <motion.article
          key={`${item.year}-${item.title}`}
          className={styles.item}
          initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <div className={styles.dot} />
          <div className={styles.card}>
            <span className={styles.year}>{item.year}</span>
            <h3>{item.title}</h3>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default Timeline;