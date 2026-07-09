import { motion } from 'framer-motion';
import styles from './MessageList.module.css';
import type { BirthdayMessage } from '../../types';
import { messageEmojis } from '../../data/content';

interface MessageListProps {
  messages: BirthdayMessage[];
  loading: boolean;
  error: string;
}

function MessageList({ messages, loading, error }: MessageListProps) {
  const emojiForIndex = (index: number) => messageEmojis[index % messageEmojis.length];

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <h3>Birthday Notes</h3>
        <p>따뜻한 축하가 유리빛 카드 위에 차곡차곡 쌓여요.</p>
      </div>

      {loading && <div className={styles.state}>메시지를 불러오는 중...</div>}
      {!loading && error && <div className={styles.state}>{error}</div>}
      {!loading && !error && messages.length === 0 && (
        <div className={styles.state}>아직 메시지가 없어요. 첫 번째 축하를 남겨보세요.</div>
      )}

      <div className={styles.list}>
        {messages.map((message, index) => (
          <motion.article
            key={message.id}
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.emoji}>{emojiForIndex(index)}</span>
              <div>
                <strong>{message.nickname}</strong>
                <p>{new Date(message.created_at).toLocaleString('ko-KR')}</p>
              </div>
            </div>
            <p className={styles.text}>{message.text}</p>
            {message.image_url && (
              <div className={styles.imageWrapper}>
                <img
                  src={message.image_url}
                  alt={`${message.nickname}님이 첨부한 사진`}
                  className={styles.messageImage}
                  loading="lazy"
                />
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default MessageList;