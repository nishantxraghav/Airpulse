import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuSettings, LuMonitor, LuDatabase, LuBell, LuCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';
import {
  setTheme,
  setRefreshInterval,
  setAlertThreshold,
  setTemperatureUnit,
} from '../../store/preferencesSlice';
import { REFRESH_INTERVALS } from '../../utils/constants';
import { getAqiLevel } from '../../utils/aqiHelpers';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import styles from './Settings.module.css';

export default function Settings() {
  const dispatch = useDispatch();
  const prefs = useSelector((s) => s.preferences);

  // Local form state — multi-step aware
  const [step, setStep] = useState(1); // 1: threshold, 2: notification pref, 3: confirm
  const [form, setForm] = useState({
    theme: prefs.theme,
    refreshInterval: prefs.refreshInterval,
    alertThreshold: prefs.alertThreshold,
    temperatureUnit: prefs.temperatureUnit,
    notifyMethod: 'toast', // mock notification preference
  });
  const [errors, setErrors] = useState({});

  // Sync prefs into form on mount
  useEffect(() => {
    setForm({
      theme: prefs.theme,
      refreshInterval: prefs.refreshInterval,
      alertThreshold: prefs.alertThreshold,
      temperatureUnit: prefs.temperatureUnit,
      notifyMethod: 'toast',
    });
  }, []);

  const validate = () => {
    const errs = {};
    const t = Number(form.alertThreshold);
    if (!t || t < 1 || t > 5 || !Number.isInteger(t)) {
      errs.alertThreshold = 'Threshold must be a whole number between 1 and 5.';
    }
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(setTheme(form.theme));
    dispatch(setRefreshInterval(Number(form.refreshInterval)));
    dispatch(setAlertThreshold(Number(form.alertThreshold)));
    dispatch(setTemperatureUnit(form.temperatureUnit));
    toast.success('Settings saved!');
    setStep(1);
  };

  const level = getAqiLevel(form.alertThreshold);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          <LuSettings size={22} />
          Settings
        </h1>
        <p className={styles.subtitle}>Customize your AirPulse experience</p>
      </div>

      {/* Display settings */}
      <Card className={styles.section}>
        <div className={styles.sectionHead}>
          <LuMonitor size={18} />
          <h2 className={styles.sectionTitle}>Display</h2>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Theme</label>
          <div className={styles.themeOptions}>
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                className={[styles.themeBtn, form.theme === t ? styles.themeBtnActive : ''].join(' ')}
                onClick={() => setForm((f) => ({ ...f, theme: t }))}
              >
                <span>{t === 'light' ? '☀️' : '🌙'}</span>
                <span style={{ textTransform: 'capitalize' }}>{t}</span>
                {form.theme === t && <LuCheck size={14} />}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Temperature Unit</label>
          <div className={styles.toggleRow}>
            {['celsius', 'fahrenheit'].map((u) => (
              <button
                key={u}
                className={[styles.unitBtn, form.temperatureUnit === u ? styles.unitBtnActive : ''].join(' ')}
                onClick={() => setForm((f) => ({ ...f, temperatureUnit: u }))}
              >
                {u === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Data settings */}
      <Card className={styles.section}>
        <div className={styles.sectionHead}>
          <LuDatabase size={18} />
          <h2 className={styles.sectionTitle}>Data & Refresh</h2>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="refresh">Auto-refresh Interval</label>
          <select
            id="refresh"
            className={styles.select}
            value={form.refreshInterval}
            onChange={(e) => setForm((f) => ({ ...f, refreshInterval: Number(e.target.value) }))}
          >
            {REFRESH_INTERVALS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <p className={styles.hint}>Dashboard data will automatically refresh at this interval.</p>
        </div>
      </Card>

      {/* Alert settings — multi-step */}
      <Card className={styles.section}>
        <div className={styles.sectionHead}>
          <LuBell size={18} />
          <h2 className={styles.sectionTitle}>Alert Configuration</h2>
          <span className={styles.stepBadge}>Step {step} / 3</span>
        </div>

        {/* Step progress */}
        <div className={styles.stepProgress}>
          {[1, 2, 3].map((s) => (
            <div key={s} className={[styles.stepDot, step >= s ? styles.stepDotActive : ''].join(' ')}>
              {step > s ? <LuCheck size={12} /> : s}
            </div>
          ))}
          <div className={styles.stepLine} style={{ width: `${((step - 1) / 2) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className={styles.stepContent}>
            <p className={styles.stepLabel}>Set your AQI alert threshold (1 = Good, 5 = Very Poor)</p>
            <div className={styles.thresholdWrap}>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={form.alertThreshold}
                onChange={(e) => {
                  setForm((f) => ({ ...f, alertThreshold: Number(e.target.value) }));
                  setErrors({});
                }}
                className={styles.slider}
                style={{ '--slider-color': level.color }}
              />
              <div className={styles.thresholdDisplay} style={{ color: level.color, borderColor: `${level.color}40`, background: `${level.color}12` }}>
                <span className={styles.thresholdEmoji}>{level.emoji}</span>
                <span className={styles.thresholdValue}>{form.alertThreshold}</span>
                <span className={styles.thresholdLabel}>{level.label}</span>
              </div>
            </div>
            {errors.alertThreshold && <p className={styles.error}>{errors.alertThreshold}</p>}
            <Button variant="primary" size="sm" onClick={() => setStep(2)}>Next →</Button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <p className={styles.stepLabel}>How would you like to be notified?</p>
            <div className={styles.notifyOptions}>
              {[
                { val: 'toast', label: '🔔 In-app toast notification' },
                { val: 'banner', label: '📢 Dashboard banner warning' },
                { val: 'both', label: '✅ Both' },
              ].map((o) => (
                <button
                  key={o.val}
                  className={[styles.notifyBtn, form.notifyMethod === o.val ? styles.notifyBtnActive : ''].join(' ')}
                  onClick={() => setForm((f) => ({ ...f, notifyMethod: o.val }))}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className={styles.stepActions}>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" size="sm" onClick={() => setStep(3)}>Next →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <p className={styles.stepLabel}>Confirm your alert settings</p>
            <div className={styles.confirmBox}>
              <div className={styles.confirmRow}>
                <span>Alert when AQI ≥</span>
                <strong style={{ color: level.color }}>{form.alertThreshold} ({level.label})</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Notification method</span>
                <strong>{form.notifyMethod}</strong>
              </div>
            </div>
            <div className={styles.stepActions}>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>← Back</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Save button */}
      <div className={styles.saveRow}>
        <Button variant="primary" size="lg" onClick={handleSave}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
