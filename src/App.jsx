import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';

export default function App() {
  const theme = useSelector((s) => s.preferences.theme);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
