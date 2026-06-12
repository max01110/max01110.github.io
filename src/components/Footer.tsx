import { personalInfo } from '../data/content';
import { useEasterEggs } from '../easter-eggs/EasterEggs';

export default function Footer() {
  const { trigger } = useEasterEggs();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/60 relative z-10">
      <div className="max-w-content mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-600">
          <p>
            <span
              onClick={() => trigger('invaders')}
              className="cursor-default select-none"
            >&copy;</span>
            {' '}{new Date().getFullYear()} {personalInfo.name}
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${personalInfo.email}`} className="hover:text-cyan-500 no-underline transition-colors">
              Email
            </a>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 no-underline transition-colors">
              GitHub
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 no-underline transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
