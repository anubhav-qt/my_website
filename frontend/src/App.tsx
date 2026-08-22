import { Nav } from './components/Nav';
import { Now } from './components/sections/Now';
import { Work } from './components/sections/Work';
import { Log } from './components/sections/Log';
import { Scratchpad } from './components/sections/Scratchpad';
import { Stuff } from './components/sections/Stuff';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-body">
      <Nav />
      <main className="max-w-2xl mx-auto px-5 pt-8">
        <Now />
        <Work />
        <Log />
        <Scratchpad />
        <Stuff />
        <Footer />
      </main>
    </div>
  );
}
