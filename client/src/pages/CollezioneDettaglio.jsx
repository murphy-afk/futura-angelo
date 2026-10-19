import { useParams } from 'react-router-dom';

export default function CollezioneDettaglio() {
  const { slug } = useParams();

  return (
    <main className="page">
      <div className="container">
        <p className="eyebrow">Collezione</p>
        <h1>{slug}</h1>
        <p className="lede">Dettaglio della collezione in arrivo nella sessione di interfaccia.</p>
      </div>
    </main>
  );
}
