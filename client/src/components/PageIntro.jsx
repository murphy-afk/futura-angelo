export default function PageIntro({ eyebrow, title, lede }) {
  return (
    <header className="page-intro">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </header>
  );
}
