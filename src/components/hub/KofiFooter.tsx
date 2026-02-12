import { Coffee } from 'lucide-react';

export const KofiFooter = () => {
  return (
    <div className="w-full flex justify-center py-6">
      <a
        href="https://ko-fi.com/mezohehe"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm transition-colors hover:text-foreground"
        style={{ color: '#A0AFB7' }}
      >
        <span>Help keep Lernen Hub ad-free</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold text-xs">
          <Coffee className="w-3.5 h-3.5" />
          Support me!
        </span>
      </a>
    </div>
  );
};
