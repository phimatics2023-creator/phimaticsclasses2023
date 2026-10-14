import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phimatics.classes',
  appName: 'PhiMatiCs Classes',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
