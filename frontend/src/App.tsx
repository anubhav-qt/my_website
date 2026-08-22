import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Scratchpad from './pages/Scratchpad';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-body">
      <Nav />
      <main className="max-w-2xl mx-auto px-5 pt-[6px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/scratchpad" element={<Scratchpad />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}
