import styles from './EmptyState.module.css';
import Button from '../Button/Button';

export default function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) {
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {action && actionLabel && (
        <Button variant="primary" onClick={action} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
