import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function FloatingLanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <aside
      aria-label="Language switcher"
      className="fixed bottom-6 right-6 z-50 animate-fade-in print:hidden"
    >
      <div className="clay-card-3d bg-white/95 backdrop-blur-md px-3 py-2 rounded-full border-2 border-emerald-300 shadow-[0_10px_30px_rgba(22,101,52,0.2)] flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Globe size={14} className="animate-spin-slow" />
        </div>

        <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-black">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
              lang === 'en'
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : 'text-gray-600 hover:text-emerald-800 hover:bg-white/60'
            }`}
            title="Switch to English"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
              lang === 'hi'
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : 'text-gray-600 hover:text-emerald-800 hover:bg-white/60'
            }`}
            title="हिन्दी में अनुवाद करें (Translate to Hindi)"
          >
            हिन्दी
          </button>
        </div>
      </div>
    </aside>
  );
}
