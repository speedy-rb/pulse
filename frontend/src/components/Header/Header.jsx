import styles from './Header.module.css';
import { Link } from 'react-router-dom';

function Header() {
    return <>
      <nav>
        <ul className={styles.navList}>
            <li className={styles.linkElem}><Link to="/gallery">Gallery</Link></li>
            <li className={styles.linkElem}><Link to="/calendar">Calender</Link></li>
        </ul>
      </nav>
    </>
}

export default Header