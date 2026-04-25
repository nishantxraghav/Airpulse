import { useNavigate } from 'react-router-dom';
import { LuWind, LuHouse } from 'react-icons/lu';
import Button from '../../components/common/Button/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <LuWind size={48} className={styles.windIcon} />
        </div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Looks like you're lost in the smog</h2>
        <p className={styles.desc}>
          This page doesn't exist or has drifted away like a cloud. Let's get you back to cleaner air.
        </p>
        <Button variant="primary" size="lg" icon={<LuHouse size={18} />} onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
