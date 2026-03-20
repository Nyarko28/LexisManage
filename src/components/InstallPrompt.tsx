import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'lexismanage_install_dismissed_v1';

export function InstallPrompt() {
  const isIOS = useMemo(() => {
    const ua = navigator.userAgent || '';
    const platform = (navigator as any).platform || '';
    return /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-2rem)] max-w-md">
      <div className="bg-indigo-600 text-white rounded-2xl shadow-lg border border-indigo-500/40">
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="text-sm font-bold">Install LexisManage for quick access</div>
            {isIOS ? (
              <div className="text-xs opacity-95 mt-1 leading-relaxed">
                Tap the share button then &apos;Add to Home Screen&apos;.
              </div>
            ) : (
              <div className="text-xs opacity-95 mt-1">
                Add LexisManage to your home screen.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 shrink-0"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isIOS && (
          <div className="px-4 pb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleInstall}
              className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors"
            >
              Install
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

