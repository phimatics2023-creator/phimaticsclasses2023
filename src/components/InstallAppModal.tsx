import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  WifiOff, 
  Zap,
  Info
} from 'lucide-react';
import { Logo } from './Logo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallAccepted?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallAccepted
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'guide'>('android');
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>('idle');

  if (!isOpen) return null;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setInstallStatus('installing');
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallStatus('installed');
          onInstallAccepted?.();
          setTimeout(() => {
            onClose();
          }, 1800);
        } else {
          setInstallStatus('idle');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
        setInstallStatus('idle');
      }
    } else {
      setActiveTab('guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
              <img 
                src="/pwa-192x192.png" 
                alt="PhiMatiCs Classes App" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Android & Mobile App</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">PhiMatiCs Classes</h2>
              <p className="text-xs text-slate-300">Fast install directly on your device</p>
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('android')}
            className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'android'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Install on Android</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span>Installation Guide & Info</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600">
          {activeTab === 'android' ? (
            <>
              {/* Direct 1-Click Action */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-emerald-950 text-base">Direct Install to Home Screen</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Install PhiMatiCs Classes as a full native Android app. It will appear directly on your home screen and app drawer with the official emblem, offline access, and full screen experience.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Download className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4">
                  {deferredPrompt ? (
                    <button
                      onClick={handleNativeInstall}
                      disabled={installStatus === 'installing' || installStatus === 'installed'}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {installStatus === 'installed' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>App Installed Successfully!</span>
                        </>
                      ) : installStatus === 'installing' ? (
                        <span>Installing application...</span>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Install Android App Now</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Open in Chrome Intent for Android */}
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900">Are you viewing inside WhatsApp or social app?</span>
                          <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 font-bold text-[10px] rounded-full">Android Tip</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          In-app browsers (like WhatsApp/Instagram) disable app installs. Tap below to launch directly in official Google Chrome:
                        </p>
                        <a
                          href={`intent://${typeof window !== 'undefined' ? (window.location.host + window.location.pathname) : 'ais-pre-y2brggnruzbpbz5wxbg7sn-351571995761.asia-east1.run.app'}#Intent;scheme=https;package=com.android.chrome;end`}
                          className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 text-center"
                        >
                          <span>🚀 Open in Google Chrome App</span>
                        </a>
                      </div>

                      <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 text-xs text-slate-700 space-y-2">
                        <p className="font-bold text-emerald-900">3 Quick Steps to Install in Chrome on Android:</p>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                          <li>In Google Chrome, tap the <strong className="text-slate-900">Three Dots Menu (⋮)</strong> at top right.</li>
                          <li>Tap <strong className="text-emerald-700">"Install app"</strong> or <strong className="text-emerald-700">"Add to Home screen"</strong>.</li>
                          <li>Confirm <strong className="text-slate-900">"Install"</strong> to add the PhiMatiCs icon directly to your phone's home screen!</li>
                        </ol>
                      </div>

                      {/* Fix for "This app cannot be installed" error */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <span>💡</span>
                          <span>Fix: If Chrome says "This app cannot be installed"</span>
                        </div>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                          Some Android phones restrict Google Play WebAPK packaging. In Chrome's menu (⋮), simply choose <strong>"Add to Home screen"</strong> instead of "Install", or use the <strong>Download HTML</strong> button below to save the offline app directly!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Link & Standalone APK packaging */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Direct App URL (Open on Android):</span>
                  <button
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-y2brggnruzbpbz5wxbg7sn-351571995761.asia-east1.run.app';
                      navigator.clipboard.writeText(url);
                      alert('App URL copied to clipboard! Open this in Google Chrome on your Android phone.');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 truncate select-all">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-y2brggnruzbpbz5wxbg7sn-351571995761.asia-east1.run.app'}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Tip: Copy this link and paste it into <strong>Google Chrome</strong> on your phone.
                </p>
              </div>

                {/* Direct Project File Downloads */}
                <div className="p-4 rounded-2xl bg-indigo-950 text-white border border-indigo-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-indigo-100">Direct Downloadable Project Files</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Ready</span>
                  </div>
                  <p className="text-[11px] text-indigo-200 leading-relaxed">
                    Download the application files directly to save on your phone or PC:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                    <a
                      href="/phimatics-classes-offline-app.html"
                      download="phimatics-classes-offline-app.html"
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HTML</span>
                    </a>
                    <a
                      href="/phimatics-classes-app-bundle.zip"
                      download="phimatics-classes-app-bundle.zip"
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ZIP</span>
                    </a>
                  </div>
                  <a
                    href="https://www.pwabuilder.com/reportcard?site=https://ais-pre-y2brggnruzbpbz5wxbg7sn-351571995761.asia-east1.run.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-center text-xs shadow-md transition"
                  >
                    🤖 Generate Android APK File (PWABuilder) ↗
                  </a>
                  <a
                    href="/phimatics-download-hub.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[11px] font-bold text-emerald-400 hover:underline pt-1"
                  >
                    Open Download Hub Page ↗
                  </a>
                </div>

                {/* App Perks / Why this is superior */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Instant Speed</h4>
                      <p className="text-[11px] text-slate-500">Loads in &lt;1s with smart precaching.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                    <WifiOff className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Offline Ready</h4>
                      <p className="text-[11px] text-slate-500">Review attendance and notes without internet.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Private & Secure</h4>
                      <p className="text-[11px] text-slate-500">Zero telemetry, local encrypted storage.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Zero Storage Bloat</h4>
                      <p className="text-[11px] text-slate-500">Under 2 MB, auto-updates automatically.</p>
                    </div>
                  </div>
                </div>
            </>
          ) : (
            <>
              {/* Detailed Technical & Manual Installation Guide */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                  <p className="font-bold mb-1">About Android APK vs PWA Installation:</p>
                  <p>
                    PhiMatiCs Classes is built as a progressive web application conforming to modern Android standards. Android systems run this directly via the native WebAPK service — giving you the full native Android app icon, splash screen, and standalone window without needing to download untrusted third-party APK installer files.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Step-by-Step Instructions</h4>

                  {/* Chrome on Android */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Android (Chrome / Samsung Internet / Brave / Edge)</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
                      <li>Open this app in Chrome on your Android phone.</li>
                      <li>Tap the <strong>⋮ (Menu)</strong> icon in the top right.</li>
                      <li>Tap <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>).</li>
                      <li>Click <strong>Install</strong>. Android will create the official app shortcut on your home screen.</li>
                    </ol>
                  </div>

                  {/* iOS Safari */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1.5">
                      <Share className="w-4 h-4 text-sky-600" />
                      <span>Apple iPhone / iPad (Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
                      <li>Open this URL in <strong>Safari</strong>.</li>
                      <li>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-sky-600" /> at the bottom.</li>
                      <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-600" />.</li>
                      <li>Tap <strong>Add</strong> at the top right.</li>
                    </ol>
                  </div>

                  {/* Desktop Chrome / Edge */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1.5">
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span>Desktop (Chrome / Edge / Brave)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Look for the <strong>Install</strong> icon in the address bar (top right) or press the <strong>Install</strong> button in the app navigation bar.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>PhiMatiCs Classes Portal v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
