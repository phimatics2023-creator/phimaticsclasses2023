import React, { useRef, useState } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { dataStore } from '../services/storage';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = dataStore.getStoredSession();
  if (!isOpen || !session || session.role !== 'admin') return null;

  const db = dataStore.getSnapshot();
  const isCustomized = db.isCustomized;

  const handleExportJson = () => {
    const jsonString = dataStore.exportBackupJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phimatics_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const res = dataStore.importBackupJson(content);
      if (res.success) {
        setImportStatus('Backup loaded successfully! Records updated.');
      } else {
        setImportStatus(`Failed: ${res.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore the default sample data? Any unexported changes will be reset.')) {
      dataStore.resetToDefault();
      setImportStatus('Reset to default initial data completed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Database & Cloud Storage Configuration</h2>
              <p className="text-xs text-slate-300">Persistence status, zero-cost budget & Firebase instructions</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {importStatus && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Current Status Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-slate-900">Current Storage: Offline & Local Persistence</h4>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Data is actively saved in browser LocalStorage. All changes persist across reloads.
              </p>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
              isCustomized 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
              {isCustomized ? '● Real Saved Custom Data' : '● Seed Sample Data Active'}
            </span>
          </div>

          {/* Backup, Export & Restore Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Backup & Data Portability
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleExportJson}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                Download JSON Backup
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Restore from JSON
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={handleResetData}
                className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-red-50 hover:text-red-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sample Data
              </button>
            </div>
          </div>

          {/* Database Collections Schema */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              Cloud Firestore Schema (Defined in firebase-blueprint.json)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/students/{'{studentId}'}</span>
                <p className="text-slate-500 mt-0.5">Admin-enrolled students with batch, roll no & status.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/attendance/{'{recordId}'}</span>
                <p className="text-slate-500 mt-0.5">Session records; student reads only own ID.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/announcements/{'{id}'}</span>
                <p className="text-slate-500 mt-0.5">Audience-targeted circulars with pinned priority.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/materials/{'{id}'}</span>
                <p className="text-slate-500 mt-0.5">Grade → Subject → Chapter organized PDF resources.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/gallery/{'{id}'}</span>
                <p className="text-slate-500 mt-0.5">Classroom photos, science experiments & awards.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-sky-700">/settings/contact</span>
                <p className="text-slate-500 mt-0.5">Phone, WhatsApp, address, timings & map link.</p>
              </div>
            </div>
          </div>

          {/* Zero-Budget / ₹0 Free Tier Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>₹0 Budget Guarantee (Firebase Spark Plan)</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Firebase Spark plan is completely free forever. It provides <strong>50,000 document reads/day</strong>, <strong>20,000 document writes/day</strong>, and <strong>1 GB storage</strong>. For an educational coaching class with hundreds of students, this comfortably stays within ₹0 per month without needing any credit card.
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2 text-xs text-slate-600">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider">
              Deployment & Live Firebase Steps:
            </h5>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
              <li>
                <strong>Firebase Console:</strong> Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline font-semibold">console.firebase.google.com</a> and create a free project named "PhiMatiCs Classes".
              </li>
              <li>
                <strong>Cloud Firestore:</strong> Click "Build" → "Firestore Database" → "Create Database" in test/production mode.
              </li>
              <li>
                <strong>Security Rules:</strong> Copy the prepared rules from <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">firestore.rules</code> (already generated in the project) into the Firebase Console rules tab.
              </li>
              <li>
                <strong>Web App Config:</strong> Register a Web App in Firebase Console to obtain your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">firebase-applet-config.json</code> keys.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
