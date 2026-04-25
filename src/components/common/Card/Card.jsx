import styles from './Card.module.css';

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  padding = 'md',
  ...props
}) {
  return (
    <div
      className={[
        styles.card,
        hover ? styles.hover : '',
        glass ? styles.glass : '',
        styles[`pad_${padding}`],
        onClick ? styles.clickable : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
