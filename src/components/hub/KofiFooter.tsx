import { Coffee } from 'lucide-react';

export const KofiFooter = () => {
  return (
    <div className="w-full flex justify-center py-4 mt-8">
      <a
        href="https://ko-fi.com/mezohehe"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[10px] transition-colors hover:text-foreground opacity-60 hover:opacity-100"
        style={{ color: '#A0AFB7' }}
      >
        <span>Help keep Lernen Hub ad-free</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-accent to-primary text-primary-foreground font-medium text-[9px]">
          <Coffee className="w-2.5 h-2.5" />
          Support me!
        </span>
      </a>
    </div>
  );
};
