import styles from './ParticleBackground.module.css';

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  top: `${(index * 17) % 100}%`,
  size: `${8 + (index % 4) * 6}px`,
  delay: `${(index % 6) * 1.2}s`,
  duration: `${8 + (index % 5) * 2}s`
}));

const stars = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 9.7) % 100}%`,
  top: `${(index * 11.2) % 100}%`,
  delay: `${(index % 8) * 0.8}s`
}));

function ParticleBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={`star-${star.id}`}
          className={styles.star}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay
          }}
        />
      ))}

      {particles.map((particle) => (
        <span
          key={`particle-${particle.id}`}
          className={styles.particle}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
    </div>
  );
}

export default ParticleBackground;