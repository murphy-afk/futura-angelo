import { Link, Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function SiteLayout() {
  return (
    <div className="site">
      <Link className="skip-link" to="#contenuto">Vai al contenuto</Link>
      <SiteHeader></SiteHeader>
      <div className="site-body"><Outlet /></div>
      <SiteFooter></SiteFooter>
    </div>
  );
}
