import styles from './Divider.module.css';

export function Divider() {
  return (
    // 2. Apply the classes using styles.className
    <div className={styles.divider}>
      <span className={styles.dividerText}>OR</span>
    </div>
  );
}
