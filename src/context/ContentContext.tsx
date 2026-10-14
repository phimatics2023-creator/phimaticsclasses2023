import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContentConfig } from '../types';
import { dataStore } from '../services/storage';

interface ContentContextValue {
  content: AppContentConfig;
  savedContent: AppContentConfig;
  isPreviewActive: boolean;
  previewDraft: (draft: AppContentConfig) => void;
  exitPreview: () => void;
  saveContent: (updates: Partial<AppContentConfig>) => void;
  resetCategory: (category: keyof AppContentConfig) => void;
  resetAll: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedContent, setSavedContent] = useState<AppContentConfig>(() => dataStore.getAppContent());
  const [previewDraftState, setPreviewDraftState] = useState<AppContentConfig | null>(null);

  // Subscribe to persistent dataStore changes
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setSavedContent(dataStore.getAppContent());
    });
    return unsubscribe;
  }, []);

  const isPreviewActive = previewDraftState !== null;
  const content = previewDraftState ?? savedContent;

  const previewDraft = (draft: AppContentConfig) => {
    setPreviewDraftState(draft);
  };

  const exitPreview = () => {
    setPreviewDraftState(null);
  };

  const saveContent = (updates: Partial<AppContentConfig>) => {
    dataStore.updateAppContent(updates);
    setPreviewDraftState(null);
  };

  const resetCategory = (category: keyof AppContentConfig) => {
    dataStore.resetAppContent(category);
    setPreviewDraftState(null);
  };

  const resetAll = () => {
    dataStore.resetAppContent();
    setPreviewDraftState(null);
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        savedContent,
        isPreviewActive,
        previewDraft,
        exitPreview,
        saveContent,
        resetCategory,
        resetAll
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useAppContent = (): ContentContextValue => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    // Graceful fallback if called outside provider (e.g. initial render)
    const fallback = dataStore.getAppContent();
    return {
      content: fallback,
      savedContent: fallback,
      isPreviewActive: false,
      previewDraft: () => {},
      exitPreview: () => {},
      saveContent: (u) => dataStore.updateAppContent(u),
      resetCategory: (c) => dataStore.resetAppContent(c),
      resetAll: () => dataStore.resetAppContent()
    };
  }
  return ctx;
};
