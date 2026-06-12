import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/content';
import { useEasterEggs } from '../easter-eggs/EasterEggs';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

type NavLink = { name: string; href: string; external?: boolean };

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const { trigger } = useEasterEggs();
  const links: NavLink[] = [
    { name: 'about', href: '#about' },
    { name: 'education', href: '#education' },
    { name: 'publications', href: '#publications' },
    { name: 'projects', href: '#projects' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-navy-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-content mx-auto px-6 py-3.5">
        <nav className="flex items-center justify-between">
          <motion.a
            href="#"
            className="font-mono text-sm no-underline text-slate-900 dark:text-slate-100"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="text-cyan-500">~</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-800 dark:text-slate-200">
              {personalInfo.name.toLowerCase().replace(' ', '-')}
            </span>
            {/* Easter egg: the blinking terminal cursor launches Snake */}
            <motion.span
              className="text-cyan-500 ml-0.5"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'steps(2)' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                trigger('snake');
              }}
            >
              _
            </motion.span>
          </motion.a>

          <div className="flex items-center gap-5">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="nav-link hidden sm:block"
              >
                {l.name}
              </a>
            ))}

            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 20 }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          </div>
        </nav>
      </div>
    </header>
  );
}
