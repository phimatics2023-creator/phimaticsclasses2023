import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-updates for full PWA installability on Android & Desktop
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PWA has a new version ready.');
  },
  onOfflineReady() {
    console.log('PhiMatiCs is ready to work offline.');
  },
  onRegisterError(error) {
    console.warn('PWA registration error, trying direct sw.js:', error);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('Direct SW registration note:', err);
      });
    }
  }
});

createRoot(document.getElementById('root')!).render(<App />);
