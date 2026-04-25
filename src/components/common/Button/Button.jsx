import styles from './Button.module.css';

/**
 * Reusable button component.
 * @param {('primary'|'secondary'|'ghost'|'danger')} variant
 * @param {('sm'|'md'|'lg')} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon = null,
  iconRight = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && !iconRight && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {!loading && icon && iconRight && <span className={styles.icon}>{icon}</span>}
    </button>
  );
}
