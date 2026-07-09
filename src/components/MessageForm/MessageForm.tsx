import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './MessageForm.module.css';
import { supabase } from '../../supabase/client';

interface MessageFormProps {
  onSuccess: () => Promise<void>;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function MessageForm({ onSuccess, disabled = false }: MessageFormProps) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG, GIF, WebP 형식만 업로드할 수 있어요.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('이미지는 5MB 이하만 업로드할 수 있어요.');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('message-images')
      .upload(filePath, file, { contentType: file.type });

    if (error) return null;

    const { data } = supabase.storage
      .from('message-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (disabled || !supabase) {
      setError('Supabase 설정 후 메시지 기능을 사용할 수 있어요.');
      return;
    }

    const trimmedNickname = nickname.trim();
    const trimmedMessage = message.trim();

    if (!trimmedNickname || !trimmedMessage) {
      setError('닉네임과 메시지를 모두 입력해주세요.');
      return;
    }

    if (trimmedNickname.length > 20) {
      setError('닉네임은 20자 이하로 작성해주세요.');
      return;
    }

    if (trimmedMessage.length > 300) {
      setError('메시지는 300자 이하로 작성해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');
    setFeedback('');

    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        setError('이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
        setSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from('birthday_messages').insert([
      {
        nickname: trimmedNickname,
        text: trimmedMessage,
        image_url: imageUrl
      }
    ]);

    if (error) {
      setError('메시지 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    setNickname('');
    setMessage('');
    removeImage();
    setFeedback('메시지가 따뜻하게 전달되었어요.');
    setSubmitting(false);
    await onSuccess();
  };

  return (
    <div className={styles.card}>
      <div className={styles.heading}>
        <h3>Leave a message</h3>
        <p>작은 한마디도 오늘을 더 특별하게 만들어요.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>Nickname</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="최대 20자"
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          <span>Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={300}
            placeholder="마음을 담아 축하 메시지를 남겨주세요."
            className={`${styles.input} ${styles.textarea}`}
          />
        </label>

        <div className={styles.meta}>
          <span>{nickname.length}/20</span>
          <span>{message.length}/300</span>
        </div>

        <div className={styles.imageSection}>
          <span className={styles.imageLabel}>Photo (optional)</span>
          <div className={styles.imageControls}>
            <label className={styles.imageButton}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              📷 사진 첨부
            </label>
            {imageFile && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={removeImage}
              >
                ✕ 제거
              </button>
            )}
          </div>
          {imagePreview && (
            <div className={styles.previewWrapper}>
              <img
                src={imagePreview}
                alt="첨부 이미지 미리보기"
                className={styles.preview}
              />
            </div>
          )}
          <span className={styles.imageHint}>JPG, PNG, GIF, WebP · 최대 5MB</span>
        </div>

        <motion.button
          type="submit"
          className={styles.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={submitting}
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </motion.button>

        {feedback && <p className={styles.feedback}>{feedback}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

export default MessageForm;
