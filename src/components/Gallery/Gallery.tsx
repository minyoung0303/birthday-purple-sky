import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery.module.css';

interface GalleryProps {
  images: string[];
}

function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <motion.button
            key={image}
            className={styles.item}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`갤러리 이미지 ${index + 1}`} className={styles.image} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="확대된 갤러리 이미지"
              className={styles.lightboxImage}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Gallery;