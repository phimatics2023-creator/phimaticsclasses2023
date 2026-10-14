import React, { useState, useMemo, useEffect } from 'react';
import { AuthUser, AppContentConfig } from '../types';
import { dataStore } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { compressImage } from '../utils/imageCompressor';
import { 
  CONTENT_CATEGORIES, 
  CATEGORY_FIELD_DEFINITIONS,
  DEFAULT_APP_CONTENT
} from '../services/defaultContent';
import { 
  Settings, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  RotateCcw,
  Search,
  Eye,
  EyeOff,
  Save,
  X,
  AlertTriangle,
  FileText,
  Sliders,
  Check,
  Building,
  HelpCircle
} from 'lucide-react';

interface AppSettingsViewProps {
  currentUser: AuthUser | null;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser?.role === 'admin';
  const { 
    content: effectiveContent, 
    savedContent, 
    isPreviewActive, 
    previewDraft, 
    exitPreview, 
    saveContent, 
    resetCategory, 
    resetAll 
  } = useAppContent();

  // Local draft state for editing
  const [draft, setDraft] = useState<AppContentConfig>(() => JSON.parse(JSON.stringify(savedContent)));
  const [activeCategory, setActiveCategory] = useState<keyof AppContentConfig>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Restore defaults modal state
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreScope, setRestoreScope] = useState<'category' | 'all'>('category');

  // File upload state for logo
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);

  // Synchronize draft when savedContent changes outside (e.g. from dataStore update)
  useEffect(() => {
    if (!isPreviewActive) {
      setDraft(JSON.parse(JSON.stringify(savedContent)));
    }
  }, [savedContent, isPreviewActive]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Determine if draft has unsaved changes compared to savedContent
  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(savedContent);
  }, [draft, savedContent]);

  // Handle individual field change
  const handleFieldChange = (category: keyof AppContentConfig, fieldKey: string, value: string) => {
    setDraft(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [fieldKey]: value
      }
    }));
  };

  // Save changes permanently
  const handleSaveChanges = () => {
    saveContent(draft);
    showNotification('All content & text customizations saved successfully! Updated across the entire app.', 'success');
  };

  // Cancel unsaved changes
  const handleCancelChanges = () => {
    if (isPreviewActive) {
      exitPreview();
    }
    setDraft(JSON.parse(JSON.stringify(savedContent)));
    showNotification('Unsaved changes discarded. Restored currently saved content.', 'info');
  };

  // Toggle Live Preview mode
  const handleTogglePreview = () => {
    if (isPreviewActive) {
      exitPreview();
      showNotification('Exited Preview mode. Restored saved content view.', 'info');
    } else {
      previewDraft(draft);
      showNotification('Preview mode active! You are viewing draft changes live across the app.', 'info');
    }
  };

  // Confirm restore defaults
  const handleConfirmRestore = () => {
    if (restoreScope === 'category') {
      resetCategory(activeCategory);
      setDraft(prev => ({
        ...prev,
        [activeCategory]: JSON.parse(JSON.stringify(DEFAULT_APP_CONTENT[activeCategory]))
      }));
      showNotification(`Default text restored for "${CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.title}".`, 'success');
    } else {
      resetAll();
      setDraft(JSON.parse(JSON.stringify(DEFAULT_APP_CONTENT)));
      showNotification('All application text and content have been restored to defaults.', 'success');
    }
    setRestoreModalOpen(false);
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image file (PNG, JPG, SVG, or WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Logo image file must be smaller than 5 MB.', 'error');
      return;
    }

    setIsProcessingLogo(true);
    compressImage(file, 300, 300, 0.8)
      .then((dataUrl) => {
        dataStore.updateLogo(dataUrl);
        handleFieldChange('general', 'logoUrl', dataUrl);
        showNotification('Official institution logo uploaded and saved permanently!', 'success');
        setIsProcessingLogo(false);
      })
      .catch((err) => {
        console.error('Failed to compress logo:', err);
        showNotification('Failed to process image file. Please try again.', 'error');
        setIsProcessingLogo(false);
      });
    e.target.value = '';
  };

  // Remove custom logo
  const handleRemoveLogo = () => {
    if (window.confirm('Reset to default official PhiMatiCs Classes emblem?')) {
      dataStore.removeLogo();
      handleFieldChange('general', 'logoUrl', '');
      showNotification('Custom logo removed. Default PhiMatiCs emblem restored.', 'info');
    }
  };

  // Search filtering logic across all categories
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    const results: Array<{
      categoryKey: keyof AppContentConfig;
      categoryTitle: string;
      fieldKey: string;
      label: string;
      description?: string;
      value: string;
      type: 'text' | 'textarea' | 'logo';
    }> = [];

    CONTENT_CATEGORIES.forEach(cat => {
      const defs = CATEGORY_FIELD_DEFINITIONS[cat.key] || [];
      defs.forEach(def => {
        const val = String((draft[cat.key] as any)?.[def.key] || '');
        if (
          def.label.toLowerCase().includes(query) ||
          def.key.toLowerCase().includes(query) ||
          val.toLowerCase().includes(query) ||
          (def.description && def.description.toLowerCase().includes(query)) ||
          cat.title.toLowerCase().includes(query)
        ) {
          results.push({
            categoryKey: cat.key,
            categoryTitle: cat.title,
            fieldKey: def.key,
            label: def.label,
            description: def.description,
            value: val,
            type: def.type
          });
        }
      });
    });

    return results;
  }, [searchQuery, draft]);

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-xs my-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-2">Administrator Access Required</h3>
        <p className="text-sm text-slate-500">
          Only administrators have permission to access and modify application text, branding, and content settings.
        </p>
      </div>
    );
  }

  const currentActiveLogo = draft.general.logoUrl && draft.general.logoUrl.trim() !== ''
    ? draft.general.logoUrl
    : '/phimatics-logo.svg';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Content & Settings</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Edit and customize user-facing text, headings, and branding across the entire app without changing code.
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Preview Button */}
          <button
            onClick={handleTogglePreview}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isPreviewActive 
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-300' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Preview draft changes live across the app"
          >
            {isPreviewActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-sky-600" />}
            <span>{isPreviewActive ? 'Exit Preview' : 'Preview Changes'}</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={handleCancelChanges}
            disabled={!isDirty && !isPreviewActive}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          {/* Restore Defaults Button */}
          <button
            onClick={() => {
              setRestoreScope('category');
              setRestoreModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          {/* Save Changes Button */}
          <button
            onClick={handleSaveChanges}
            disabled={!isDirty}
            className="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Alert / Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 animate-fadeIn border ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : notification.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {notification.type === 'info' && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
          <p className="flex-1">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Preview Indicator */}
      {isPreviewActive && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="font-bold">Live Content Preview Mode Active</span>
            <span className="text-amber-700 hidden sm:inline">• You are currently previewing unsaved text edits across the app.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSaveChanges}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              Commit & Save
            </button>
            <button
              onClick={exitPreview}
              className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 font-semibold text-xs"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Dirty Changes Warning Indicator */}
      {isDirty && !isPreviewActive && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>You have unsaved changes in this session.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePreview}
              className="font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Preview First
            </button>
            <span className="text-blue-300">|</span>
            <button
              onClick={handleSaveChanges}
              className="font-bold text-blue-900 hover:underline flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save Now
            </button>
          </div>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all text items (e.g. tuition, login, batch, attendance, fees, phone)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* If Search is Active, Show Search Results View */}
      {searchResults !== null ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Search Results</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing fields matching "{searchQuery}". Edit fields directly below and click Save.
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear Search
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No text items found matching "{searchQuery}"</p>
              <p className="text-xs mt-1">Try another keyword or browse categories below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((res) => (
                <div key={`${res.categoryKey}_${res.fieldKey}`} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {res.categoryTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {res.fieldKey}
                    </span>
                  </div>

                  <label className="block text-xs font-bold text-slate-800">
                    {res.label}
                  </label>

                  {res.description && (
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {res.description}
                    </p>
                  )}

                  {res.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={(draft[res.categoryKey] as any)?.[res.fieldKey] || ''}
                      onChange={(e) => handleFieldChange(res.categoryKey, res.fieldKey, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(draft[res.categoryKey] as any)?.[res.fieldKey] || ''}
                      onChange={(e) => handleFieldChange(res.categoryKey, res.fieldKey, e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Normal Category View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar / Mobile Pills Selector */}
          <div className="lg:col-span-1 space-y-1.5">
            {/* Mobile Dropdown / Horizontal Tabs */}
            <div className="block lg:hidden mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as keyof AppContentConfig)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {CONTENT_CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {cat.title} ({cat.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Categories List */}
            <div className="hidden lg:block bg-white p-2 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Content Categories
              </div>
              {CONTENT_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{cat.title}</div>
                      <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {cat.badge}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Category Reset Helper Box */}
            <div className="hidden lg:block bg-slate-100/80 p-4 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Quick Reset
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Want to revert only the current category to its factory defaults?
              </p>
              <button
                onClick={() => {
                  setRestoreScope('category');
                  setRestoreModalOpen(true);
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] border border-slate-200 shadow-2xs cursor-pointer transition text-center"
              >
                Reset "{CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.title}"
              </button>
            </div>
          </div>

          {/* Active Category Content Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Category Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.badge}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    {CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setRestoreScope('category');
                      setRestoreModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset This Section</span>
                  </button>
                </div>
              </div>

              {/* Form Fields Area */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Special Logo Section inside General Settings */}
                {activeCategory === 'general' && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Official Institution Logo</h3>
                          <p className="text-xs text-slate-500">
                            Upload your official logo file or reset to the bundled emblem.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {draft.general.logoUrl && draft.general.logoUrl.trim() !== '' && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                        <label className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer ${
                          isProcessingLogo ? 'opacity-60 pointer-events-none' : ''
                        }`}>
                          <Upload className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isProcessingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={isProcessingLogo}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Logo Preview Strip */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-200/80">
                      <div className="h-16 w-32 rounded-xl bg-slate-950 flex items-center justify-center p-2 border border-slate-800 shrink-0">
                        <img
                          src={currentActiveLogo}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        <p className="font-semibold text-slate-700">
                          Status: {draft.general.logoUrl ? 'Custom Logo Uploaded' : 'Bundled Official PhiMatiCs Emblem'}
                        </p>
                        <p className="text-[11px]">
                          Beside the logo, the app displays: <strong>{draft.general.appName}</strong> • <span className="text-sky-600">{draft.general.tagline}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Category Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(CATEGORY_FIELD_DEFINITIONS[activeCategory] || []).map((field) => {
                    const value = String((draft[activeCategory] as any)?.[field.key] || '');
                    const isLongField = field.type === 'textarea';

                    return (
                      <div 
                        key={field.key} 
                        className={`space-y-1.5 ${isLongField ? 'md:col-span-2' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {field.label}
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {field.key}
                          </span>
                        </div>

                        {field.description && (
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {field.description}
                          </p>
                        )}

                        {isLongField ? (
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(e) => handleFieldChange(activeCategory, field.key, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label}...`}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleFieldChange(activeCategory, field.key, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label}...`}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Changes take effect across all student and administrator views once saved.
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCancelChanges}
                      disabled={!isDirty}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={!isDirty}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Defaults Confirmation Modal */}
      {restoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Restore Default Text Content?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose whether you want to reset only the current section or all application text back to factory defaults.
                </p>
              </div>

              {/* Scope options */}
              <div className="space-y-2 pt-2">
                <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  restoreScope === 'category' 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="restoreScope"
                      checked={restoreScope === 'category'}
                      onChange={() => setRestoreScope('category')}
                      className="text-indigo-600"
                    />
                    <span>Reset only "{CONTENT_CATEGORIES.find(c => c.key === activeCategory)?.title}"</span>
                  </div>
                </label>

                <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  restoreScope === 'all' 
                    ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="restoreScope"
                      checked={restoreScope === 'all'}
                      onChange={() => setRestoreScope('all')}
                      className="text-rose-600"
                    />
                    <span>Reset ALL 10 Categories to Defaults</span>
                  </div>
                </label>
              </div>

              <p className="text-[11px] text-slate-400">
                Note: Your student records, batches, attendance logs, and fee payments will NOT be touched.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRestoreModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Restore</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
