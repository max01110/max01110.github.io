import { useState, useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Education from './components/Education';
import Publications from './components/Publications';
import Projects from './components/Projects';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import { EasterEggProvider } from './easter-eggs/EasterEggs';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <EasterEggProvider>
      <div className="min-h-screen relative overflow-x-hidden">
        <AnimatedBackground />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="max-w-content mx-auto px-6 py-8 relative z-10">
          <About />
          <Education />
          <Publications />
          <Projects />
        </main>

        <Footer />
      </div>
    </EasterEggProvider>
  );
}

export default App;
