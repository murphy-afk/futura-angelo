import { Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import Home from './pages/Home.jsx';
import ChiSiamo from './pages/ChiSiamo.jsx';
import Collezioni from './pages/Collezioni.jsx';
import CollezioneDettaglio from './pages/CollezioneDettaglio.jsx';
import Occasioni from './pages/Occasioni.jsx';
import DoveSiTrova from './pages/DoveSiTrova.jsx';
import Contatti from './pages/Contatti.jsx';
import NonTrovata from './pages/NonTrovata.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/collezioni" element={<Collezioni />} />
        <Route path="/collezioni/:slug" element={<CollezioneDettaglio />} />
        <Route path="/occasioni" element={<Occasioni />} />
        <Route path="/dove-si-trova" element={<DoveSiTrova />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="*" element={<NonTrovata />} />
      </Route>
    </Routes>
  );
}
