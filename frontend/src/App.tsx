import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, type Location } from 'react-router-dom';
import { Nav } from './components/Nav';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Scratchpad from './pages/Scratchpad';
import ScratchpadEntry from './pages/ScratchpadEntry';
import Contact from './pages/Contact';
import { supabase } from './lib/supabase';

// Every page, once visited, stays mounted for the rest of the tab session instead of
// unmounting on navigation, so scroll position, open accordions, and things like the
// Spoin simulator's playback state survive going elsewhere and coming back.
export default function App() {
  const location = useLocation();
  const [visitedPaths, setVisitedPaths] = useState<string[]>([location.pathname]);

  useEffect(() => {
    setVisitedPaths((prev) => (prev.includes(location.pathname) ? prev : [...prev, location.pathname]));
  }, [location.pathname]);

  useEffect(() => {
    // Fired once per tab: keeps the Supabase project's request-activity clock
    // warm before a visitor reaches the topic-suggestion form. No-op until
    // the backend is provisioned (supabase is null, see lib/supabase.ts).
    supabase?.functions.invoke('wake-ping').catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg text-body">
      <Nav />
      <main className="max-w-2xl mx-auto px-5 pt-[6px]">
        {visitedPaths.map((path) => {
          const isActive = path === location.pathname;
          const slotLocation: Partial<Location> = isActive ? location : { pathname: path };
          return (
            <div key={path} className={isActive ? '' : 'hidden'}>
              <Routes location={slotLocation}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/scratchpad" element={<Scratchpad />} />
                <Route path="/scratchpad/:slug" element={<ScratchpadEntry />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          );
        })}
      </main>
    </div>
  );
}
